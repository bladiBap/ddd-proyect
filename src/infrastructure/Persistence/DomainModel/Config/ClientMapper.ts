import { Client as ClientDomain } from '@domain/aggregates/client/Client';
import { Client as ClientEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/Client';

export class ClientMapper {
    
    static toPersistenceList(items: ClientDomain[]): ClientEntity[] {
        return items.map(item => this.toPersistence(item));
    }

    static toPersistence(item: ClientDomain): ClientEntity {
        const itemEntity = new ClientEntity();
        if (item.getId() !== 0) {
            itemEntity.id = item.getId();
        }
        itemEntity.name = item.getName();
        return itemEntity;
    }

    static toDomainList(data: ClientEntity[]): ClientDomain[] {
        return data.map(item => this.toDomain(item));
    }

    static toDomain(data: ClientEntity): ClientDomain {
        return new ClientDomain(
            data.id,
            data.name
        );
    }
}