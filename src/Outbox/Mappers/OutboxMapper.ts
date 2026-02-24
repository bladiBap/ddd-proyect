import { OutboxMessage } from '@outbox/Model/OutboxMessage';
import { OutboxMessage as OutboxEntity } from '@outbox/Persistence/OutboxMessage';

export class OutboxMapper {

    static toOutboxMessage<TContent>( outboxEntity: OutboxEntity ): OutboxMessage<TContent> {
        const content = outboxEntity.content as TContent;
        const message = new OutboxMessage<TContent>(content)
        message.id = outboxEntity.id;
        message.type = outboxEntity.type;
        message.processed = outboxEntity.processed;
        message.correlationId = outboxEntity.correlationId;
        message.created = outboxEntity.created;
        message.processed = outboxEntity.processed;
        message.processedOn = outboxEntity.processedOn;
        message.spanId = outboxEntity.spanId;
        message.traceId = outboxEntity.traceId;
        return message;
    }

    static toEntity<TContent>(outboxMessage: OutboxMessage<TContent>): OutboxEntity {
        const entity = new OutboxEntity();
        entity.id = outboxMessage.id;
        entity.type = outboxMessage.type;
        entity.content = outboxMessage.content as Record<string, unknown>;
        entity.processed = outboxMessage.processed;
        entity.correlationId = outboxMessage.correlationId ?? undefined;
        entity.created = outboxMessage.created;
        entity.processedOn = outboxMessage.processedOn ?? undefined;
        entity.spanId = outboxMessage.spanId ?? undefined;
        entity.traceId = outboxMessage.traceId ?? undefined;
        return entity;
    }
}