import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertEntity } from '../concert/entities';
import { ReservationHistoryEntity } from '../reservation/entities';
import { ReservationAction } from '../reservation/enums';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let concertRepository: Repository<ConcertEntity>;
  let reservationHistoryRepository: Repository<ReservationHistoryEntity>;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockConcertRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockReservationHistoryRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(ConcertEntity),
          useValue: mockConcertRepository,
        },
        {
          provide: getRepositoryToken(ReservationHistoryEntity),
          useValue: mockReservationHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    concertRepository = module.get<Repository<ConcertEntity>>(
      getRepositoryToken(ConcertEntity),
    );
    reservationHistoryRepository = module.get<Repository<ReservationHistoryEntity>>(
      getRepositoryToken(ReservationHistoryEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return complete dashboard summary', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSeat: 10000 });
      mockReservationHistoryRepository.count
        .mockResolvedValueOnce(150) // totalReserved
        .mockResolvedValueOnce(25); // totalCancelled

      const result = await service.getSummary();

      expect(result).toEqual({
        totalSeats: 10000,
        totalReserved: 150,
        totalCancelled: 25,
      });
    });

    it('should return summary with zero values when no data exists', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSeat: null });
      mockReservationHistoryRepository.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getSummary();

      expect(result).toEqual({
        totalSeats: 0,
        totalReserved: 0,
        totalCancelled: 0,
      });
    });
  });

  describe('getTotalSeats', () => {
    it('should return total seats from all concerts', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSeat: 15000 });

      const result = await service.getTotalSeats();

      expect(result).toBe(15000);
      expect(mockConcertRepository.createQueryBuilder).toHaveBeenCalledWith('concert');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('SUM(concert.totalSeat)', 'totalSeat');
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);
    });

    it('should return 0 when no concerts exist', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSeat: null });

      const result = await service.getTotalSeats();

      expect(result).toBe(0);
    });

    it('should return 0 when query returns undefined', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue(undefined);

      const result = await service.getTotalSeats();

      expect(result).toBe(0);
    });
  });

  describe('getTotalReserved', () => {
    it('should return count of reserved reservations', async () => {
      mockReservationHistoryRepository.count.mockResolvedValue(200);

      const result = await service.getTotalReserved();

      expect(result).toBe(200);
      expect(reservationHistoryRepository.count).toHaveBeenCalledWith({
        where: {
          actionLog: ReservationAction.RESERVED,
        },
      });
    });

    it('should return 0 when no reservations exist', async () => {
      mockReservationHistoryRepository.count.mockResolvedValue(0);

      const result = await service.getTotalReserved();

      expect(result).toBe(0);
    });
  });

  describe('getTotalCancelled', () => {
    it('should return count of cancelled reservations', async () => {
      mockReservationHistoryRepository.count.mockResolvedValue(50);

      const result = await service.getTotalCancelled();

      expect(result).toBe(50);
      expect(reservationHistoryRepository.count).toHaveBeenCalledWith({
        where: {
          actionLog: ReservationAction.CANCELLED,
        },
      });
    });

    it('should return 0 when no cancellations exist', async () => {
      mockReservationHistoryRepository.count.mockResolvedValue(0);

      const result = await service.getTotalCancelled();

      expect(result).toBe(0);
    });
  });
});
