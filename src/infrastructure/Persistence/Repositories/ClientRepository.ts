import { IClientRepository } from "@domain/Client/IClientRepository";

import { AppDataSource } from "../PersistenceModel/data-source";
import { Client as ClientEntity } from "../PersistenceModel/Entities/Client";
import { Client } from "@domain/Client/Client";
import { ClientMapper } from "../DomainModel/Config/ClientMapper";


export class ClientRepository implements IClientRepository {
    private readonly repo = AppDataSource.getRepository(ClientEntity);

    async deleteAsync(id: number): Promise<void> {
        await this.repo.delete({ id } as any);
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<Client | null> {
        const entity = await this.repo.findOne({ where: { id } } as any);
        if (!entity) return null;
        return ClientMapper.toDomain(entity);
    }

    async addAsync(entity: Client): Promise<void> {
        const persisted = await this.repo.save(ClientMapper.toPersistence(entity));
        if ((persisted as any).id != null) {
            (entity as any).id = (persisted as any).id;
        }
    }

    
}
