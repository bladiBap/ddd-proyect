import { injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { AppDataSource } from "./DomainModel/data-source";
import { Mediator } from "@application/Mediator/Mediator";
import { DomainEvent } from "@domain/core/abstractions/DomainEvent";
import { Entity } from "@domain/core/abstractions/Entity";

@injectable()
export class UnitOfWork {
    private queryRunner = AppDataSource.createQueryRunner();
    private manager: EntityManager;
    private mediator = new Mediator();

    constructor() {
        this.manager = this.queryRunner.manager;
    }

    async start(): Promise<void> {
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
    }

    async commit(): Promise<void> {
        try {
            // 1️⃣ Obtén los eventos de dominio (equivalente al ChangeTracker)
            const domainEvents = this.extractDomainEvents();

            // 2️⃣ Publica los eventos antes del commit (como Mediator.Publish en C#)
            for (const event of domainEvents) {
                await this.mediator.send(event); // o publish(event)
            }

            // 3️⃣ Confirma la transacción
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
        const events: DomainEvent[] = [];

        // 🔸 En C#, se usa ChangeTracker; en TS debemos guardar las entidades modificadas manualmente.
        // Por simplicidad, podrías mantener una lista en memoria si tu app emite eventos a través de tus entidades.
        // Ejemplo futuro: global DomainEventStore.

        return events;
    }
}
