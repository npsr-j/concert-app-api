import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateReservationDto } from './dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Get('user/:userId')
    async getReservationsByUser(@Param('userId') userId: number) {
        try {
            const result = await this.reservationService.getReservationsByUser(userId);
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservations retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Post()
    async reserveSeat(@Body() createConcertDto: CreateReservationDto) {
        try {
            const result = await this.reservationService.addReservation(createConcertDto);
            return { statusCode: HttpStatus.OK, data: result, message: 'Seat reserved successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Delete(':userId/:concertId')
    async cancelReservation(@Param('userId') userId: number, @Param('concertId') concertId: number) {
        try {
            await this.reservationService.removeReservation(userId, concertId);
            return { statusCode: HttpStatus.OK, message: 'Reservation cancelled successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Get('history')
    async getReservationHistory() {
        try {
            const result = await this.reservationService.getReservationHistory();
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservation history retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }
}
