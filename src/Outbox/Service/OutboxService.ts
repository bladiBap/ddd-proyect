import { OutboxMessage } from '../Model/OutboxMessage';
import { IOutboxRepository } from '../Repository/IOutboxRepository';
import { IOutboxService } from './Interface/IOutboxService';

export class OutboxService<TContent> implements IOutboxService<TContent>, IOutboxRepository<TContent> {

    async addAsync(message: OutboxMessage<TContent>): Promise<void> {
        
    }

    async update(outboxMessage: OutboxMessage<TContent>): Promise<void> {
        
    }

    async getUnprocessed(pageSize: number): Promise<OutboxMessage<TContent>[]> {
        return [];
    }
}