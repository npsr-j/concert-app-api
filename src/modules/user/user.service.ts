import { Injectable } from '@nestjs/common';
import { ConcertReservation } from './interfaces';

@Injectable()
export class UserService {
    getConcerts() {
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

    reserveSeat(concertId: number) {
        return true;
    }

    cancelReservation(concertId: number) {
        return true;
    }

    getReservations(userId: number): ConcertReservation[] {
        return [
            {
                id: 1,
                name: 'Concert A',
                description: 'Description A',
                total_seat: 100,
                created_at: new Date(),
                updated_at: new Date(),
                is_reserved: true,
                reserved_seats: 1,
                reserved_at: new Date(),
            },
            {
                id: 2,
                name: 'Concert B',
                description: 'Description B',
                total_seat: 150,
                created_at: new Date(),
                updated_at: new Date(),
                is_reserved: false,
                reserved_seats: 0,
                reserved_at: null,
            },
        ];
    }
}
