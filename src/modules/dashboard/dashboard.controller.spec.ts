import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { mockSummary } from './mock';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  const mockDashboardService = {
    getSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return dashboard summary successfully', async () => {
      mockDashboardService.getSummary.mockResolvedValue(mockSummary);

      const result = await controller.getSummary();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: mockSummary,
        message: 'Dashboard summary retrieved successfully',
      });
      expect(service.getSummary).toHaveBeenCalledTimes(1);
    });

    it('should return summary with zero values when no data exists', async () => {
      const emptySummary = {
        totalSeats: 0,
        totalReserved: 0,
        totalCancelled: 0,
      };
      mockDashboardService.getSummary.mockResolvedValue(emptySummary);

      const result = await controller.getSummary();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: emptySummary,
        message: 'Dashboard summary retrieved successfully',
      });
      expect(service.getSummary).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      mockDashboardService.getSummary.mockRejectedValue(error);

      await expect(controller.getSummary()).rejects.toThrow(error);
      expect(service.getSummary).toHaveBeenCalledTimes(1);
    });
  });
});
