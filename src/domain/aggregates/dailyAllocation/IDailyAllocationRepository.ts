import { IRepository } from "core/abstractions/IRepository";
import { DailyAllocation } from './DailyAllocation';

export interface IDailyAllocationRepository extends IRepository<DailyAllocation> {
    findByDateAsync(date: Date): Promise<DailyAllocation>;
}