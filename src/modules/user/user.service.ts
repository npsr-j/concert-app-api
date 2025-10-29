import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    getUsers() {
        return this.usersRepository.find();
    }

    getUserById(id: number) {
        return this.usersRepository.findOneBy({ id });
    }
}
