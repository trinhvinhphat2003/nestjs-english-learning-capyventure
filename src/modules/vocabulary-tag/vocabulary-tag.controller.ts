import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Put, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { VocabularyTagService } from "./vocabulary-tag.service";
import { CreateVocabularyTagRequestDTO } from "./dtos/requests/CreateVocabularyTagRequestDTO";

@ApiTags('collection')
@Controller('collection')
export class VocabularyTagController {

    constructor(
        @Inject('VOCABULARY_TAG_SERVICE_PHATTV') private readonly vocabularyTagService: VocabularyTagService,
    ) { }

    @Post()
    @ApiBearerAuth()
    async createNewVocabularyTag(@Body() dto: CreateVocabularyTagRequestDTO, @Req() request: Request) {
        try {
            await this.vocabularyTagService.createNewVocabularyTag(dto, request)
            return {
                statusCode: 200,
                message: "Tag created successfully"
            }
        } catch (error) {
            throw error;
        }
    }

    @Put("/:id")
    @ApiBearerAuth()
    async updateVocabularyTag(@Param("id") id: string, @Body() dto: CreateVocabularyTagRequestDTO, @Req() request: Request) {
        try {
            await this.vocabularyTagService.updateVocabularyTag(id, dto, request)
            return {
                statusCode: 200,
                message: "Tag updated successfully"
            }
        } catch (error) {
            throw error;
        }
    }
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

    @Get()
    @ApiBearerAuth()
    async GetAllVocabTag(@Req() request: Request) {
        try {
            let result: any = await this.vocabularyTagService.getAll(request);
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
    async deleteVocabTagById(
        @Param("id") id: string,
        @Req() request: Request
    ) {
        await this.vocabularyTagService.deleteOneById(id, request)
        .catch(err => {
            throw err
        })
        return {
            statusCode: 200,
            message: "delete successfully"
        }
    }

}