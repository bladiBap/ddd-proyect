import { IRepository } from "core/abstractions/IRepository";
import { DailyAllocation } from './DailyAllocation';
import { AllocationLine } from "./AllocationLine";
import { EntityManager } from "typeorm";

export interface IDailyAllocationRepository extends IRepository<DailyAllocation> {
    findByDateAsync(date: Date): Promise<DailyAllocation>;
    getDailyAllocationToday(clientId: number): Promise<DailyAllocation | null>;
    updatedLines(lines: AllocationLine[], em?: EntityManager): Promise<void>;
}