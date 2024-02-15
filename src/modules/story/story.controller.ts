import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
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
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 }
        ])
    )
    async createNewStory(
        @Body() data: Record<string, unknown>,   // other data that you might want to pass along with the files
        @UploadedFiles()
        files: { image?: MemoryStorageFile }
        //@Body() dto: CreateStoryRequestDTO
    ) {
        try {
            let body: CreateStoryRequestDTO = data.data as unknown as CreateStoryRequestDTO;
            console.log(JSON.stringify(body))
            let result: any = await this.storyService.createNewStory(body, files.image)
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

    @Get('/display-image/:id')
    async getImage(@Param('id') id: string, @Res() res: Response): Promise<any> {
        const image = await this.storyService.findImageById(id);
        //console.log(JSON.stringify(image))

        if (!image) {
            return res.status(404).send('Image not found');
        }


        res.header('Content-Type', image.contentType);
        res.send(image.data);
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
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 }
        ])
    )
    async updateStoryById(
        @Param("id") id: string,
        @Query("isImageChange") isImageChange: string,
        @Body() data: Record<string, unknown>,  
        @UploadedFiles()
        files: { image?: MemoryStorageFile }
    ) {
        console.log(isImageChange)
        try {
            
            let body: UpdateStoryRequestDTO = data.data as unknown as UpdateStoryRequestDTO;
            let result: any = await this.storyService.updateOneById(id, body, files.image, isImageChange === "yes" ? true : false);
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