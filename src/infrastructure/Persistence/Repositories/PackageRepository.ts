import { IPackageRepository } from "@domain/aggregates/package/Package/IPackageRepository";
import { Package } from "../PersistenceModel/Entities/Package";
import { Package as DomainPackage } from "@domain/aggregates/package/Package/Package";
import { PackageMapper } from "../DomainModel/Config/PackageMapper";

import { inject, injectable } from "tsyringe";
import { IEntityManagerProvider } from "@core/abstractions/IEntityManagerProvider";

@injectable()
export class PackageRepository implements IPackageRepository {
    
    constructor(
        @inject("IEntityManagerProvider") private readonly emProvider: IEntityManagerProvider
    ) {}

    async getDetailsByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
        throw new Error("Method not implemented.");
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
        throw new Error("Method not implemented.");
    }

    async addAsync(packageDomain: DomainPackage): Promise<void> {
        const manager = this.emProvider.getManager();
        const packageEntity = PackageMapper.toPersistence(packageDomain);
        await manager.getRepository(Package).save(packageEntity);
    }

    async getPackageByAddressClientIdAsync(addressId: number, clientId: number): Promise<DomainPackage | null> {
        const manager = this.emProvider.getManager();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const packageD = await manager.getRepository(Package).findOne({
            where: {
                address: { id: addressId },
                client: { id: clientId },
                datePackage: today
            }
        });
        if (!packageD) return null;
        return PackageMapper.toDomain(packageD);
    }
}