import { EntityManager } from 'typeorm';

export interface IUnitOfWork {
    startTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    getManager(): EntityManager;
}
