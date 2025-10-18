import { EntityManager } from "typeorm";
export interface IUnitOfWork {
    startTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    getRepository<T extends { new (manager: EntityManager): any }>(
        repo: T
    ): InstanceType<T>;
}