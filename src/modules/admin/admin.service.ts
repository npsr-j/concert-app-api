import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcertDto, DeleteConcertDto } from './dto';
import { ConcertEntity, ConcertHistoryEntity } from './entities';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(ConcertEntity)
        private concertsRepository: Repository<ConcertEntity>,

        @InjectRepository(ConcertHistoryEntity)
        private concertsHistoryRepository: Repository<ConcertHistoryEntity>,
    ) {}

    getConcerts() {
        return this.concertsRepository.find();
    }

    createConcert(dto: CreateConcertDto) {
        const newConcert = this.concertsRepository.create(dto);
        return this.concertsRepository.save(newConcert).then(() => {
            return this.createConcertHistoryLog(dto, newConcert.id, 'CREATED');
        }).then(() => newConcert);
    }

    deleteConcert(id: number, deleteConcertDto: DeleteConcertDto) {
        return this.concertsRepository.delete(id).then(() => {
            return this.createConcertHistoryLog(deleteConcertDto, id, 'DELETED');
        });
    }

    createConcertHistoryLog(dto: CreateConcertDto | DeleteConcertDto, concertId: number, action: string) {
        const log = this.concertsHistoryRepository.create({
            userId: dto.userId,
            userName: dto.userName,
            concertId: concertId,
            name: dto.name,
            actionLog: action,
            createdAt: new Date(),
        });
        return this.concertsHistoryRepository.save(log);
    }

    getConcertHistory() {
        return this.concertsHistoryRepository.find();
    }
}
