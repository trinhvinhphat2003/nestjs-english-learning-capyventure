// import { Module, forwardRef } from "@nestjs/common";
// import { MongooseModule } from "@nestjs/mongoose";
// import { VideoService } from "./Video.service";
// import { VideoController } from "./Video.controller";
// import { Video, VideoSchema } from "./video.schema";
// @Module({
//     imports: [
//         MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
//     ],
//     controllers: [
//         VideoController,
//     ],
//     providers: [
//         {
//             provide: 'VIDEO_SERVICE_PHATTV',
//             useClass: VideoService,
//         }
//     ],
//     exports: [
//         {
//             provide: 'VIDEO_SERVICE_PHATTV',
//             useClass: VideoService,
//         }
//     ],
// })
// export class VideoModule { }