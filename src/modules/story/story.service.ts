import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Story, StoryDocument } from "./story.schema";
import { CreateStoryRequestDTO } from "./dtos/requests/create-story-request.dto";
import { UpdateStoryRequestDTO } from "./dtos/requests/update-story-request.dto";
import logging from "src/configs/logging";
import { FilterStoryRequestDTO } from "./dtos/requests/filter-story.dto";

@Injectable()
export class StoryService {
    constructor(@InjectModel(Story.name) private storyModel: Model<Story>) { }

    async createNewStory(dto: CreateStoryRequestDTO): Promise<StoryDocument> {
        logging.info("////// START CRATE STORY //////", "createNewStory()")
        let display_image: string = "display_image";
        let newStory: Story = {
            category: dto.category,
            title: dto.title,
            author: dto.author,
            description: dto.description,
            views: 0,
            comment: [],
            contents: dto.contents,
            display_image: display_image,
            level: dto.level
        }
        logging.info("new story: " + JSON.stringify(newStory), "createNewStory()")
        return new this.storyModel(newStory).save()
    }

    async getOneById(id: string): Promise<StoryDocument> {
        let story: StoryDocument = await this.storyModel.findById(id)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!story) {
            throw new NotFoundException("No story macth with this id");
        }
        return story;
    }

    async getAll(page: number, size: number, filterDTO: FilterStoryRequestDTO): Promise<StoryDocument[]> {
        logging.info("////// START GET STORY //////", "story/getAll()")
        logging.info("filter DTO: " + JSON.stringify(filterDTO), "story/getAll()")
        let offset = (page - 1) * size;
        let limit = size;
        let story: StoryDocument[] = await this.storyModel.find({
            title: {$regex: new RegExp(filterDTO.title, "i")},
            level: {$regex: new RegExp(filterDTO.level, "i")},
            category: {$regex: new RegExp(filterDTO.category, "i")},
        })
        .sort({
            "_id": filterDTO.sort.direction === "asc" ? 1 : -1
        })
            .skip(offset)
            .limit(limit)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            }); 
        logging.info(JSON.stringify(story))
        return story;
    }

    async updateOneById(id: string, dto: UpdateStoryRequestDTO): Promise<StoryDocument> {
        let display_image: string = "";
        let updateInfo: Story = {
            category: dto.category,
            title: dto.title,
            author: dto.author,
            description: dto.description,
            views: dto.views,
            comment: dto.comment,
            contents: dto.contents,
            display_image: display_image,
            level: dto.level
        }
        return await this.storyModel.findByIdAndUpdate(id, updateInfo)
        .then(rs => rs)
        .catch(err => {
            throw new InternalServerErrorException();
        })
    }

    async deleteOneById(id: string): Promise<void> {
        await this.storyModel.deleteOne({ _id: id })
        .catch(err => {
            throw new InternalServerErrorException();
        })
    }
}