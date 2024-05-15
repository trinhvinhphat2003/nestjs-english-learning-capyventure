import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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
    async createNewVocabularyTag(@Body() dto: CreateVocabularyTagRequestDTO, @Req() request: Request) {
        try {
            await this.vocabularyTagService.createNewVocabularyTag(dto, request)
            return {
                statusCode: 200,
                message: "Tag created successfully"
            }
        } catch (error) {
            throw new InternalServerErrorException();
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
    async GetAllVocabTag(@Req() request: Request) {
        try {
            let result: any = await this.vocabularyTagService.getAll(request);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Delete("/:id")
    async deleteVocabTagById(
        @Param("id") id: string,
        @Req() request: Request
    ) {
        await this.vocabularyTagService.deleteOneById(id, request)
        .catch(err => {
            throw new InternalServerErrorException()
        })
        return {
            statusCode: 200,
            message: "delete successfully"
        }
    }

}