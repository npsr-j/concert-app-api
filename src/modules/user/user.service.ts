import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity, UserEntity } from './entities';
import { CreateReservationDto } from './dto';

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

    getReservations(userId: number) {
        return this.reservationRepository.findBy({ userId });
    }

    getReservationById(id: number) {
        return this.reservationRepository.findOneBy({ id });
    }

    addReservation(dto: CreateReservationDto) {
        const reservation = this.reservationRepository.create(dto);
        return this.reservationRepository.save(reservation);
    }

    removeReservation(id: number) {
        return this.reservationRepository.delete({ id });
    }
}
