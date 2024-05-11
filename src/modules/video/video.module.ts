import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VideoService } from "./video.service";
import { VideoController } from "./video.controller";
import { Video, VideoSchema } from "./video.schema";
import { AuthModule } from "../auth/auth.module";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
        AuthModule
    ],
    controllers: [
        VideoController,
    ],
    providers: [
        {
            provide: 'VIDEO_SERVICE_PHATTV',
            useClass: VideoService,
        }
    ],
    exports: [
        {
            provide: 'VIDEO_SERVICE_PHATTV',
            useClass: VideoService,
        }
    ],
})
export class VideoModule { }