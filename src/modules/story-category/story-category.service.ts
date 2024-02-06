import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { StoryCategory, StoryCategoryDocument } from "./story-category.schema";
import { CreateStoryCategoryRequestDTO } from "./dtos/requests/create-category-request.dto";

@Injectable()
export class StoryCategoryService {
    constructor(@InjectModel(StoryCategory.name) private srotyCategoryModel: Model<StoryCategory>) { }

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

    async deleteOneById(id: string): Promise<void> {
        await this.srotyCategoryModel.deleteOne({ _id: id })
        .catch(err => {
            throw new InternalServerErrorException();
        })
    }
}