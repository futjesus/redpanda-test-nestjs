export abstract class QueuePort {
  abstract listenTestMessage(): Promise<void>;
  abstract publishMessage(
    topic: string,
    message: Record<string, number | string | boolean>,
  ): Promise<void>;
}
