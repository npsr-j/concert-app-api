import { Controller, Get, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('summary')
    async getSummary() {
        try {
            const result = await this.dashboardService.getSummary();
            return { statusCode: HttpStatus.OK, data: result, message: 'Dashboard summary retrieved successfully' };
        } catch (error) {
            throw error;
        }
    }
}
