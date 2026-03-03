import { EventMap } from '@domain/EventMap/EventMap';
import { OutboxMessage } from '@outbox/Model/OutboxMessage';
import { OutboxMessage as OutboxEntity } from '@outbox/Persistence/OutboxMessage';
import { plainToInstance } from 'class-transformer';

export class OutboxMapper {

    static deserializeContent(content: string, type: string): any {
        const targetClass = EventMap[type];
        if (!targetClass) {
            throw new Error(`Tipo de evento desconocido: ${type}`);
        }
        return plainToInstance(targetClass, JSON.parse(content));
    }

    static toOutboxMessage<TContent>( outboxEntity: OutboxEntity ): OutboxMessage<TContent> {
        const contentRecord = outboxEntity.content;
        const contentRecordString = JSON.stringify(contentRecord);

        const content = this.deserializeContent(contentRecordString, outboxEntity.type) as TContent;
        // console.log(`Deserializando contenido para tipo ${outboxEntity.type}:`, content);
        // console.log(`Type del contenido deserializado: ${typeof content}`);
        //
        // const expectedClass = EventMap[outboxEntity.type];
        // console.log(`Esperando instancia de: ${expectedClass?.name}`);
        // console.log(`Es instancia de ${expectedClass?.name}?`, content instanceof expectedClass);

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