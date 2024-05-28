import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VocabularyTag, VocabularyTagDocument } from "./vocabulary-tag.schema";
import logging from "src/configs/logging";
import { CreateVocabularyTagRequestDTO } from "./dtos/requests/CreateVocabularyTagRequestDTO";
import { Request } from "express";
import { AuthService } from "../auth/auth.service";
import { VocabularyService } from "../vocabulary/vocabulary.service";
import { VocabularyDocument } from "../vocabulary/vocabulary.schema";

@Injectable()
export class VocabularyTagService {
    constructor(@InjectModel(VocabularyTag.name) private vocabularyTagModel: Model<VocabularyTag>,
        @Inject('AUTH_SERVICE_TIENNT') private readonly authService: AuthService,
        @Inject(forwardRef(() => 'VOCABULARY_SERVICE_PHATTV')) private readonly vocabularyService: VocabularyService) { }

    async getVocabTagFromAccountId(accountId: string): Promise<VocabularyTagDocument[]> {
        return this.vocabularyTagModel.find({
            accountId: accountId
        })
            .exec()
    }

    async getVocabTagBytagName(tagName: string): Promise<VocabularyTagDocument> {
        return this.vocabularyTagModel.findOne({
            name: tagName
        })
            .exec()
    }

    async createTagForAccountId(accountId: string, tag: string, description: string, picture: string) {
        let newTag: VocabularyTag = {
            accountId: accountId,
            name: tag,
            description,
            picture
        }
        await new this.vocabularyTagModel(newTag).save()
            .then(rs => {
                logging.info("create new tag because of not existed", "createTagForAccountId()");
                logging.info("new tag: " + JSON.stringify(rs), "createTagForAccountId()");
                return rs;
            })
            .catch(err => {
                throw new InternalServerErrorException()
            })
    }

    private async getAccountIdFromrequest(request: Request) {
        logging.info("get token from request", "createNewVocabulary()")
        let token: string = request.headers.authorization;
        logging.info("token: " + token, "createNewVocabulary()")
        logging.info("get accountId from token", "createNewVocabulary()")
        return this.authService.getAccountIdFromToken(token)
    }

    async createNewVocabularyTag(dto: CreateVocabularyTagRequestDTO, request: Request) {
        logging.info("////// START CREATE VOCAB TAG //////")

        let accountId: string = await this.getAccountIdFromrequest(request)

        let tagDocuments: VocabularyTagDocument[] = await this.getVocabTagFromAccountId(accountId)
            .then(tags => tags)
            .catch(err => {
                throw new InternalServerErrorException();
            })

        let checkIfTagIsExisted: boolean = false;
        for (const tagDocument of tagDocuments) {
            if (tagDocument.name === dto.name) {
                checkIfTagIsExisted = true;
                break;
            }
        }
        console.log("checkIfTagIsExisted: " + checkIfTagIsExisted)
        if (checkIfTagIsExisted) {
            throw new HttpException('Dupplicated tag', HttpStatus.BAD_REQUEST);
        }

        if (!checkIfTagIsExisted) {
            await this.createTagForAccountId(accountId, dto.name, dto.description, dto.picture)
        }

        logging.info("////// END CREATE VOCAB TAG//////")
    }

    async updateVocabularyTag(id: string, dto: CreateVocabularyTagRequestDTO, request: Request) {
        logging.info("////// START CREATE VOCAB TAG //////")

        let accountId: string = await this.getAccountIdFromrequest(request)

        let tagDocuments: VocabularyTagDocument[] = await this.getVocabTagFromAccountId(accountId)
            .then(tags => tags)
            .catch(err => {
                throw new InternalServerErrorException();
            })

        let checkIfTagIsExisted: boolean = false;
        for (const tagDocument of tagDocuments) {
            if (tagDocument.name === dto.name && tagDocument.id !== id) {
                checkIfTagIsExisted = true;
                break;
            }
        }
        console.log("checkIfTagIsExisted: " + checkIfTagIsExisted)
        if (checkIfTagIsExisted) {
            throw new HttpException('Dupplicated tag', HttpStatus.BAD_REQUEST);
        }
        const collectionToUpdate = await this.vocabularyTagModel.findByIdAndUpdate(id, dto).exec();
        let vocabs: VocabularyDocument[] = await this.vocabularyService.getByTagNotPaging(collectionToUpdate.name, request)
        if (vocabs.length > 0) {
            await this.vocabularyService.updateAllVocabWithTag(collectionToUpdate.name, dto.name, accountId)
        }
        logging.info("////// END UPDATE VOCAB TAG//////")
    }

    async deleteOneById(id: string, request: Request) {
        logging.info("////// START DELETE VOCAB TAG //////")

        let accountId: string = await this.getAccountIdFromrequest(request)

        let tagDocuments: VocabularyTagDocument[] = await this.getVocabTagFromAccountId(accountId)

        let vocabTag: VocabularyTagDocument = await this.vocabularyTagModel.findById(id)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!vocabTag) {
            throw new NotFoundException("No vocabulary tag macth with this id");
        }

        if (vocabTag.accountId !== accountId) {
            throw new ForbiddenException();
        }

        let vocabs: VocabularyDocument[] = await this.vocabularyService.getByTagNotPaging(vocabTag.name, request)
        if (vocabs.length > 0) {
            await this.vocabularyService.deleteAllVocabWithTag(vocabTag.name, accountId)
        }

        await this.vocabularyTagModel.deleteOne({ _id: id })
            .catch(err => {
                throw new InternalServerErrorException();
            })
    }

    async getAll(request: Request): Promise<any[]> {
        logging.info("////// START GET ALL VOCAB TAG //////")

        let accountId: string = await this.getAccountIdFromrequest(request)

        let tagDocuments: VocabularyTagDocument[] = await this.getVocabTagFromAccountId(accountId)
        let response = []
        for (const collection of tagDocuments) {
            let vocabs = await this.vocabularyService.getByTag(collection.name, 1, 1000, request)
            response.push({
                id: collection._id,
                name: collection.name,
                description: collection.description,
                picture: collection.picture,
                totalVocab: vocabs.length
            })
        }

        return response;
    }
}