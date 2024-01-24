import { Body, Controller, Get, Inject, InternalServerErrorException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StoryService } from "./story.service";
import { CreateStoryRequestDTO } from "./dtos/requests/create-story-request.dto";

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
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Get("/:page/:size")
    async GetAllCategory(
        @Param("page") page: number,
        @Param("size") size: number
    ) {
        try {
            let result: any = await this.storyService.getAll(page, size);
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}