import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity, UserEntity } from './entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReservationEntity, UserEntity])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
