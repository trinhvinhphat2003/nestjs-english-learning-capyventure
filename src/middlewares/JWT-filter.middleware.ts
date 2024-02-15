import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import logging from "src/configs/logging";
import { PUBLIC_ROUTES } from "./filter-routes";

@Injectable()
export class JWTFilter implements NestMiddleware {

    private allowPublicRoute(request: Request, next: any, originalUrl: string, method: string) {
        for(const route of PUBLIC_ROUTES) {
            if(route.path === originalUrl && route.method === method) {
                return true;
            }
        }
        return false;
    }

    use(req: Request, res: Response, next: () => void) {

        let originalUrl: string = req.originalUrl;
        let method: string = req.method;

        logging.info(originalUrl)
        logging.info(method)

        let isPublicRoute: boolean = this.allowPublicRoute(req, next, originalUrl, method);
        if(isPublicRoute) {
            logging.info("isPublic")
            next()
            return;
        }

        let token = req.headers.authorization;
        if(!token) {
            throw new UnauthorizedException();
        } else {
            logging.info("isPrivate")
            next()
            return;
        }
        
    }
}