export abstract class ConsumptionPort {
  abstract loadConsumption(): void;
  abstract listenEvents(): void;
}
