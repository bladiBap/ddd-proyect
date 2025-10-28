import "reflect-metadata";
import { DailyAllocation } from "@domain/aggregates/dailyAllocation/DailyAllocation";
import { IDailyAllocationRepository } from "@domain/aggregates/dailyAllocation/IDailyAllocationRepository";

import { DailyAllocationMapper } from "../DomainModel/Config/DailyAllocationMapper";
import { DailyAllocation as DailyAllocationEntity } from "../PersistenceModel/Entities/DailyAllocation";
import { DataSource, EntityManager } from "typeorm";
import { inject, injectable } from "tsyringe";

@injectable()
export class DailyAllocationRepository implements IDailyAllocationRepository {

    constructor(
        @inject("DataSource") private dataSource: DataSource
    ) {}

    private getManager(): EntityManager {
        return this.dataSource.manager;
    }

    findByDateAsync(date: Date): Promise<DailyAllocation> {
        throw new Error("Method not implemented.");
    }
    getByIdAsync(id: number, readOnly?: boolean): Promise<DailyAllocation | null> {
        throw new Error("Method not implemented.");
    }
    async addAsync(entity: DailyAllocation, em?: EntityManager): Promise<void> {
        const manager = em || this.getManager();
        const persistenceEntity = DailyAllocationMapper.toPersistence(entity);
        await manager.getRepository(DailyAllocationEntity).save(persistenceEntity);
        return;
    }

}