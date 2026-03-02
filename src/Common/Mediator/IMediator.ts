import { IRequest } from '@common/Core/Abstractions/IResquest';

export interface IMediator {
    
    send<TResponse>(request: IRequest<TResponse>): Promise<TResponse>;
}