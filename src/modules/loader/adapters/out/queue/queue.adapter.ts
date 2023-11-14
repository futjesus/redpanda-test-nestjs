import {
  QueueConsumerPort,
  QueueProducePort,
} from 'src/modules/loader/ports/out';

export class QueueAdapter {
  private queueProducePort: QueueProducePort;
  private queueConsumePort: QueueConsumerPort;

  constructor({ queueProducePort, queueConsumePort }) {
    this.queueProducePort = queueProducePort;
    this.queueConsumePort = queueConsumePort;
  }
}
