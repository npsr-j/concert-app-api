import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reservation')
export class ReservationEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    userId: number;

    @Column()
    concertId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}