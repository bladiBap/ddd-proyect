import { OutboxMessage } from '../Model/OutboxMessage';
export interface IOutboxRepository<TContent> {
    update (outboxMessage: OutboxMessage<TContent>): Promise<void>;
    getUnprocessed (pageSize: number): Promise<OutboxMessage<TContent>[]>;
}