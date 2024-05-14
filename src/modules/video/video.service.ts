import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Video, VideoDocument } from "./video.schema";
import logging from "src/configs/logging";
import { CreateVideoRequestDTO } from "./dtos/requests/create-video-request.dto";
import { Request } from "express";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class VideoService {
    constructor(@InjectModel(Video.name) private VideoModel: Model<Video>,
    @Inject('AUTH_SERVICE_TIENNT') private readonly authService: AuthService) { }

    private async getAccountIdFromrequest(request: Request) {
        logging.info("get token from request", "createNewVideo()")
        let token: string = request.headers.authorization;
        logging.info("token: " + token, "createNewVideo()")
        logging.info("get accountId from token", "createNewVideo()")
        return this.authService.getAccountIdFromToken(token)
    }

    async createNewVideo(dto: CreateVideoRequestDTO, request: Request): Promise<VideoDocument> {
        logging.info("////// START CREATE VOCAB //////")
        
        let accountId: string = await this.getAccountIdFromrequest(request)
        .then(rs => rs)
        .catch(err => {
            throw new InternalServerErrorException()
        });
        logging.info("accountId: " + accountId, "createNewVideo()")
        let newVideo: Video = {
            videoLink: dto.videoLink,
            caption: dto.caption,
            category: dto.category,
            channel: dto.channel,
            duration: dto.duration,
            fullText: dto.fullText,
            level: dto.level,
            thumbnail: dto.thumbnail,
            transcripts: JSON.stringify(dto.transcripts)
        }

        logging.info("////// END CREATE VIDEO //////")
        return new this.VideoModel(newVideo).save()
    }

    async getOneById(id: string): Promise<VideoDocument> {
        let vocab: VideoDocument = await this.VideoModel.findById(id)
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        if (!vocab) {
            throw new NotFoundException("No Video macth with this id");
        }
        return vocab;
    }

    // async getByTag(tag: string, page: number, size: number, request: Request): Promise<VideoDocument[]> {
    //     let accountId: string = await this.getAccountIdFromrequest(request)
    //     .then(rs => rs)
    //     .catch(err => {
    //         throw new InternalServerErrorException()
    //     });
    //     let offset = (page - 1) * size;
    //     let limit = size;
    //     let story: VideoDocument[] = await this.VideoModel.find({
    //         tag: tag,
    //         accountId: accountId
    //     })
    //         .skip(offset)
    //         .limit(limit)
    //         .exec()
    //         .then(result => result)
    //         .catch(error => {
    //             throw new InternalServerErrorException();
    //         });
    //     if (!story) {
    //         throw new NotFoundException("No Video macth with this id");
    //     }
    //     return story;
    // }

    // async getByTagNotPaging(tag: string, request: Request): Promise<VideoDocument[]> {
    //     let accountId: string = await this.getAccountIdFromrequest(request)
    //     .then(rs => rs)
    //     .catch(err => {
    //         throw new InternalServerErrorException()
    //     });
    //     let story: VideoDocument[] = await this.VideoModel.find({
    //         tag: tag,
    //         accountId: accountId
    //     })
    //         .exec()
    //         .then(result => result)
    //         .catch(error => {
    //             throw new InternalServerErrorException();
    //         });
    //     if (!story) {
    //         throw new NotFoundException("No Video macth with this id");
    //     }
    //     return story;
    // }

    // async getAll(page: number, size: number, request: Request): Promise<VideoDocument[]> {
    //     let accountId: string = await this.getAccountIdFromrequest(request)
    //     .then(rs => rs)
    //     .catch(err => {
    //         throw new InternalServerErrorException()
    //     });
    //     let offset = (page - 1) * size;
    //     let limit = size;
    //     let story: VideoDocument[] = await this.VideoModel.find({
    //         accountId: accountId
    //     })
    //         .skip(offset)
    //         .limit(limit)
    //         .exec()
    //         .then(result => result)
    //         .catch(error => {
    //             throw new InternalServerErrorException();
    //         });
    //     return story;
    // }

    // async deleteOneById(id: string, request: Request): Promise<void> {
    //     logging.info("////// START DELETE VOCAB //////")
        
    //     let accountId: string = await this.getAccountIdFromrequest(request)

    //     let vocab: VideoDocument = await this.VideoModel.findById(id)
    //         .exec()
    //         .then(result => result)
    //         .catch(error => {
    //             throw new InternalServerErrorException();
    //         });
    //     if (!vocab) {
    //         throw new NotFoundException("No Video macth with this id");
    //     }

    //     if(vocab.accountId !== accountId) {
    //         throw new ForbiddenException();
    //     }

    //     await this.VideoModel.deleteOne({ _id: id })
    //     .catch(err => {
    //         throw new InternalServerErrorException();
    //     })
    // }

    // async deleteAllVocabWithTag(tag: string, accountId: string) {
    //     await this.VideoModel.deleteMany({
    //         tag: tag,
    //         accountId: accountId
    //     })
    //     .catch(err => {
    //         throw new InternalServerErrorException();
    //     })
    // }
}