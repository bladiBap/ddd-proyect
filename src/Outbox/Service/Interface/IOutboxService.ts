import { OutboxMessage } from '../../Model/OutboxMessage';


export interface IOutboxService<TContent> {
    addAsync(message: OutboxMessage<TContent>): Promise<void>;
}