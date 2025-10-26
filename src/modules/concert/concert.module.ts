import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';
import { ConcertEntity, ConcertHistoryEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([ConcertEntity, ConcertHistoryEntity])],
    controllers: [ConcertController],
    providers: [ConcertService],
})
export class ConcertModule {}
