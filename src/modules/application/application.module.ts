import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { SubscribtionModule } from './subscribtion/subscribtion.module';



@Module({
  imports: [NotificationModule, SubscribtionModule,],
})
export class ApplicationModule {}
