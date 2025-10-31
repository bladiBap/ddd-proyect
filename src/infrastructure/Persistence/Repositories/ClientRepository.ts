import { inject, injectable } from "tsyringe";
import { DataSource, EntityManager } from "typeorm";

import { IClientRepository } from "@domain/aggregates/client/IClientRepository";

import { Client as ClientEntity } from "../PersistenceModel/Entities/Client";
import { Client as ClientDomain } from "@domain/aggregates/client/Client";
import { ClientMapper } from "../DomainModel/Config/ClientMapper";
import { IEntityManagerProvider } from "@core/abstractions/IEntityManagerProvider";


@injectable()
export class ClientRepository implements IClientRepository {

    constructor(
        @inject("IEntityManagerProvider") private readonly emProvider: IEntityManagerProvider
    ) {}
        
    async deleteAsync(id: number): Promise<void> {
        const manager = this.emProvider.getManager();
        const repo = manager.getRepository(ClientEntity);
        await repo.delete({ id });
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<ClientDomain | null> {
        const manager = this.emProvider.getManager();
        const entity = await manager.getRepository(ClientEntity).findOne({
            where: { id },
        });
        if (!entity) return null;
        return ClientMapper.toDomain(entity);
    }

    async addAsync(entity: ClientDomain): Promise<void> {
        const manager = this.emProvider.getManager();
        await manager.getRepository(ClientEntity).save(ClientMapper.toPersistence(entity));
    }

    async getAddressToday( clientId: number): Promise<number | null> {
        const manager = this.emProvider.getManager();
        const client = await manager.getRepository(ClientEntity).findOne({
            where: { id: clientId },
            relations: ["addresses"],
        });
        if (!client) return null;
        return 0;
    }
}
