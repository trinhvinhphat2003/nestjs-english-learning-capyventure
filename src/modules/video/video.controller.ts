import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VideoService } from "./video.service";
import { Request } from "express";
import { CreateVideoRequestDTO } from "./dtos/requests/create-video-request.dto";

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
            throw new InternalServerErrorException();
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