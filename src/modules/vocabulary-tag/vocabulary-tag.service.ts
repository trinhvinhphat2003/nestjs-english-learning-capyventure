import { Injectable, InternalServerErrorException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VocabularyTag, VocabularyTagDocument } from "./vocabulary-tag.schema";
import logging from "src/configs/logging";

@Injectable()
export class VocabularyTagService {
    constructor(@InjectModel(VocabularyTag.name) private vocabularyTagModel: Model<VocabularyTag>) { }

    async getVocabTagFromAccountId(accountId: string): Promise<VocabularyTagDocument[]> {
        return this.vocabularyTagModel.find({
            accountId: accountId
        })
        .exec()
    }

    async createTagForAccountId(accountId: string, tag: string) {
        let newTag: VocabularyTag = {
            accountId: accountId,
            name: tag
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
}