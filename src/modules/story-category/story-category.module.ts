import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StoryCategoryService } from "./story-category.service";
import { StoryCategoryController } from "./story-category.controller";
import { StoryCategory, StoryCategorySchema } from "./story-category.schema";
import { StoryModule } from "../story/story.module";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: StoryCategory.name, schema: StoryCategorySchema }]),
        StoryModule
    ],
    controllers: [
        StoryCategoryController
    ],
    providers: [
        {
            provide: 'STORY-CATEGORY_SERVICE_PHATTV',
            useClass: StoryCategoryService,
        }
    ],
    exports: [
        {
            provide: 'STORY-CATEGORY_SERVICE_PHATTV',
            useClass: StoryCategoryService,
        }
    ],
})
export class StoryCategoryModule { }