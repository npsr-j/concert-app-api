import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    async getUsers() {
        try {
            const result = await this.userService.getUsers();
            return { statusCode: HttpStatus.OK, data: result, message: 'Users retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', description: 'User ID', type: Number })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id') id: number) {
        try {
            const result = await this.userService.getUserById(id);
            return { statusCode: HttpStatus.OK, data: result, message: 'User retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }
}
