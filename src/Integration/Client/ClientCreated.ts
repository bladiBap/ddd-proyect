import { IntegrationMessage } from '@comunication/Contracts/Message/IntegrationMessage';

export class ClientCreated extends IntegrationMessage {
    public clientId: string;
    public name: string;

    constructor(clientId: string, name: string) {
        super();
        this.clientId = clientId;
        this.name = name;
    }
}