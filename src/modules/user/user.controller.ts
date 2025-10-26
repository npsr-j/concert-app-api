import { Controller, Get, HttpStatus, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('concerts')
    async getConcerts() {
        const result = await this.userService.getConcerts();
        return { statusCode: HttpStatus.OK, data: result, message: 'Concerts retrieved successfully' };
    }

    @Get('reservations/:userId')
    async getReservations(@Param('userId') userId: number) {
        const result = await this.userService.getReservations(userId);
        return { statusCode: HttpStatus.OK, data: result, message: 'Reservations retrieved successfully' };
    }

    @Put('reserve/:concertId')
    async reserveSeat(@Param('concertId') concertId: number) {
        const result = await this.userService.reserveSeat(concertId);
        return { statusCode: HttpStatus.OK, data: result, message: 'Seat reserved successfully' };
    }

    @Put('cancel/:concertId')
    async cancelReservation(@Param('concertId') concertId: number) {
        const result = await this.userService.cancelReservation(concertId);
        return { statusCode: HttpStatus.OK, data: result, message: 'Reservation cancelled successfully' };
    }
}
