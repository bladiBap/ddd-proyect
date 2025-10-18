import { AppDataSource } from "../PersistenceModel/data-source";
import { IPackageRepository } from "@domain/aggregates/package/Package/IPackageRepository";
import { Package } from "../PersistenceModel/Entities/Package";
import { Package as DomainPackage } from "@domain/aggregates/package/Package/Package";
import { PackageMapper } from "../DomainModel/Config/PackageMapper";

export class PackageRepository implements IPackageRepository {
    
    private readonly repo = AppDataSource.getRepository(Package);
    
    async getDetailsByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
        throw new Error("Method not implemented.");
    }
    async getByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
        throw new Error("Method not implemented.");
    }
    async addAsync(entity: DomainPackage): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getPackageByAddressClientIdAsync(addressId: number, clientId: number): Promise<DomainPackage | null> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const packageD = await this.repo.findOne({
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