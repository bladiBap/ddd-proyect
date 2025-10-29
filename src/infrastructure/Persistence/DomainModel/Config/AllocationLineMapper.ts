import { AllocationLine as AllocationLineDomain } from "@domain/aggregates/dailyAllocation/AllocationLine";
import { AllocationLine as AllocationLineEntity } from "@infrastructure/Persistence/PersistenceModel/Entities/AllocationLine";

export class AllocationLineMapper {

    static toPersistence(allocationLine: AllocationLineDomain): AllocationLineEntity {
        const lineEntity = new AllocationLineEntity();
        if (allocationLine.getId() !== 0) {
            lineEntity.id = allocationLine.getId();
        }
        if (allocationLine.getAllocationId() !== 0) {
            lineEntity.allocationId = allocationLine.getAllocationId();
        }
        lineEntity.clientId = allocationLine.getClientId();
        lineEntity.recipeId = allocationLine.getRecipeId();
        lineEntity.quantityNeeded = allocationLine.getQuantityNeeded();
        lineEntity.quantityPackaged = allocationLine.getQuantityPackaged();
        return lineEntity;
    }
    static toDomain(data: AllocationLineEntity): AllocationLineDomain {
        return new AllocationLineDomain(
            data.id,
            data.allocationId,
            data.clientId,
            data.recipeId,
            data.quantityNeeded,
            data.quantityPackaged
        );
    }   
}