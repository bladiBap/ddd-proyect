import 'reflect-metadata';
import { DailyAllocation } from '@domain/DailyAllocation/Entities/DailyAllocation';
import { IDailyAllocationRepository } from '@domain/DailyAllocation/Repositories/IDailyAllocationRepository';
import { AllocationLine } from '@domain/DailyAllocation/Entities/AllocationLine';

import { DailyAllocationMapper } from '../DomainModel/Config/DailyAllocationMapper';
import { DailyAllocation as DailyAllocationEntity } from '../PersistenceModel/Entities/DailyAllocation';
import { AllocationLine as AllocationLineEntity } from '../PersistenceModel/Entities/AllocationLine';
import { inject, injectable } from 'tsyringe';
import { AllocationLineMapper } from '../DomainModel/Config/AllocationLineMapper';
import { IEntityManagerProvider } from '@common/Core/Abstractions/IEntityManagerProvider';
import { DateUtils } from '@/Common/Utils/Date';

@injectable()
export class DailyAllocationRepository implements IDailyAllocationRepository {

    constructor(
        @inject('IEntityManagerProvider') private readonly emProvider: IEntityManagerProvider
    ) {}

    async findByDateAsync(date: Date): Promise<DailyAllocation> {
        throw new Error('Method not implemented.');
    }
    async getByIdAsync(id: number, readOnly?: boolean): Promise<DailyAllocation | null> {
        throw new Error('Method not implemented.');
    }

    async addAsync(entity: DailyAllocation): Promise<void> {
        const manager = this.emProvider.getManager();
        const persistenceEntity = DailyAllocationMapper.toPersistence(entity);
        await manager.getRepository(DailyAllocationEntity).save(persistenceEntity);
        return;
    }

    async getDailyAllocationToday(clientId: number): Promise<DailyAllocation | null> {
        const today = new Date();
        const formattedDate = DateUtils.formatDate(today);

        const manager = this.emProvider.getManager();

        const dailyAllocationEntity = await manager.getRepository(DailyAllocationEntity).findOne({
            where: { 
                date: formattedDate,
                lines: { 
                    clientId: clientId
                }
            },
            relations: ['lines'],
        });
        
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