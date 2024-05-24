import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VideoService } from "./video.service";
import { Request } from "express";
import { CreateVideoRequestDTO } from "./dtos/requests/create-video-request.dto";
import {FilterVideoRequestDTO} from "./dtos/requests/filter-video.dto"

@ApiTags('Video')
@Controller('video')
export class VideoController {

    constructor(
        @Inject('VIDEO_SERVICE_PHATTV') private readonly VideoService: VideoService,
    ) { }

    @Post()
    async createNewVideo(@Body() dto: CreateVideoRequestDTO, @Req() request: Request) {
        try {
            let result: any = await this.VideoService.createNewVideo(dto, request)
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Get("/")
    async GetAllStory(
        @Query("page") page: number = 1,
        @Query("size") size: number = 10,
        @Query("caption") caption: string = '',
        @Query("category") category: string = "",
        @Query("level") level: string = "",
        @Query("sortBy") sortBy : string = "_id",
        @Query("direction") direction: "asc" | "desc" = "asc" 
    ) {
        try {
            let filterDTO: FilterVideoRequestDTO = {
                caption,
                category,
                level,
                sort: {
                    by: sortBy,
                    direction: direction
                }
            }
            let result: any = await this.VideoService.getAll(page, size, filterDTO);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw error
        }
    }

    @Get("/:id")
    async GetVideoById(
        @Param("id") id: string
    ) {
        try {
            let result: any = await this.VideoService.getOneById(id);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw error
        }
    }

    // @Get("/tag/:tag/:page/:size")
    // async GetVocabByTag(
    //     @Param("tag") tag: string,
    //     @Param("page") page: number,
    //     @Param("size") size: number,
    //     @Req() request: Request
    // ) {
    //     try {
    //         let result: any = await this.VideoService.getByTag(tag, page, size, request);
    //         return {
    //             statusCode: 200,
    //             data: result
    //         }
    //     } catch (error) {
    //         throw new InternalServerErrorException();
    //     }
    // }

    // @Get("/:page/:size")
    // async GetAllVocab(
    //     @Param("page") page: number,
    //     @Param("size") size: number,
    //     @Req() request: Request
    // ) {
    //     try {
    //         let result: any = await this.VideoService.getAll(page, size, request);
    //         return {
    //             statusCode: 200,
    //             data: result
    //         }
    //     } catch (error) {
    //         throw new InternalServerErrorException();
    //     }
    // }

    // @Delete("/:id")
    // async deleteVocabById(
    //     @Param("id") id: string,
    //     @Req() request: Request
    // ) {
    //     this.VideoService.deleteOneById(id, request)
    //     return {
    //         statusCode: 200,
    //         message: "delete successfully"
    //     }
    // }

}