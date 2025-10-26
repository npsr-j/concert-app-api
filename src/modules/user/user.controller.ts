import { Controller, Get, HttpStatus, Param, Put } from '@nestjs/common';
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

    @Get('reservations/:userId')
    async getReservations(@Param('userId') userId: number) {
        try {
            const result = await this.userService.getReservations(userId);
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservations retrieved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving reservations' };
        }
    }

    @Put('reserve/:concertId')
    async reserveSeat(@Param('concertId') concertId: number) {
        try {
            const result = await this.userService.reserveSeat(concertId);
            return { statusCode: HttpStatus.OK, data: result, message: 'Seat reserved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error reserving seat' };
        }
    }

    @Put('cancel/:concertId')
    async cancelReservation(@Param('concertId') concertId: number) {
        try {
            const result = await this.userService.cancelReservation(concertId);
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservation cancelled successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error cancelling reservation' };
        }
    }
}
