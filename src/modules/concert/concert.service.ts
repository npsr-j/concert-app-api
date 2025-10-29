import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto';
import { ConcertEntity } from './entities';

@Injectable()
export class ConcertService {
    constructor(
        @InjectRepository(ConcertEntity)
        private concertsRepository: Repository<ConcertEntity>,
    ) {}

    getConcerts() {
        return this.concertsRepository.find();
    }

    async createConcert(dto: CreateConcertDto) {
        const newConcert = this.concertsRepository.create(dto);
        await this.concertsRepository.save(newConcert);
        return newConcert;
    }

    async deleteConcert(id: number) {
        const concert = await this.concertsRepository.findOneBy({ id });
        if (!concert) throw new NotFoundException('Concert not found');
        return this.concertsRepository.delete(id);
    }
}
