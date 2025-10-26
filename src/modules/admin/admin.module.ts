import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ConcertEntity, ConcertHistoryEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([ConcertEntity, ConcertHistoryEntity])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
