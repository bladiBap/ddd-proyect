import { ClientCreated } from '@/Integration/Client/ClientCreated';
import { IIntegrationMessageConsumer } from '@comunication/Contracts/Services/IIntegrationMessageConsumer';
import { injectable } from 'tsyringe';

@injectable()
export class ClientCreatedHandlerConsumer implements IIntegrationMessageConsumer<ClientCreated> {

    async handleAsync(message: ClientCreated, cancellationToken?: AbortSignal): Promise<void> {
        console.log(`Cliente creado: ID=${message.clientId}, Name=${message.name}`);
        console.log(`Procesamiento de mensaje ClientCreated finalizado para ClientId=${message.clientId}`);
    }
}