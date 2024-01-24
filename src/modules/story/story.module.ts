import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StoryService } from "./story.service";
import { StoryController } from "./story.controller";
import { Story, StorySchema } from "./story.schema";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }])
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