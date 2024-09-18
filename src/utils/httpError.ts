import { NextFunction, Request, Response } from 'express'
import errorObject from './errorObject'


// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (nextFunc: NextFunction, err: Error | unknown, req: Request, errorStatusCode: number = 500, res: Response): any => {
    const errorObj = errorObject(err, req, errorStatusCode, res)
    return nextFunc(errorObj)
}