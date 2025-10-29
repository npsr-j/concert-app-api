
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationAction } from '../enums';

@Entity('reservation_history')
export class ReservationHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    userName: string;

    @Column()
    concertId: number;

    @Column()
    concertName: string;

    @Column({ type: 'varchar' })
    actionLog: ReservationAction;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
