import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto';
import { ConcertEntity } from './entities';
import { mockConcert } from './mock';

describe('ConcertService', () => {
  let service: ConcertService;
  let repository: Repository<ConcertEntity>;

  const mockConcertRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: getRepositoryToken(ConcertEntity),
          useValue: mockConcertRepository,
        },
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
    repository = module.get<Repository<ConcertEntity>>(
      getRepositoryToken(ConcertEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConcerts', () => {
    it('should return an array of concerts', async () => {
      const concerts = [mockConcert];
      mockConcertRepository.find.mockResolvedValue(concerts);

      const result = await service.getConcerts();

      expect(result).toEqual(concerts);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no concerts exist', async () => {
      mockConcertRepository.find.mockResolvedValue([]);

      const result = await service.getConcerts();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database connection error');
      mockConcertRepository.find.mockRejectedValue(error);

      await expect(service.getConcerts()).rejects.toThrow(error);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('createConcert', () => {
    const createConcertDto: CreateConcertDto = {
      name: 'Summer Music Festival 2025',
      description: 'An amazing outdoor music festival',
      totalSeat: 5000,
    };

    it('should create and return a new concert', async () => {
      mockConcertRepository.create.mockReturnValue(mockConcert);
      mockConcertRepository.save.mockResolvedValue(mockConcert);

      const result = await service.createConcert(createConcertDto);

      expect(result).toEqual(mockConcert);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(createConcertDto);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(mockConcert);
    });

    it('should throw error when save fails', async () => {
      const error = new Error('Database save error');
      mockConcertRepository.create.mockReturnValue(mockConcert);
      mockConcertRepository.save.mockRejectedValue(error);

      await expect(service.createConcert(createConcertDto)).rejects.toThrow(error);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteConcert', () => {
    it('should delete a concert successfully', async () => {
      const concertId = 1;
      mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
      mockConcertRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.deleteConcert(concertId);

      expect(result).toEqual({ affected: 1, raw: {} });
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: concertId });
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(concertId);
    });

    it('should throw NotFoundException when concert does not exist', async () => {
      const concertId = 999;
      mockConcertRepository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteConcert(concertId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteConcert(concertId)).rejects.toThrow(
        'Concert not found',
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: concertId });
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw error when delete fails', async () => {
      const concertId = 1;
      const error = new Error('Database delete error');
      mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
      mockConcertRepository.delete.mockRejectedValue(error);

      await expect(service.deleteConcert(concertId)).rejects.toThrow(error);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
