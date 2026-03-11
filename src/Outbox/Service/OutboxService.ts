import { OutboxMapper } from '@outbox/Mappers/OutboxMapper';
import { OutboxMessage } from '../Model/OutboxMessage';
import { OutboxMessage as OutboxMessageEntity } from '@outbox/Persistence/OutboxMessage';
import { IOutboxRepository } from '../Repository/IOutboxRepository';
import { IOutboxService } from './Interface/IOutboxService';
import { IOutboxDatabase } from '@outbox/Repository/IOutboxDatabase';
import { inject, injectable } from 'tsyringe';

@injectable()
export class OutboxService<TContent> implements IOutboxService<TContent>, IOutboxRepository<TContent> {

	constructor(
        @inject('IOutboxDatabase')private readonly IOutboxDatabase: IOutboxDatabase
	){}

	async addAsync(message: OutboxMessage<TContent>): Promise<void> {
		console.log('Adding message to outbox');
		const entity = OutboxMapper.toEntity(message);
		const manager = this.IOutboxDatabase.getManager();
		await manager.getRepository(OutboxMessageEntity).save(entity);
	}

	async update(outboxMessage: OutboxMessage<TContent>): Promise<void> {
		const manager = this.IOutboxDatabase.getManager();
		const entity = OutboxMapper.toEntity(outboxMessage);
		await manager.getRepository(OutboxMessageEntity).save(entity);
	}

	async getUnprocessed(pageSize: number = 20): Promise<OutboxMessage<TContent>[]> {
		const manager = this.IOutboxDatabase.getManager();
		const entities = await manager.getRepository(OutboxMessageEntity).find({
			where: { processed: false },
			order: { created : 'ASC' },
			take: pageSize
		});
		const messages = entities.map(entity => OutboxMapper.toOutboxMessage<TContent>(entity));
		return messages;
	}
}