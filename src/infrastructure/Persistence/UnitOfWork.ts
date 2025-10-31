import { injectable, inject } from "tsyringe";
import { EntityManager, QueryRunner, DataSource } from "typeorm";

import { DomainEvent } from "@core/abstractions/DomainEvent";
import { IUnitOfWork } from "@core/abstractions/IUnitOfWork";
import { IEntityManagerProvider } from "@core/abstractions/IEntityManagerProvider";

import { Mediator } from "@application/Mediator/Mediator";
import { DomainEventsCollector } from "@application/DomainEventsCollector";

@injectable()
export class UnitOfWork implements IUnitOfWork, IEntityManagerProvider  {
    private queryRunner?: QueryRunner;
    private manager?: EntityManager;
    private isActive = false;
    private count = 0;

    constructor(
        @inject(Mediator) private readonly mediator: Mediator,
        @inject("DataSource") private readonly dataSource: DataSource
    ) {}

    async startTransaction(): Promise<void> {
        if (this.isActive) {
            throw new Error("UnitOfWork: the transaction is already active.");
        }
        this.count += 1;
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        this.queryRunner = qr;
        this.manager = qr.manager;
        this.isActive = true;
    }

    async commit(): Promise<void> {
        if (!this.isActive || !this.queryRunner) {
            throw new Error("UnitOfWork: no active transaction to commit.");
        }

        const domainEvents = this.extractDomainEvents();

        for (const event of domainEvents) {
            await this.mediator.publish(event);
        }
        
        try {
            await this.queryRunner.commitTransaction();
        } catch (err) {
            try { await this.queryRunner.rollbackTransaction(); } catch {}
            throw err;
        } finally {
            await this.safeRelease();
        }
    }

    async rollback(): Promise<void> {
        if (!this.isActive || !this.queryRunner) {
            return;
        }
        try {
            await this.queryRunner.rollbackTransaction();
        } finally {
            await this.safeRelease();
        }
    }

    getRepository<T extends { new (manager: EntityManager): any }>(repo: T): InstanceType<T> {
        if (!this.manager) throw new Error("Transaction not started. Call start() first.");
        return new repo(this.manager);
    }

    private extractDomainEvents(): DomainEvent[] {
        return DomainEventsCollector.pullAll();
    }

    private async safeRelease(): Promise<void> {
        try {
            if (this.queryRunner && !this.queryRunner.isReleased) {
                await this.queryRunner.release();
            }
        } finally {
            this.queryRunner = undefined;
            this.manager = undefined;
            this.isActive = false;
        }
    }

    getManager(): EntityManager {
        return this.manager ?? this.dataSource.manager;
    }
    
    getRequiredManager(): EntityManager {
        if (!this.isActive || !this.manager) {
        throw new Error("UnitOfWork: se requiere transacción activa.");
        }
        return this.manager;
    }
}
