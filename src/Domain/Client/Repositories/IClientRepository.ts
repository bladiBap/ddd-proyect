import { IRepository } from '@common/Core/Abstractions/IRepository';
import { Client } from '../Entities/Client';

export interface IClientRepository extends IRepository<Client> {
    deleteAsync(id: number): Promise<void>;
}