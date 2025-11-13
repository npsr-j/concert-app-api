import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertEntity } from '../concert/entities';
import { mockConcert } from '../concert/mock';
import { UserEntity } from '../user/entities';
import { mockUser } from '../user/mock';
import { CreateReservationDto } from './dto';
import { ReservationEntity, ReservationHistoryEntity } from './entities';
import { ReservationAction } from './enums';
import { mockReservation, mockReservationHistory } from './mock';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: Repository<ReservationEntity>;
  let reservationHistoryRepository: Repository<ReservationHistoryEntity>;
  let userRepository: Repository<UserEntity>;
  let concertRepository: Repository<ConcertEntity>;

  const mockReservationRepository = {
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockReservationHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockConcertRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(ReservationHistoryEntity),
          useValue: mockReservationHistoryRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(ConcertEntity),
          useValue: mockConcertRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<Repository<ReservationEntity>>(
      getRepositoryToken(ReservationEntity),
    );
    reservationHistoryRepository = module.get<Repository<ReservationHistoryEntity>>(
      getRepositoryToken(ReservationHistoryEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    concertRepository = module.get<Repository<ConcertEntity>>(
      getRepositoryToken(ConcertEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReservationsByUser', () => {
    it('should return user reservations', async () => {
      const userId = 1;
      const reservations = [mockReservation];
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockReservationRepository.findBy.mockResolvedValue(reservations);

      const result = await service.getReservationsByUser(userId);

      expect(result).toEqual(reservations);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(reservationRepository.findBy).toHaveBeenCalledWith({ userId });
    });

    it('should return empty array when user has no reservations', async () => {
      const userId = 1;
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockReservationRepository.findBy.mockResolvedValue(null);

      const result = await service.getReservationsByUser(userId);

      expect(result).toEqual([]);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getReservationsByUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getReservationsByUser(userId)).rejects.toThrow(
        'User not found',
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('addReservation', () => {
    const createReservationDto: CreateReservationDto = {
      userId: 1,
      concertId: 1,
    };

    it('should create a reservation successfully', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
      mockReservationRepository.findOneBy.mockResolvedValue(null);
      mockReservationRepository.create.mockReturnValue(mockReservation);
      mockReservationRepository.save.mockResolvedValue(mockReservation);
      mockReservationHistoryRepository.create.mockReturnValue(mockReservationHistory);
      mockReservationHistoryRepository.save.mockResolvedValue(mockReservationHistory);

      const result = await service.addReservation(createReservationDto);

      expect(result).toEqual(mockReservation);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: createReservationDto.userId });
      expect(concertRepository.findOneBy).toHaveBeenCalledWith({ id: createReservationDto.concertId });
      expect(reservationRepository.findOneBy).toHaveBeenCalledWith({
        userId: createReservationDto.userId,
        concertId: createReservationDto.concertId,
      });
      expect(reservationRepository.create).toHaveBeenCalledWith(createReservationDto);
      expect(reservationRepository.save).toHaveBeenCalledWith(mockReservation);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.addReservation(createReservationDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.addReservation(createReservationDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw NotFoundException when concert not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockConcertRepository.findOneBy.mockResolvedValue(null);

      await expect(service.addReservation(createReservationDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.addReservation(createReservationDto)).rejects.toThrow(
        'Concert not found',
      );
    });

    it('should throw ConflictException when reservation already exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
      mockReservationRepository.findOneBy.mockResolvedValue(mockReservation);

      await expect(service.addReservation(createReservationDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.addReservation(createReservationDto)).rejects.toThrow(
        'Reservation already exists for this user and concert',
      );
    });
  });

  describe('removeReservation', () => {
    it('should remove a reservation successfully', async () => {
      const userId = 1;
      const concertId = 1;
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
      mockReservationHistoryRepository.create.mockReturnValue(mockReservationHistory);
      mockReservationHistoryRepository.save.mockResolvedValue(mockReservationHistory);
      mockReservationRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.removeReservation(userId, concertId);

      expect(result).toEqual({ affected: 1 });
      expect(reservationRepository.delete).toHaveBeenCalledWith({ userId, concertId });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      const concertId = 1;
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.removeReservation(userId, concertId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getReservationHistory', () => {
    it('should return reservation history', async () => {
      const history = [mockReservationHistory];
      mockReservationHistoryRepository.find.mockResolvedValue(history);

      const result = await service.getReservationHistory();

      expect(result).toEqual(history);
      expect(reservationHistoryRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no history exists', async () => {
      mockReservationHistoryRepository.find.mockResolvedValue([]);

      const result = await service.getReservationHistory();

      expect(result).toEqual([]);
      expect(reservationHistoryRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('createReservationHistoryLog', () => {
    it('should create a reservation history log', async () => {
      const userId = 1;
      const concertId = 1;
      const action = ReservationAction.RESERVED;
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
      mockReservationHistoryRepository.create.mockReturnValue(mockReservationHistory);
      mockReservationHistoryRepository.save.mockResolvedValue(mockReservationHistory);

      const result = await service.createReservationHistoryLog(userId, concertId, action);

      expect(result).toEqual(mockReservationHistory);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(concertRepository.findOneBy).toHaveBeenCalledWith({ id: concertId });
      expect(reservationHistoryRepository.save).toHaveBeenCalledWith(mockReservationHistory);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      const concertId = 1;
      const action = ReservationAction.RESERVED;
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.createReservationHistoryLog(userId, concertId, action),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when concert not found', async () => {
      const userId = 1;
      const concertId = 999;
      const action = ReservationAction.RESERVED;
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockConcertRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.createReservationHistoryLog(userId, concertId, action),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
