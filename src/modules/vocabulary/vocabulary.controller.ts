import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Req, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { VocabularyService } from "./vocabulary.service";
import { CreateVocabularyRequestDTO } from "./dtos/requests/create-vocabulary-request.dto";
import { Request } from "express";

@ApiTags('vocabulary')
@Controller('vocabulary')
export class VocabularyController {

    constructor(
        @Inject('VOCABULARY_SERVICE_PHATTV') private readonly vocabularyService: VocabularyService,
    ) { }

    @ApiBearerAuth()
    @Post()
    async createNewVocab(@Body() dto: CreateVocabularyRequestDTO, @Req() request: Request) {
        try {
            let result: any = await this.vocabularyService.createNewVocabulary(dto, request)
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw error
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

    @ApiBearerAuth()
    @Get("/:tag")
    @ApiParam({ name: 'tag', required: false, type: String, })
    async GetVocabByTag(
        @Param("tag") tag: string,
        @Req() request: Request
    ) {
        try {
            let result: any = await this.vocabularyService.getByTag(tag, 1, 10000, request);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw error
        }
    }

    @Get("/")
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
    @ApiBearerAuth()
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
            throw error
        }
    }

    @Delete("/:id")
    @ApiBearerAuth()
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