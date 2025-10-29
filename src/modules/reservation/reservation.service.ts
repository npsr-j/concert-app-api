import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertEntity } from '../concert/entities';
import { UserEntity } from '../user/entities';
import { CreateReservationDto } from './dto';
import { ReservationEntity, ReservationHistoryEntity } from './entities';
import { ReservationAction } from './enums';

@Injectable()
export class ReservationService {

    constructor(
        @InjectRepository(ReservationEntity)
        private reservationRepository: Repository<ReservationEntity>,

        @InjectRepository(ReservationHistoryEntity)
        private reservationHistoryRepository: Repository<ReservationHistoryEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        
        @InjectRepository(ConcertEntity)
        private concertRepository: Repository<ConcertEntity>,
    ) {}

    async getReservationsByUser(userId: number) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');

        const reservations = await this.reservationRepository.findBy({ userId });
        if (!reservations) return [];

        return reservations;
    }

    async addReservation(dto: CreateReservationDto) {
        // Validate user and concert exists
        const user = await this.userRepository.findOneBy({ id: dto.userId });
        const concert = await this.concertRepository.findOneBy({ id: dto.concertId });

        if (!user) throw new NotFoundException('User not found');
        if (!concert) throw new NotFoundException('Concert not found');

        // Verify no existing reservation
        const existingReservation = await this.reservationRepository.findOneBy({ userId: dto.userId, concertId: dto.concertId });

        if (existingReservation) {
            throw new ConflictException('Reservation already exists for this user and concert');
        }

        const reservation = this.reservationRepository.create(dto);
        await this.createReservationHistoryLog(dto.userId, dto.concertId, ReservationAction.RESERVED);
        await this.reservationRepository.save(reservation);
        return reservation;
    }

    async removeReservation(userId: number, concertId: number) {
        await this.createReservationHistoryLog(userId, concertId, ReservationAction.CANCELLED);
        return this.reservationRepository.delete({ userId, concertId });
    }

    async createReservationHistoryLog(userId: number, concertId: number, action: ReservationAction) {
        const user = await this.userRepository.findOneBy({ id: userId });
        const concert = await this.concertRepository.findOneBy({ id: concertId });

        if (!user) throw new NotFoundException('User not found');
        if (!concert) throw new NotFoundException('Concert not found');

        const log = this.reservationHistoryRepository.create({
            userId: userId,
            userName: user?.name || 'Unknown',
            concertId: concertId,
            concertName: concert?.name || 'Unknown',
            actionLog: action,
            createdAt: new Date(),
        });
        return this.reservationHistoryRepository.save(log);
    }

    getReservationHistory() {
        return this.reservationHistoryRepository.find();
    }
}
