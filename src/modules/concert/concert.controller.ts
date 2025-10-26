import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto, DeleteConcertDto } from './dto';

@Controller('concert')
export class ConcertController {
    constructor(private readonly concertService: ConcertService) {}

    @Get()
    async getConcerts() {
        try {
            const result = await this.concertService.getConcerts();
            return { statusCode: HttpStatus.OK, data: result, message: 'Concerts retrieved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving concerts' };
        }
    }

    @Post()
    async createConcert(@Body() createConcertDto: CreateConcertDto) {
        try {
            const result = await this.concertService.createConcert(createConcertDto);
            return { statusCode: HttpStatus.CREATED, data: result, message: 'Concert created successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creating concert' };
        }
    }

    @Delete(':id')
    async deleteConcert(@Param('id') id: number, @Body() deleteConcertDto: DeleteConcertDto) {
        try {
            const result = await this.concertService.deleteConcert(id, deleteConcertDto);
            return { statusCode: HttpStatus.OK, data: result, message: 'Concert deleted successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error deleting concert' };
        }
    }

    @Get('history')
    async getConcertHistory() {
        try {
            const result = await this.concertService.getConcertHistory();
            return { statusCode: HttpStatus.OK, data: result, message: 'Concert history retrieved successfully' };
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving concert history' };
        }
    }

}
