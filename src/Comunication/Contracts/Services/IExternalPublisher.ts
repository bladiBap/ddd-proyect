import { IntegrationMessage } from '../Message/IntegrationMessage';

export interface IExternalPublisher {
    /**
     * @param message El mensaje que debe extender de IntegrationMessage.
     * @param destination Destino opcional.
     * @param declareDestination Si se debe declarar el destino.
     */
    publishAsync<T extends IntegrationMessage>(
        message: T,
        destination?: string | null,
        declareDestination?: boolean
    ): Promise<void>;
}