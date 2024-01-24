import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Story, StoryDocument } from "./story.schema";
import { CreateStoryRequestDTO } from "./dtos/requests/create-story-request.dto";

@Injectable()
export class StoryService {
    constructor(@InjectModel(Story.name) private storyModel: Model<Story>) { }

    async createNewStory(dto: CreateStoryRequestDTO): Promise<StoryDocument> {
        let display_image: string = "";
        let newStory: Story = {
            category: dto.category,
            title: dto.title,
            author: dto.author,
            description: dto.description,
            views: 0,
            comment: [],
            contents: dto.contents,
            display_image: display_image
        }
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

    async getAll(page: number, size: number): Promise<StoryDocument[]> {
        let offset = (page - 1) * size;
        let limit = size;
        let story: StoryDocument[] = await this.storyModel.find()
            .skip(offset)
            .limit(limit)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        return story;
    }
}