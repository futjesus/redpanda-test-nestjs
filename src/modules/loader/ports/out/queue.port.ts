import { Message } from 'kafkajs';

export abstract class QueueProducePort {
  abstract produce(topic: string, message: Message): Promise<void>;
}

export abstract class QueueConsumerPort {}
