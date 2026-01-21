import { IRepository } from '@common/Core/Abstractions/IRepository';
import { DailyAllocation } from '../Entities/DailyAllocation';
import { AllocationLine } from '../Entities/AllocationLine';
import { EntityManager } from 'typeorm';

export interface IDailyAllocationRepository extends IRepository<DailyAllocation> {
    findByDateAsync(date: Date): Promise<DailyAllocation>;
    getDailyAllocation(clientId: number, date: Date): Promise<DailyAllocation | null>;
    updatedLines(lines: AllocationLine[], em?: EntityManager): Promise<void>;
}