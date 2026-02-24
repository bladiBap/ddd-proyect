import { IRequest } from '../../Core/Abstractions/IResquest';

export interface IMediator {
    
    send<TResponse>(request: IRequest<TResponse>): Promise<TResponse>;
}