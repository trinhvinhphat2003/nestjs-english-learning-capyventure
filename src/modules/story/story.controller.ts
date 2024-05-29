import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { StoryService } from "./story.service";
import { CreateStoryRequestDTO } from "./dtos/requests/create-story-request.dto";
import { UpdateStoryRequestDTO } from "./dtos/requests/update-story-request.dto";
import logging from "src/configs/logging";
import { FilterStoryRequestDTO } from "./dtos/requests/filter-story.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    FileFieldsInterceptor,
    MemoryStorageFile,
    UploadedFiles,
} from '@blazity/nest-file-fastify';
import { Response } from "express";
import { readFileSync } from "fs";

@ApiTags('story')
@Controller('story')
export class StoryController {

    constructor(
        @Inject('STORY_SERVICE_PHATTV') private readonly storyService: StoryService,
    ) { }

    @Post()
    // @UseInterceptors(
    //     FileFieldsInterceptor([
    //         { name: 'image', maxCount: 1 }
    //     ])
    // )
    async createNewStory(
        // @Body() data: Record<string, unknown>,   // other data that you might want to pass along with the files
        // @UploadedFiles()
        // files: { image?: MemoryStorageFile }
        @Body() dto: CreateStoryRequestDTO
    ) {
        try {
            let body: CreateStoryRequestDTO = dto
            console.log(JSON.stringify(body))
            let result: any = await this.storyService.createNewStory(body)
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
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    // @Get('/display-image/:id')
    // async getImage(@Param('id') id: string, @Res() res: Response): Promise<any> {
    //     const image = await this.storyService.findImageById(id);
    //     //console.log(JSON.stringify(image))

    //     if (!image) {
    //         return res.status(404).send('Image not found');
    //     }


    //     res.header('Content-Type', image.contentType);
    //     res.send(image.data);
    // }


    @Get("/")
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'title', required: false, type: String, })
    @ApiQuery({ name: 'category', required: false, type: String, })
    @ApiQuery({ name: 'level', required: false, type: String, })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: '_id' })
    @ApiQuery({ name: 'direction', required: false, enum: ['asc', 'desc'], example: 'asc' })
    async GetAllStory(
        @Query("page") page: number = 1,
        @Query("size") size: number = 10,
        @Query("title") title: string = '',
        @Query("category") category: string = "",
        @Query("level") level: string = "",
        @Query("sortBy") sortBy: string = "_id",
        @Query("direction") direction: "asc" | "desc" = "asc"
    ) {
        try {
            let filterDTO: FilterStoryRequestDTO = {
                title,
                category,
                level,
                sort: {
                    by: sortBy,
                    direction: direction
                }
            }
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
        @Body() data: UpdateStoryRequestDTO,  
    ) {
        try {
            let result: any = await this.storyService.updateOneById(id, data);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw error
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