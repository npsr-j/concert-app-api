import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateReservationDto } from './dto';
import { mockReservation, mockReservationHistory } from './mock';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationService = {
    getReservationsByUser: jest.fn(),
    addReservation: jest.fn(),
    removeReservation: jest.fn(),
    getReservationHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReservationsByUser', () => {
    it('should return user reservations successfully', async () => {
      const userId = 1;
      const reservations = [mockReservation];
      mockReservationService.getReservationsByUser.mockResolvedValue(reservations);

      const result = await controller.getReservationsByUser(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: reservations,
        message: 'Reservations retrieved successfully',
      });
      expect(service.getReservationsByUser).toHaveBeenCalledTimes(1);
      expect(service.getReservationsByUser).toHaveBeenCalledWith(userId);
    });

    it('should return empty array when user has no reservations', async () => {
      const userId = 1;
      mockReservationService.getReservationsByUser.mockResolvedValue([]);

      const result = await controller.getReservationsByUser(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: [],
        message: 'Reservations retrieved successfully',
      });
      expect(service.getReservationsByUser).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReservationService.getReservationsByUser.mockRejectedValue(error);

      await expect(controller.getReservationsByUser(userId)).rejects.toThrow(error);
      expect(service.getReservationsByUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('reserveSeat', () => {
    const createReservationDto: CreateReservationDto = {
      userId: 1,
      concertId: 1,
    };

    it('should reserve a seat successfully', async () => {
      mockReservationService.addReservation.mockResolvedValue(mockReservation);

      const result = await controller.reserveSeat(createReservationDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: mockReservation,
        message: 'Seat reserved successfully',
      });
      expect(service.addReservation).toHaveBeenCalledTimes(1);
      expect(service.addReservation).toHaveBeenCalledWith(createReservationDto);
    });

    it('should throw error when reservation already exists', async () => {
      const error = new Error('Reservation already exists');
      mockReservationService.addReservation.mockRejectedValue(error);

      await expect(controller.reserveSeat(createReservationDto)).rejects.toThrow(error);
      expect(service.addReservation).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      mockReservationService.addReservation.mockRejectedValue(error);

      await expect(controller.reserveSeat(createReservationDto)).rejects.toThrow(error);
      expect(service.addReservation).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation successfully', async () => {
      const userId = 1;
      const concertId = 1;
      mockReservationService.removeReservation.mockResolvedValue({ affected: 1 });

      const result = await controller.cancelReservation(userId, concertId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Reservation cancelled successfully',
      });
      expect(service.removeReservation).toHaveBeenCalledTimes(1);
      expect(service.removeReservation).toHaveBeenCalledWith(userId, concertId);
    });

    it('should throw error when reservation not found', async () => {
      const userId = 1;
      const concertId = 999;
      const error = new Error('Reservation not found');
      mockReservationService.removeReservation.mockRejectedValue(error);

      await expect(controller.cancelReservation(userId, concertId)).rejects.toThrow(error);
      expect(service.removeReservation).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const userId = 1;
      const concertId = 1;
      const error = new Error('Database error');
      mockReservationService.removeReservation.mockRejectedValue(error);

      await expect(controller.cancelReservation(userId, concertId)).rejects.toThrow(error);
      expect(service.removeReservation).toHaveBeenCalledTimes(1);
    });
  });

  describe('getReservationHistory', () => {
    it('should return reservation history successfully', async () => {
      const history = [mockReservationHistory];
      mockReservationService.getReservationHistory.mockResolvedValue(history);

      const result = await controller.getReservationHistory();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: history,
        message: 'Reservation history retrieved successfully',
      });
      expect(service.getReservationHistory).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no history exists', async () => {
      mockReservationService.getReservationHistory.mockResolvedValue([]);

      const result = await controller.getReservationHistory();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: [],
        message: 'Reservation history retrieved successfully',
      });
      expect(service.getReservationHistory).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      mockReservationService.getReservationHistory.mockRejectedValue(error);

      await expect(controller.getReservationHistory()).rejects.toThrow(error);
      expect(service.getReservationHistory).toHaveBeenCalledTimes(1);
    });
  });
});
