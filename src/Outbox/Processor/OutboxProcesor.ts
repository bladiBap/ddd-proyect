import { injectable, inject } from 'tsyringe';
import { IOutboxRepository } from '@outbox/Repository/IOutboxRepository';
//import { IRabbitMQPublisher } from '@comunication/RabbitMQ/Interface/IRabbitMQPublisher';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';

@injectable()
export class OutboxProcessor<TContent> {
    constructor(
        @inject('IOutboxRepository') private readonly outboxRepo: IOutboxRepository<TContent>,
        //@inject('IRabbitMQPublisher') private readonly rabbitPublisher: IRabbitMQPublisher,
        @inject('IUnitOfWork') private readonly uow: IUnitOfWork
    ) {}

    public async process(): Promise<void> {
        const messages = await this.outboxRepo.getUnprocessed(10);
        
        if (messages.length === 0) {
            return;
        }

        for (const item of messages) {
            try {
                
                await this.uow.startTransaction();

                
                //await this.rabbitPublisher.publish(item.topic, item.content);

                
                item.markAsProcessed();
                
                
                await this.outboxRepo.update(item); 

                await this.uow.commit();
                
                console.log(`Mensaje ${item.id} procesado exitosamente.`);
            } catch (error) {
                console.error(`Error procesando mensaje ${item.id}:`, error);
                await this.uow.rollback();
            }
        }
    }
}