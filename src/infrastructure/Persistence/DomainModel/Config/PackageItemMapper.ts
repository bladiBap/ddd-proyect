import { PackageItem as PackageItemDomain } from '@domain/aggregates/package/PackageItem/PackageItem';
import { PackageItem as PackageItemEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/PackageItem';

export class PackageItemMapper {
    static toPersistenceList(items: PackageItemDomain[]): PackageItemEntity[] {
        return items.map(item => this.toPersistence(item));
    }

    static toPersistence(item: PackageItemDomain): PackageItemEntity {
        const itemEntity = new PackageItemEntity();
        if (item.getId() !== 0) {
            itemEntity.id = item.getId();
        }
        
        itemEntity.recipeId = item.getRecipeId();
        itemEntity.packageId = item.getPackageId();
        
        return itemEntity;
    }

    static toDomainList(data: PackageItemEntity[]): PackageItemDomain[] {
        return data.map(item => this.toDomain(item));
    }

    static toDomain(data: PackageItemEntity): PackageItemDomain {
        return new PackageItemDomain(
            data.id,
            data.recipeId,
            data.packageId
        );
    }
}