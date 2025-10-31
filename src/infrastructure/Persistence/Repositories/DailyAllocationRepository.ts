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
import { IEntityManagerProvider } from "@core/abstractions/IEntityManagerProvider";

@injectable()
export class DailyAllocationRepository implements IDailyAllocationRepository {

    constructor(
        @inject("IEntityManagerProvider") private readonly emProvider: IEntityManagerProvider
    ) {}

    async findByDateAsync(date: Date): Promise<DailyAllocation> {
        throw new Error("Method not implemented.");
    }
    async getByIdAsync(id: number, readOnly?: boolean): Promise<DailyAllocation | null> {
        throw new Error("Method not implemented.");
    }

    async addAsync(entity: DailyAllocation): Promise<void> {
        const manager = this.emProvider.getManager();
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

        const manager = this.emProvider.getManager();
        const dailyAllocationEntity = await manager.getRepository(DailyAllocationEntity)
            .createQueryBuilder("dailyAllocation")
            .leftJoinAndSelect("dailyAllocation.lines", "lines")
            .where("dailyAllocation.date BETWEEN :start AND :end", { start: start.toISOString(), end: end.toISOString() })
            .andWhere("lines.clientId = :clientId", { clientId })
            .getOne();
        if (!dailyAllocationEntity) {
            return null;
        }
        return DailyAllocationMapper.toDomain(dailyAllocationEntity);
    }
    
    async updatedLines(lines: AllocationLine[]): Promise<void> {
        const allocationLineEntities = lines.map(line => AllocationLineMapper.toPersistence(line));
        const manager = this.emProvider.getManager();
        const res = await manager.getRepository(AllocationLineEntity).save(allocationLineEntities);
        return;
    }
}