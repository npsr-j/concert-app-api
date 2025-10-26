import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateReservationDto } from './dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers() {
        try {
            const result = await this.userService.getUsers();
            return { statusCode: HttpStatus.OK, data: result, message: 'Users retrieved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving users' };
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        try {
            const result = await this.userService.getUserById(id);
            return { statusCode: HttpStatus.OK, data: result, message: 'User retrieved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving user' };
        }
    }

    @Get(':userId/reservations')
    async getReservations(@Param('userId') userId: number) {
        try {
            const result = await this.userService.getReservations(userId);
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservations retrieved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving reservations' };
        }
    }

    @Post('reserve')
    async reserveSeat(@Body() createConcertDto: CreateReservationDto) {
        try {
            const result = await this.userService.addReservation(createConcertDto);
            return { statusCode: HttpStatus.OK, data: result, message: 'Seat reserved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error reserving seat' };
        }
    }

    @Put('cancel/:concertId')
    async cancelReservation(@Param('concertId') concertId: number) {
        try {
            const result = await this.userService.removeReservation(concertId);
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservation cancelled successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error cancelling reservation' };
        }
    }
}
