import { Package as PackageDomain } from '@domain/aggregates/package/Package/Package';
import { Package as PackageEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/Package'; 

import { PackageItem as PackageItemDomain } from '@domain/aggregates/package/PackageItem/PackageItem';
import { PackageItem as PackageItemEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/PackageItem';

import { PackageItemMapper } from './PackageItemMapper';

export class PackageMapper {

    static toPersistenceList(packages: PackageDomain[]): PackageEntity[] {
        return packages.map(packaged => this.toPersistence(packaged));
    }

    static toPersistence(packaged: PackageDomain): PackageEntity {

        const packageItemsEntities: PackageItemEntity[] = packaged.getListPackageItems()?.map(item => {
            const itemEntity = PackageItemMapper.toPersistence(item);
            return itemEntity;
            }
        );
        const packageEntity = new PackageEntity();
        if (packaged.getId() !== 0) {
            packageEntity.id = packaged.getId();
        }
        packageEntity.addressId = packaged.getAddressId();
        packageEntity.clientId = packaged.getClientId();
        packageEntity.packageItems = packageItemsEntities || [];
        packageEntity.datePackage = packaged.getDatePackage();
        packageEntity.status = packaged.getStatusPackage();
        packageEntity.code = packaged.getCode();

        return packageEntity;
    }

    static toDomainList(data: PackageEntity[]): PackageDomain[] {
        return data.map(packaged => this.toDomain(packaged));
    }

    static toDomain(data: PackageEntity): PackageDomain {
        const packageItems: PackageItemDomain[] = data.packageItems?.map(item => {
            return new PackageItemDomain(
                item.id,
                item.recipeId,
                item.packageId,
                item.quantity
            );
        }); 

        return new PackageDomain(
            data.id,
            data.code,
            data.status,
            data.clientId,
            data.addressId,
            data.datePackage,
            packageItems || []
        );
    }
}