import { DependencyContainer } from 'tsyringe';
import { IntegrationMessage } from '../Contracts/Message/IntegrationMessage';
import { IIntegrationMessageConsumer } from '../Contracts/Services/IIntegrationMessageConsumer';

export default class DependecyInjection {

    static addRabbitMQConsumer<
        TMessage extends IntegrationMessage, 
        THandler extends IIntegrationMessageConsumer<TMessage>
        > ( container: DependencyContainer, handler: THandler, queueName: string, declareQueue: boolean = false, exchangeName?: string ): DependencyContainer {
        
        container.registerSingleton<IIntegrationMessageConsumer<TMessage>>(handler)
        
        return container;
    }
}