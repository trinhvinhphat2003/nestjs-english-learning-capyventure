import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { VocabularyTagService } from "./vocabulary-tag.service";

@ApiTags('vocabulary-tag')
@Controller('vocabulary-tag')
export class VocabularyTagController {

    constructor(
        @Inject('VOCABULARY_TAG_SERVICE_PHATTV') private readonly vocabularyTagService: VocabularyTagService,
    ) { }

    // @Post()
    // async createNewStory(@Body() dto: CreateVocabularyRequestDTO, @Req() request: Request) {
    //     try {
    //         let result: any = await this.vocabularyService.createNewVocabulary(dto, request)
    //         return {
    //             statusCode: 200,
    //             data: result
    //         }
    //     } catch (error) {
    //         throw new InternalServerErrorException();
    //     }
    // }

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

    // @Get("/tag/:tag/:page/:size")
    // async GetVocabByTag(
    //     @Param("tag") tag: string,
    //     @Param("page") page: number,
    //     @Param("size") size: number
    // ) {
    //     try {
    //         let result: any = await this.vocabularyService.getByTag(tag, page, size);
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
    //     @Param("size") size: number
    // ) {
    //     try {
    //         let result: any = await this.vocabularyService.getAll(page, size);
    //         return {
    //             statusCode: 200,
    //             data: result
    //         }
    //     } catch (error) {
    //         throw new InternalServerErrorException();
    //     }
    // }

    @Delete("/:id")
    async deleteVocabTagById(
        @Param("id") id: string
    ) {
        //this.vocabularyTagService.deleteOneById(id)
        return {
            statusCode: 200,
            message: "delete successfully"
        }
    }

}