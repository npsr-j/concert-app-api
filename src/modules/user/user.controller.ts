import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers() {
        try {
            const result = await this.userService.getUsers();
            return { statusCode: HttpStatus.OK, data: result, message: 'Users retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        try {
            const result = await this.userService.getUserById(id);
            return { statusCode: HttpStatus.OK, data: result, message: 'User retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }
}
