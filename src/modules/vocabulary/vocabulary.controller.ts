import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Req, Query } from "@nestjs/common";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { VocabularyService } from "./vocabulary.service";
import { CreateVocabularyRequestDTO } from "./dtos/requests/create-vocabulary-request.dto";
import { Request } from "express";

@ApiTags('vocabulary')
@Controller('vocabulary')
export class VocabularyController {

    constructor(
        @Inject('VOCABULARY_SERVICE_PHATTV') private readonly vocabularyService: VocabularyService,
    ) { }

    @Post()
    async createNewStory(@Body() dto: CreateVocabularyRequestDTO, @Req() request: Request) {
        try {
            let result: any = await this.vocabularyService.createNewVocabulary(dto, request)
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    // @Get("/:id")
    // async GetVocabById(
    //     @Param("id") id: string
    // ) {
    //     try {
    //         let result: any = await this.vocabularyService.getOneById(id);
    //         return {
    //             statusCode: 200,
    //             data: result
    //         }
    //     } catch (error) {
    //         throw new InternalServerErrorException();
    //     }
    // }

    @Get("/:tag")
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
    @ApiParam({ name: 'tag', required: false, type: String, })
    async GetVocabByTag(
        @Param("tag") tag: string,
        @Query("page") page: number,
        @Query("size") size: number,
        @Req() request: Request
    ) {
        try {
            let result: any = await this.vocabularyService.getByTag(tag, page, size, request);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Get("/")
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
    async GetAllVocab(
        @Query("page") page: number,
        @Query("size") size: number,
        @Req() request: Request
    ) {
        try {
            let result: any = await this.vocabularyService.getAll(page, size, request);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Delete("/:id")
    async deleteVocabById(
        @Param("id") id: string,
        @Req() request: Request
    ) {
        this.vocabularyService.deleteOneById(id, request)
        return {
            statusCode: 200,
            message: "delete successfully"
        }
    }

}