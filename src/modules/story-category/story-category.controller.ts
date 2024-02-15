import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StoryCategoryService } from "./story-category.service";
import { CreateStoryCategoryRequestDTO } from "./dtos/requests/create-category-request.dto";

@ApiTags('story-category')
@Controller('story-category')
export class StoryCategoryController {

    constructor(
        @Inject('STORY-CATEGORY_SERVICE_PHATTV') private readonly storyCategoryService: StoryCategoryService,
    ) { }

    @Post()
    async createNewCategory(@Body() dto: CreateStoryCategoryRequestDTO) {
        try {
            let result: any = await this.storyCategoryService.createNewCategory(dto)
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Get()
    async GetAllCategory() {
        try {
            let result: any = await this.storyCategoryService.getAll()
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    @Delete("/:id")
    async deleteStoryCategoryById(
        @Param("id") id: string
    ) {
        let message: string = await this.storyCategoryService.deleteOneById(id)
        .then(rs => rs)
        .catch(err => {
            throw new InternalServerErrorException();
        })
        return {
            statusCode: 200,
            message: message
        }
    }
    
}