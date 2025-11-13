import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto';
import { mockConcert } from './mock';

describe('ConcertController', () => {
  let controller: ConcertController;
  let service: ConcertService;

  const mockConcertService = {
    getConcerts: jest.fn(),
    createConcert: jest.fn(),
    deleteConcert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [
        {
          provide: ConcertService,
          useValue: mockConcertService,
        },
      ],
    }).compile();

    controller = module.get<ConcertController>(ConcertController);
    service = module.get<ConcertService>(ConcertService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConcerts', () => {
    it('should return all concerts successfully', async () => {
      const concerts = [mockConcert];
      mockConcertService.getConcerts.mockResolvedValue(concerts);

      const result = await controller.getConcerts();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: concerts,
        message: 'Concerts retrieved successfully',
      });
      expect(service.getConcerts).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no concerts exist', async () => {
      mockConcertService.getConcerts.mockResolvedValue([]);

      const result = await controller.getConcerts();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: [],
        message: 'Concerts retrieved successfully',
      });
      expect(service.getConcerts).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      mockConcertService.getConcerts.mockRejectedValue(error);

      await expect(controller.getConcerts()).rejects.toThrow(error);
      expect(service.getConcerts).toHaveBeenCalledTimes(1);
    });
  });

  describe('createConcert', () => {
    const createConcertDto: CreateConcertDto = {
      name: 'Summer Music Festival 2025',
      description: 'An amazing outdoor music festival',
      totalSeat: 5000,
    };

    it('should create a concert successfully', async () => {
      mockConcertService.createConcert.mockResolvedValue(mockConcert);

      const result = await controller.createConcert(createConcertDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        data: mockConcert,
        message: 'Concert created successfully',
      });
      expect(service.createConcert).toHaveBeenCalledTimes(1);
      expect(service.createConcert).toHaveBeenCalledWith(createConcertDto);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      mockConcertService.createConcert.mockRejectedValue(error);

      await expect(controller.createConcert(createConcertDto)).rejects.toThrow(error);
      expect(service.createConcert).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteConcert', () => {
    it('should delete a concert successfully', async () => {
      const concertId = 1;
      mockConcertService.deleteConcert.mockResolvedValue(undefined);

      const result = await controller.deleteConcert(concertId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Concert deleted successfully',
      });
      expect(service.deleteConcert).toHaveBeenCalledTimes(1);
      expect(service.deleteConcert).toHaveBeenCalledWith(concertId);
    });

    it('should throw error when concert not found', async () => {
      const concertId = 999;
      const error = new Error('Concert not found');
      mockConcertService.deleteConcert.mockRejectedValue(error);

      await expect(controller.deleteConcert(concertId)).rejects.toThrow(error);
      expect(service.deleteConcert).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const concertId = 1;
      const error = new Error('Database error');
      mockConcertService.deleteConcert.mockRejectedValue(error);

      await expect(controller.deleteConcert(concertId)).rejects.toThrow(error);
      expect(service.deleteConcert).toHaveBeenCalledTimes(1);
    });
  });
});
