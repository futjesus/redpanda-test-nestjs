export abstract class ConsumptionPort {
  abstract startListenEvents(): void;
  abstract startProduceEvents(): void;
}
