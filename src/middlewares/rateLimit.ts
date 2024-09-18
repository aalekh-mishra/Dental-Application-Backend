import { NextFunction, Request, Response } from 'express'
import responseMessage from '../constants/responseMessage'
import config from '../config/config'
import { EApplicationEnvironment } from '../constants/application'
import { rateLimiterMongo } from '../config/rate-limiter'
import httpError from '../utils/httpError'


export default (req: Request, _: Response, next: NextFunction) => {
    if (config.NODE_ENV === EApplicationEnvironment.DEVELOPMENT) {
        return next()
    }

    if (rateLimiterMongo) {
        rateLimiterMongo
            .consume(req.ip as string, 1)
            .then(() => {
                next()
            })
            .catch(() => {
                httpError(next, new Error(responseMessage.TOO_MANY_REQUESTS), req, 429, _)
            })
    }
}