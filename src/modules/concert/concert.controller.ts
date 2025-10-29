import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto';

@ApiTags('concert')
@Controller('concert')
export class ConcertController {
    constructor(private readonly concertService: ConcertService) {}

    @Get()
    @ApiOperation({ summary: 'Get all concerts' })
    @ApiResponse({ status: 200, description: 'Concerts retrieved successfully' })
    async getConcerts() {
        try {
            const result = await this.concertService.getConcerts();
            return { statusCode: HttpStatus.OK, data: result, message: 'Concerts retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new concert' })
    @ApiResponse({ status: 201, description: 'Concert created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createConcert(@Body() createConcertDto: CreateConcertDto) {
        try {
            const result = await this.concertService.createConcert(createConcertDto);
            return { statusCode: HttpStatus.CREATED, data: result, message: 'Concert created successfully' };
        } catch (error) {
            throw error;
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a concert by ID' })
    @ApiParam({ name: 'id', description: 'Concert ID', type: Number })
    @ApiResponse({ status: 200, description: 'Concert deleted successfully' })
    @ApiResponse({ status: 404, description: 'Concert not found' })
    async deleteConcert(@Param('id') id: number) {
        try {
            await this.concertService.deleteConcert(id);
            return { statusCode: HttpStatus.OK, message: 'Concert deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}
