import { ReservationEntity, ReservationHistoryEntity } from '../entities';
import { ReservationAction } from '../enums';

export const mockReservation: ReservationEntity = {
    id: 1,
    userId: 1,
    concertId: 1,
    createdAt: new Date('2025-01-15'),
};

export const mockReservationHistory: ReservationHistoryEntity = {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    concertId: 1,
    concertName: 'Summer Music Festival 2025',
    actionLog: ReservationAction.RESERVED,
    createdAt: new Date('2025-01-15'),
};
