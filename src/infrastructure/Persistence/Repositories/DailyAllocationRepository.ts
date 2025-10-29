import "reflect-metadata";
import { DailyAllocation } from "@domain/aggregates/dailyAllocation/DailyAllocation";
import { IDailyAllocationRepository } from "@domain/aggregates/dailyAllocation/IDailyAllocationRepository";
import { AllocationLine } from "@domain/aggregates/dailyAllocation/AllocationLine";

import { DailyAllocationMapper } from "../DomainModel/Config/DailyAllocationMapper";
import { DailyAllocation as DailyAllocationEntity } from "../PersistenceModel/Entities/DailyAllocation";
import { AllocationLine as AllocationLineEntity } from "../PersistenceModel/Entities/AllocationLine";
import { DataSource, EntityManager } from "typeorm";
import { inject, injectable } from "tsyringe";
import { AllocationLineMapper } from "../DomainModel/Config/AllocationLineMapper";

@injectable()
export class DailyAllocationRepository implements IDailyAllocationRepository {

    constructor(
        @inject("DataSource") private dataSource: DataSource
    ) {}

    private getManager(): EntityManager {
        return this.dataSource.manager;
    }

    async findByDateAsync(date: Date): Promise<DailyAllocation> {
        throw new Error("Method not implemented.");
    }
    async getByIdAsync(id: number, readOnly?: boolean): Promise<DailyAllocation | null> {
        throw new Error("Method not implemented.");
    }


    async addAsync(entity: DailyAllocation, em?: EntityManager): Promise<void> {
        const manager = em || this.getManager();
        const persistenceEntity = DailyAllocationMapper.toPersistence(entity);
        await manager.getRepository(DailyAllocationEntity).save(persistenceEntity);
        return;
    }

    async getDailyAllocationToday(clientId: number): Promise<DailyAllocation | null> {
        const today = new Date();
        
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        const manager = this.getManager();
        const dailyAllocationEntity = await manager.getRepository(DailyAllocationEntity)
            .createQueryBuilder("dailyAllocation")
            .leftJoinAndSelect("dailyAllocation.lines", "lines")
            .where("dailyAllocation.date BETWEEN :start AND :end", { start, end })
            .andWhere("lines.clientId = :clientId", { clientId })
            .getOne();
        if (!dailyAllocationEntity) {
            return null;
        }
        return DailyAllocationMapper.toDomain(dailyAllocationEntity);
    }

    async updatedLines(lines: AllocationLine[], em?: EntityManager): Promise<void> {
        const allocationLineEntities = lines.map(line => AllocationLineMapper.toPersistence(line));
        const manager = em || this.getManager();
        const res = await manager.getRepository(AllocationLineEntity).save(allocationLineEntities);
        return;
    }
}