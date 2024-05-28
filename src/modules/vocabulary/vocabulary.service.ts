import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Vocabulary, VocabularyDocument } from "./vocabulary.schema";
import { CreateVocabularyRequestDTO } from "./dtos/requests/create-vocabulary-request.dto";
import { Request } from "express";
import { AccountService } from "../account/account.service";
import logging from "src/configs/logging";
import { VocabularyTagService } from "../vocabulary-tag/vocabulary-tag.service";
import { AuthService } from "../auth/auth.service";
import { VocabularyTagDocument } from "../vocabulary-tag/vocabulary-tag.schema";

@Injectable()
export class VocabularyService {
    constructor(@InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
        @Inject('ACCOUNT_SERVICE_PHATTV') private readonly accountService: AccountService,
        @Inject('VOCABULARY_TAG_SERVICE_PHATTV') private readonly vocabularyTagService: VocabularyTagService,
        @Inject('AUTH_SERVICE_TIENNT') private readonly authService: AuthService) { }

    private async getAccountIdFromrequest(request: Request) {
        logging.info("get token from request", "createNewVocabulary()")
        let token: string = request.headers.authorization;
        logging.info("token: " + token, "createNewVocabulary()")
        logging.info("get accountId from token", "createNewVocabulary()")
        return this.authService.getAccountIdFromToken(token)
    }

    async createNewVocabulary(dto: CreateVocabularyRequestDTO, request: Request): Promise<VocabularyDocument> {
        logging.info("////// START CREATE VOCAB //////")

        let accountId: string = await this.getAccountIdFromrequest(request)
            .then(rs => rs)
        logging.info("accountId: " + accountId, "createNewVocabulary()")
        let newVocabulary: Vocabulary = {
            collection: dto.collection,
            sourceText: dto.sourceText,
            translation: dto.translation,
            accountId: accountId
        }
        let tagDocuments: VocabularyTagDocument[] = await this.vocabularyTagService.getVocabTagFromAccountId(accountId)
            .then(tags => tags)
            .catch(err => {
                throw new InternalServerErrorException();
            })

        let checkIfTagIsExisted: boolean = false;
        for (const tagDocument of tagDocuments) {
            if (tagDocument.name === dto.collection) {
                checkIfTagIsExisted = true;
                break;
            }
        }

        if (!checkIfTagIsExisted) {
            throw new HttpException("tag is not existed", HttpStatus.BAD_REQUEST)
        }

        logging.info("////// END CREATE VOCAB //////")
        return new this.vocabularyModel(newVocabulary).save()
    }

    async getOneById(id: string): Promise<VocabularyDocument> {
        let vocab: VocabularyDocument = await this.vocabularyModel.findById(id)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!vocab) {
            throw new NotFoundException("No vocabulary macth with this id");
        }
        return vocab;
    }

    async getByTag(collection: string, page: number = 1, size: number = 100, request: Request): Promise<VocabularyDocument[]> {
        let accountId: string = await this.getAccountIdFromrequest(request)
            .then(rs => rs)
        let offset = (page - 1) * size;
        let limit = size;
        let story: VocabularyDocument[] = await this.vocabularyModel.find({
            collection: collection,
            accountId: accountId
        })
            .skip(offset)
            .limit(limit)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!story) {
            throw new NotFoundException("No vocabulary macth with this id");
        }
        return story;
    }

    async getByTagNotPaging(collection: string, request: Request): Promise<VocabularyDocument[]> {
        let accountId: string = await this.getAccountIdFromrequest(request)
            .then(rs => rs)
            .catch(err => {
                throw new InternalServerErrorException()
            });
        let vocabs: VocabularyDocument[] = await this.vocabularyModel.find({
            collection: collection,
            accountId: accountId
        })
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!vocabs) {
            throw new NotFoundException("No vocabulary macth with this id");
        }
        return vocabs;
    }

    async getAll(page: number = 1, size: number = 100, request: Request): Promise<VocabularyDocument[]> {
        let accountId: string = await this.getAccountIdFromrequest(request)
            .then(rs => rs)
            .catch(err => {
                throw new InternalServerErrorException()
            });
        let offset = (page - 1) * size;
        let limit = size;
        let story: VocabularyDocument[] = await this.vocabularyModel.find({
            accountId: accountId
        })
            .skip(offset)
            .limit(limit)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        return story;
    }

    async deleteOneById(id: string, request: Request): Promise<void> {
        logging.info("////// START DELETE VOCAB //////")

        let accountId: string = await this.getAccountIdFromrequest(request)

        let vocab: VocabularyDocument = await this.vocabularyModel.findById(id)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!vocab) {
            throw new NotFoundException("No vocabulary macth with this id");
        }

        if (vocab.accountId !== accountId) {
            throw new ForbiddenException();
        }

        await this.vocabularyModel.deleteOne({ _id: id })
            .catch(err => {
                throw new InternalServerErrorException();
            })
    }

    async deleteAllVocabWithTag(collection: string, accountId: string) {
        await this.vocabularyModel.deleteMany({
            collection: collection,
            accountId: accountId
        })
            .catch(err => {
                throw new InternalServerErrorException();
            })
    }

    async updateAllVocabWithTag(collectionName: string, newCollectionName: string, accountId: string) {
        await this.vocabularyModel.updateMany({
            collection: collectionName,
            accountId: accountId
        }, {
            collection: newCollectionName,
        })
            .catch(err => {
                throw new InternalServerErrorException();
            })
    }
}