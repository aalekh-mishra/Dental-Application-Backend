import { Request, Response } from 'express'; 
import { THttpError } from '../types/types'
import config from '../config/config'
import logger from './logger'
import { EApplicationEnvironment } from '../constants/application'
import responseMessage from '../constants/responseMessage'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500, res: Response): void => {
    const errorObj: THttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    }

    // Log
    logger.error(`CONTROLLER_ERROR`, {
        meta: errorObj
    })

    // Production Env check // Hide sensitive information in production
    if (config.NODE_ENV === EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    // Send the error response
    res.status(errorObj.statusCode).json(errorObj);
}