import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateReservationDto } from './dto';
import { ReservationService } from './reservation.service';

@ApiTags('reservation')
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all reservations for a specific user' })
    @ApiParam({ name: 'userId', description: 'User ID', type: Number })
    @ApiResponse({ status: 200, description: 'Reservations retrieved successfully' })
    async getReservationsByUser(@Param('userId') userId: number) {
        try {
            const result = await this.reservationService.getReservationsByUser(userId);
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservations retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Post()
    @ApiOperation({ summary: 'Reserve a seat for a concert' })
    @ApiResponse({ status: 200, description: 'Seat reserved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async reserveSeat(@Body() createConcertDto: CreateReservationDto) {
        try {
            const result = await this.reservationService.addReservation(createConcertDto);
            return { statusCode: HttpStatus.OK, data: result, message: 'Seat reserved successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Delete(':userId/:concertId')
    @ApiOperation({ summary: 'Cancel a reservation' })
    @ApiParam({ name: 'userId', description: 'User ID', type: Number })
    @ApiParam({ name: 'concertId', description: 'Concert ID', type: Number })
    @ApiResponse({ status: 200, description: 'Reservation cancelled successfully' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    async cancelReservation(@Param('userId') userId: number, @Param('concertId') concertId: number) {
        try {
            await this.reservationService.removeReservation(userId, concertId);
            return { statusCode: HttpStatus.OK, message: 'Reservation cancelled successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Get('history')
    @ApiOperation({ summary: 'Get all reservation history' })
    @ApiResponse({ status: 200, description: 'Reservation history retrieved successfully' })
    async getReservationHistory() {
        try {
            const result = await this.reservationService.getReservationHistory();
            return { statusCode: HttpStatus.OK, data: result, message: 'Reservation history retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }
}
