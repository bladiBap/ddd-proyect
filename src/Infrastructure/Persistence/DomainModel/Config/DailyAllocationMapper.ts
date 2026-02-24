import { DailyAllocation as DailyAllocationDomain } from '@domain/DailyAllocation/Entities/DailyAllocation';
import { DailyAllocation as DailyAllocationEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/DailyAllocation';

import { AllocationLine as AllocationLineDomain} from '@domain/DailyAllocation/Entities/AllocationLine';
import { AllocationLine as AllocationLineEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/AllocationLine';

export class DailyAllocationMapper {

    static toPersistence(dailyAllocation: DailyAllocationDomain): DailyAllocationEntity {
        const addressEntity = new DailyAllocationEntity();
        if (dailyAllocation.getId() !== 0) {
            addressEntity.id = dailyAllocation.getId();
        }
        addressEntity.date = dailyAllocation.getDate();
        addressEntity.lines = dailyAllocation.getLines().map((line: AllocationLineDomain) => {
            const lineEntity = new AllocationLineEntity();
            if (line.getId() !== 0) {
                lineEntity.id = line.getId();
            }
            lineEntity.allocationId = dailyAllocation.getId();
            lineEntity.clientId = line.getClientId();
            lineEntity.recipeId = line.getRecipeId();
            lineEntity.quantityNeeded = line.getQuantityNeeded();
            lineEntity.quantityPackaged = line.getQuantityPackaged();
            return lineEntity;
        });

        addressEntity.lines.forEach(line => {
            line.allocation = addressEntity;
        });
        return addressEntity;
    }

    static toDomain(data: DailyAllocationEntity): DailyAllocationDomain {
        const lines = data.lines.map((lineEntity: AllocationLineEntity) => {
            return new AllocationLineDomain(
                lineEntity.id,
                lineEntity.allocationId,
                lineEntity.clientId,
                lineEntity.recipeId,
                lineEntity.quantityNeeded,
                lineEntity.quantityPackaged
            );
        });

        return new DailyAllocationDomain(
            data.id,
            data.date,
            lines
        );
    }
}