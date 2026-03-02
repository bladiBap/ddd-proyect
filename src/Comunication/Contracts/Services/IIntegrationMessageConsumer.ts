import { IntegrationMessage } from '../Message/IntegrationMessage';

export interface IIntegrationMessageConsumer<T extends IntegrationMessage> {
    /**
     * @param message El mensaje recibido que extiende de IntegrationMessage.
     * @param cancellationToken (Opcional) Token para cancelar la operación.
     */
    handleAsync(message: T, cancellationToken?: AbortSignal): Promise<void>;
}