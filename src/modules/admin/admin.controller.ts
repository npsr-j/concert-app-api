import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateConcertDto } from './dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('concert')
    async createConcert(@Body() createConcertDto: CreateConcertDto) {
        const result = await this.adminService.createConcert(createConcertDto);
        return { statusCode: HttpStatus.CREATED, data: result, message: 'Concert created successfully' };
    }

    @Delete('concert/:id')
    async deleteConcert(@Param('id') id: number) {
        const result = await this.adminService.deleteConcert(id);
        return { statusCode: HttpStatus.OK, data: result, message: 'Concert deleted successfully' };
    }

    @Get('concert/history')
    async getConcertHistory() {
        const result = await this.adminService.getConcertHistory();
        return { statusCode: HttpStatus.OK, data: result, message: 'Concert history retrieved successfully' };
    }

}
