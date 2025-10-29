import { inject, injectable } from "tsyringe";
import { DataSource, EntityManager } from "typeorm";

import { IClientRepository } from "@domain/aggregates/client/IClientRepository";

import { Client as ClientEntity } from "../PersistenceModel/Entities/Client";
import { Client as ClientDomain } from "@domain/aggregates/client/Client";
import { ClientMapper } from "../DomainModel/Config/ClientMapper";


@injectable()
export class ClientRepository implements IClientRepository {

    constructor(
        @inject("DataSource") private readonly dataSource: DataSource
    ) {}

    private getManager(): EntityManager {
        return this.dataSource.manager;
    }

    async deleteAsync(id: number, em?: EntityManager): Promise<void> {
        const manager = em ?? this.getManager();
        const repo = manager.getRepository(ClientEntity);
        await repo.delete({ id });
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<ClientDomain | null> {
        const entity = await this.getManager().getRepository(ClientEntity).findOne({
            where: { id },
        });
        if (!entity) return null;
        return ClientMapper.toDomain(entity);
    }

    async addAsync(entity: ClientDomain, em?: EntityManager): Promise<void> {
        const manager = em ?? this.getManager();
        await manager.getRepository(ClientEntity).save(ClientMapper.toPersistence(entity));
    }

    async getAddressToday( clientId: number): Promise<number | null> {
        const client = await this.getManager().getRepository(ClientEntity).findOne({
            where: { id: clientId },
            relations: ["addresses"],
        });
        if (!client) return null;
        return 0;
    }
}
