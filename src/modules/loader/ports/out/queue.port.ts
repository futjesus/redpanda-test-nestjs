export type Message = Record<string, number | string | boolean>;

export interface MessageProducerAction {
  topic: string;
  onMessage: (message: Message) => void;
}

export interface MessageConsumerAction<T> {
  topic: string;
  message: T;
}

export abstract class QueuePort {
  abstract listenTestMessage(params: MessageProducerAction): Promise<void>;
  abstract publishMessage<T>({
    topic,
    message,
  }: MessageConsumerAction<T>): Promise<void>;
}
