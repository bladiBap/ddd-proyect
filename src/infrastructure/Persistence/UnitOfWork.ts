import { injectable, inject } from "tsyringe";
import { AppDataSource } from "./PersistenceModel/data-source";
import { EntityManager, QueryRunner } from "typeorm";
import { Mediator } from "@application/Mediator/Mediator";
import { DomainEvent } from "core/abstractions/DomainEvent";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";

@injectable()
export class UnitOfWork implements IUnitOfWork {
    private queryRunner!: QueryRunner;
    private manager!: EntityManager;

    constructor(
        @inject(Mediator) private readonly mediator: Mediator
    ) {}

    async startTransaction(): Promise<void> {
        this.queryRunner = AppDataSource.createQueryRunner();
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
        this.manager = this.queryRunner.manager;
    }

    async commit(): Promise<void> {
        try {
            const domainEvents = this.extractDomainEvents();
            for (const event of domainEvents) {
                await this.mediator.send(event);
            }

            await this.queryRunner.commitTransaction();
        } catch (err) {
            await this.queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await this.queryRunner.release();
        }
    }

    async rollback(): Promise<void> {
        try {
            await this.queryRunner.rollbackTransaction();
        } finally {
            await this.queryRunner.release();
        }
    }

    private extractDomainEvents(): DomainEvent[] {
        return [];
    }

    getRepository<T extends { new (manager: EntityManager): any }>(repo: T): InstanceType<T> {
        if (!this.manager) throw new Error("Transaction not started. Call start() first.");
        return new repo(this.manager);
    }
}
