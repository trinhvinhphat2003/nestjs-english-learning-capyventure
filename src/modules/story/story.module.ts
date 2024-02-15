import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StoryService } from "./story.service";
import { StoryController } from "./story.controller";
import { Story, StorySchema } from "./story.schema";
import { Image, ImageSchema } from "./image.schema";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
        MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }])
    ],
    controllers: [
        StoryController,
    ],
    providers: [
        {
            provide: 'STORY_SERVICE_PHATTV',
            useClass: StoryService,
        }
    ],
    exports: [
        {
            provide: 'STORY_SERVICE_PHATTV',
            useClass: StoryService,
        }
    ],
})
export class StoryModule { }