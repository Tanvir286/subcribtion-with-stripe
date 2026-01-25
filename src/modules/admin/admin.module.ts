import { Module } from '@nestjs/common';
import { PaymentTransactionModule } from './payment-transaction/payment-transaction.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    PaymentTransactionModule,
    NotificationModule,
  ],
})
export class AdminModule {}
