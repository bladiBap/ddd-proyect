import { injectable, inject } from 'tsyringe';
import { IOutboxRepository } from '@outbox/Repository/IOutboxRepository';
//import { IRabbitMQPublisher } from '@comunication/RabbitMQ/Interface/IRabbitMQPublisher';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { Mediator } from '@common/Mediator/Mediator';
import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';
import { PackageCompletedOutbox } from '@application/OutboxMessagehandler/PackageCompletedHandler';

@injectable()
export class OutboxProcessor<TContent extends DomainEvent> {
    constructor(
        @inject('IOutboxRepository') private readonly outboxRepo: IOutboxRepository<TContent>,
        @inject('IUnitOfWork') private readonly uow: IUnitOfWork,
        private readonly mediator: Mediator
    ) {}

    public async process(): Promise<void> {
        const messages = await this.outboxRepo.getUnprocessed(10);
        console.log(`Procesando ${messages.length} mensajes de outbox...`);
        
        if (messages.length === 0) {
            return;
        }
        for (const item of messages) {
            try {
                
                await this.uow.startTransaction();

                
                //await this.rabbitPublisher.publish(item.topic, item.content);
                console.log(item.content.constructor.name);
                await this.mediator.publishOutboxMessage(item);
                            
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