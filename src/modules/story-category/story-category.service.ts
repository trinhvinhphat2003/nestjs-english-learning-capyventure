import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { StoryCategory, StoryCategoryDocument } from "./story-category.schema";
import { CreateStoryCategoryRequestDTO } from "./dtos/requests/create-category-request.dto";
import { Story, StoryDocument } from "../story/story.schema";
import { StoryService } from "../story/story.service";
import logging from "src/configs/logging";

@Injectable()
export class StoryCategoryService {
    constructor(@InjectModel(StoryCategory.name) private srotyCategoryModel: Model<StoryCategory>,
        @Inject('STORY_SERVICE_PHATTV') private readonly storyService: StoryService) { }

    async createNewCategory(dto: CreateStoryCategoryRequestDTO): Promise<StoryCategoryDocument> {
        let newCategory: StoryCategory = {
            category_name: dto.category_name
        }
        return new this.srotyCategoryModel(newCategory).save()
    }

    async getOneById(id: string): Promise<StoryCategoryDocument> {
        let category: StoryCategoryDocument = await this.srotyCategoryModel.findById(id)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!category) {
            throw new NotFoundException("No category macth with this id");
        }
        return category;
    }

    async getAll(): Promise<StoryCategoryDocument[]> {
        let category: StoryCategoryDocument[] = await this.srotyCategoryModel.find()
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        return category;
    }

    async deleteOneById(id: string): Promise<string> {

        logging.info("////// start delete one cate by id //////", "deleteOneById")

        let category: StoryCategoryDocument = await this.getOneById(id)
            .then(rs => rs)
            .catch(err => {
                throw new InternalServerErrorException();
            })
        logging.info("category: " + JSON.stringify(category), "deleteOneById")

        let story: StoryDocument[] = await this.storyService.getStoryByCate(category.category_name)
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        logging.info("stories: " + JSON.stringify(story), "deleteOneById")
        if (story.length > 0) {
            logging.info("start delete all story belonging to cate", "deleteOneById")
            this.storyService.deleteByCate(category.category_name)
        }
        logging.info("start delete cate", "deleteOneById")
        await this.srotyCategoryModel.deleteOne({ _id: id })
            .catch(err => {
                throw new InternalServerErrorException();
            })
            logging.info("////// end delete one cate by id //////", "deleteOneById")
        return "delete successfully";
    }
}