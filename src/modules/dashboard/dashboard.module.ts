import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from '../concert/entities';
import { ReservationEntity, ReservationHistoryEntity } from '../reservation/entities';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertEntity, ReservationEntity, ReservationHistoryEntity])],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
