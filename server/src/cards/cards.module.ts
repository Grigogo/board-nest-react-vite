import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { EventsModule } from '../events/events.module';

@Module({
  providers: [CardsService],
  controllers: [CardsController],
  imports: [EventsModule],
})
export class CardsModule {}
