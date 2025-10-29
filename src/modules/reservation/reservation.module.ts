import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from '../concert/entities';
import { UserEntity } from '../user/entities';
import { ReservationEntity, ReservationHistoryEntity } from './entities';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity, ReservationHistoryEntity, UserEntity, ConcertEntity])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
