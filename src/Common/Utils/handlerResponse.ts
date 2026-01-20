import { Response } from 'express';
import { IResult } from '@common/Core/Abstractions/IResult';
import { ExceptionType } from '@common/Core/Results/ExceptionType';

export function handlerResponse( result :IResult, res : Response ) {
    if( result.isSuccess ) {
        return res.status(200).json(result);
    }
    switch( result.error.type) {
        case ExceptionType.Conflict:
            return res.status(409).json(result);
        case ExceptionType.NotFound:
            return res.status(404).json(result);
        case ExceptionType.Unauthorized:
            return res.status(401).json(result);
        case ExceptionType.Problem:
            return res.status(500).json(result);
        case ExceptionType.InvalidOperation:
        case ExceptionType.Failure:
            return res.status(400).json(result);
        default:
            return res.status(500).json(result);
    }
}