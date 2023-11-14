export abstract class QueuePort {
  abstract listenTestMessage(): Promise<void>;
}
