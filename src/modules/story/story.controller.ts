import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StoryService } from "./story.service";
import { CreateStoryRequestDTO } from "./dtos/requests/create-story-request.dto";
import { UpdateStoryRequestDTO } from "./dtos/requests/update-story-request.dto";
import logging from "src/configs/logging";
import { FilterStoryRequestDTO } from "./dtos/requests/filter-story.dto";

@ApiTags('story')
@Controller('story')
export class StoryController {

    constructor(
        @Inject('STORY_SERVICE_PHATTV') private readonly storyService: StoryService,
    ) { }

    @Post()
    async createNewStory(@Body() dto: CreateStoryRequestDTO) {
        try {
            let result: any = await this.storyService.createNewStory(dto)
            .then(rs => rs)
            .catch(err => {
                logging.error(JSON.stringify(err));
                throw new InternalServerErrorException();
            })
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Post("/:page/:size")
    async GetAllStory(
        @Param("page") page: number,
        @Param("size") size: number,
        @Body() filterDTO: FilterStoryRequestDTO
    ) {
        try {
            let result: any = await this.storyService.getAll(page, size, filterDTO);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Get("/:id")
    async GetStoryById(
        @Param("id") id: string
    ) {
        try {
            let result: any = await this.storyService.getOneById(id);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Put("/:id")
    async updateStoryById(
        @Param("id") id: string,
        @Body() dto: UpdateStoryRequestDTO
    ) {
        try {
            let result: any = await this.storyService.updateOneById(id, dto);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Delete("/:id")
    async deleteStoryById(
        @Param("id") id: string
    ) {
        this.storyService.deleteOneById(id)
        return {
            statusCode: 200,
            message: "delete successfully"
        }
    }

    @Get("/level")
    async getAllStoryLevel() {
        return {
            statusCode: 200,
            data: ["easy", "medium", "hard"]
        }
    }
}