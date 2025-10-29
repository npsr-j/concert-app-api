import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertEntity } from '../concert/entities';
import { ReservationHistoryEntity } from '../reservation/entities';
import { ReservationAction } from '../reservation/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,

    @InjectRepository(ReservationHistoryEntity)
    private readonly reservationHistoryRepository: Repository<ReservationHistoryEntity>,
  ) {}

  async getSummary() {
    const totalSeats = await this.getTotalSeats();
    const totalReserved = await this.getTotalReserved();
    const totalCancelled = await this.getTotalCancelled();

    return {
      totalSeats,
      totalReserved,
      totalCancelled,
    };
  }

  async getTotalSeats(): Promise<number> {
    const result = await this.concertRepository
      .createQueryBuilder('concert')
      .select('SUM(concert.totalSeat)', 'totalSeat')
      .getRawOne();

    return Number(result?.totalSeat || 0);
  }

  async getTotalReserved(): Promise<number> {
    const count = await this.reservationHistoryRepository.count({
      where: {
        actionLog: ReservationAction.RESERVED,
      },
    });

    return count;
  }

  async getTotalCancelled(): Promise<number> {
    const count = await this.reservationHistoryRepository.count({
      where: {
        actionLog: ReservationAction.CANCELLED,
      },
    });

    return count;
  }
}
