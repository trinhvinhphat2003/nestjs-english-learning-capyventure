import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Story, StoryDocument } from "./story.schema";
import { CreateStoryRequestDTO } from "./dtos/requests/create-story-request.dto";
import { UpdateStoryRequestDTO } from "./dtos/requests/update-story-request.dto";
import logging from "src/configs/logging";
import { FilterStoryRequestDTO } from "./dtos/requests/filter-story.dto";
import { Image, imageDocument } from "./image.schema";
import { MemoryStorageFile } from "@blazity/nest-file-fastify";

@Injectable()
export class StoryService {
    constructor(@InjectModel(Story.name) private storyModel: Model<Story>,
        @InjectModel(Image.name) private imageModel: Model<Image>
    ) { }

    async findImageById(id: string): Promise<Image> {
        return this.imageModel.findById(id).exec();
    }

    async insertImage(image: MemoryStorageFile): Promise<string> {
        const createdImage = new this.imageModel({
            data: image[0].buffer,
            contentType: "image/jpeg"
        })
        const createdImageRs: any = await createdImage.save()
            .then(rs => {
                //console.log(JSON.stringify(rs))
                return rs;
            })
            .catch(err => {
                logging.error(err, "createNewStory()")
            })
        return "localhost:4000/story/display-image/" + createdImageRs.id;
    }

    async createNewStory(dto: CreateStoryRequestDTO, image: MemoryStorageFile): Promise<StoryDocument> {
        //console.log(JSON.stringify(image[0]))
        logging.info("////// START CRATE STORY //////", "createNewStory()")
        let display_image: string = await this.insertImage(image)
            .then(rs => rs)
            .catch(err => {
                throw new InternalServerErrorException();
            })
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
            title: { $regex: new RegExp(filterDTO.title, "i") },
            level: { $regex: new RegExp(filterDTO.level, "i") },
            category: { $regex: new RegExp(filterDTO.category, "i") },
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

    async updateOneById(id: string, dto: UpdateStoryRequestDTO, image: MemoryStorageFile, isImageChange: boolean): Promise<StoryDocument> {
        let display_image: string = "";
        //console.log()
        if (isImageChange == true) {
            let split: string[] = dto.display_image.split("/")
            let oldImageId: string = split[split.length - 1];
            console.log(oldImageId)
            await this.deleteImageById(oldImageId)
            display_image = await this.insertImage(image)
                .then(rs => rs)
                .catch(err => {
                    throw new InternalServerErrorException();
                })
            console.log("hello");
        } else {
            display_image = dto.display_image
            console.log("hi");
        }
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

    async deleteImageById(id: string): Promise<void> {
        await this.imageModel.deleteOne({ _id: id })
            .catch(err => {
                throw new InternalServerErrorException();
            })
    }

    async deleteOneById(id: string): Promise<void> {
        let story: any = await this.getOneById(id)
        .then(rs => rs)
        .catch(err => {
            throw new InternalServerErrorException();
        })
        let split: string[] = story.display_image.split("/")
            let oldImageId: string = split[split.length - 1];
            console.log(oldImageId)
            await this.deleteImageById(oldImageId)
        await this.storyModel.deleteOne({ _id: id })
            .catch(err => {
                throw new InternalServerErrorException();
            })
    }

    async getStoryByCate(categoryName: string): Promise<StoryDocument[]> {
        return this.storyModel.find({
            category: { $regex: new RegExp(categoryName, "i") },
        })
            .exec()
    }
}