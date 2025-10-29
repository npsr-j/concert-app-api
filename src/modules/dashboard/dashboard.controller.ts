import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('summary')
    @ApiOperation({ summary: 'Get dashboard summary statistics' })
    @ApiResponse({ status: 200, description: 'Dashboard summary retrieved successfully' })
    async getSummary() {
        try {
            const result = await this.dashboardService.getSummary();
            return { statusCode: HttpStatus.OK, data: result, message: 'Dashboard summary retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }
}
