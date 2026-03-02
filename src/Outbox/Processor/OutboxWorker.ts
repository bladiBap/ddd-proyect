import { injectable, inject } from 'tsyringe';
import { IOutboxRepository } from '@outbox/Repository/IOutboxRepository';
//import { IRabbitMQPublisher } from '@comunication/RabbitMQ/Interface/IRabbitMQPublisher';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';

@injectable()
export class OutboxWorker<TContent> {
    private intervalId: NodeJS.Timeout | null = null;
    private readonly INTERVAL_MS = 5000;
    private isProcessing = false;

    constructor(
        @inject('IOutboxRepository') private readonly outboxRepo: IOutboxRepository<TContent>,
        //@inject('IRabbitMQPublisher') private readonly rabbitPublisher: IRabbitMQPublisher,
        @inject('IUnitOfWork') private readonly uow: IUnitOfWork
    ) {}

    public start(): void {
        if (this.intervalId) {
            return;
        }

        console.log('Outbox Worker iniciado en Node.js...');
        
        this.runCycle();
        this.intervalId = setInterval(() => this.runCycle(), this.INTERVAL_MS);
    }

    private async runCycle(): Promise<void> {
        if (this.isProcessing) {
            return;
        }
        this.isProcessing = true;

        try {
            console.log(`Verificando outbox: ${new Date().toISOString()}`);
            //await this.processMessages();
        } catch (error) {
            console.error('Error fatal en el ciclo del worker:', error);
        } finally {
            this.isProcessing = false;
        }
    }
}