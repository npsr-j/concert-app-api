import { Injectable } from '@nestjs/common';
import { CreateConcertDto } from './dto';
import { Concert } from './interfaces';

@Injectable()
export class AdminService {
    createConcert(dto: CreateConcertDto) {
        return dto;
    }

    deleteConcert(id: number) {
        return { id };
    }

    getConcertHistory(): Concert[] {
        return [
            {
                id: 1,
                name: 'Concert A',
                description: 'Description A',
                total_seat: 100,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                name: 'Concert B',
                description: 'Description B',
                total_seat: 150,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
    }
}
