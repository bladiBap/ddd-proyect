import { ClientCreated } from '@/Integration/Client/ClientCreated';
import { ClientCreatedCommand } from '@application/Client/Command/ClientCreatedCommand';
import { Mediator } from '@common/Mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/Contracts/Services/IIntegrationMessageConsumer';
import { injectable } from 'tsyringe';

@injectable()
export class ClientCreatedHandlerConsumer implements IIntegrationMessageConsumer<ClientCreated> {

    constructor(private readonly _mediator: Mediator) {}

    async handleAsync(message: ClientCreated, cancellationToken?: AbortSignal): Promise<void> {
        const command = new ClientCreatedCommand(0, message.FirstName);
        await this._mediator.send(command);
    }
}