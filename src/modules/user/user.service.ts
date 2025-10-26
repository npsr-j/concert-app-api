import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity, UserEntity } from './entities';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,

        @InjectRepository(ReservationEntity)
        private reservationRepository: Repository<ReservationEntity>,
    ) {}

    getUsers() {
        return this.usersRepository.find();
    }

    getUserById(id: number) {
        return this.usersRepository.findOneBy({ id });
    }

    reserveSeat(concertId: number) {
        return true;
    }

    cancelReservation(concertId: number) {
        return true;
    }

    getReservations(userId: number) {
        return this.reservationRepository.findBy({ userId });
    }
}
