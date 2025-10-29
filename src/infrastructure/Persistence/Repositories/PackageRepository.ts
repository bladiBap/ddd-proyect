import { AppDataSource } from "../PersistenceModel/data-source";
import { IPackageRepository } from "@domain/aggregates/package/Package/IPackageRepository";
import { Package } from "../PersistenceModel/Entities/Package";
import { Package as DomainPackage } from "@domain/aggregates/package/Package/Package";
import { PackageMapper } from "../DomainModel/Config/PackageMapper";

import { inject, injectable } from "tsyringe";
import { DataSource, EntityManager } from "typeorm";

@injectable()
export class PackageRepository implements IPackageRepository {
    
    constructor(
        @inject("DataSource") private readonly dataSource: DataSource
    ) {}

    private getManager(): EntityManager {
        return this.dataSource.manager;
    }

    
    async getDetailsByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
        throw new Error("Method not implemented.");
    }
    async getByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
        throw new Error("Method not implemented.");
    }
    async addAsync(packageDomain: DomainPackage, em?: EntityManager): Promise<void> {
        const manager = em ?? this.getManager();
        const packageEntity = PackageMapper.toPersistence(packageDomain);
        await manager.getRepository(Package).save(packageEntity);
    }

    async existForClientToday (clientId : number) : Promise<Boolean> {
        const now = new Date();

        const start = new Date(now);
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        const count = await this.getManager()
            .getRepository(Package)
            .createQueryBuilder("p")
            .where('p."clientId" = :clientId', { clientId })
            .andWhere('p."datePackage" >= :start AND p."datePackage" < :end', { start, end })
            .getCount();

        return count > 0;
    }

    async getPackageByAddressClientIdAsync(addressId: number, clientId: number): Promise<DomainPackage | null> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const packageD = await this.getManager().getRepository(Package).findOne({
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