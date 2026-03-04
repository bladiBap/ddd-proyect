import { IntegrationMessage } from '@comunication/Contracts/Message/IntegrationMessage';

export class ClientCreated extends IntegrationMessage {
    public Id: string;
    public FirstName: string;

    constructor(clientId: string, firstName: string) {
        super();
        this.Id = clientId;
        this.FirstName = firstName;
    }
}