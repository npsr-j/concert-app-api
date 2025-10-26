
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concert_history')
export class ConcertHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    userName: string;

    @Column()
    concertId: number;

    @Column()
    name: string;

    @Column()
    actionLog: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
