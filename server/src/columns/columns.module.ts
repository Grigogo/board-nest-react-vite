import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [EventsModule],
  providers: [ColumnsService],
  controllers: [ColumnsController],
})
export class ColumnsModule {}
