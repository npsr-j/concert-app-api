import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities';
import { mockUser } from './mock';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  const mockUserRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.getUsers();

      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await service.getUsers();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database connection error');
      mockUserRepository.find.mockRejectedValue(error);

      await expect(service.getUsers()).rejects.toThrow(error);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should return null when user not found', async () => {
      const userId = 999;
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getUserById(userId);

      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should throw error when repository fails', async () => {
      const userId = 1;
      const error = new Error('Database connection error');
      mockUserRepository.findOneBy.mockRejectedValue(error);

      await expect(service.getUserById(userId)).rejects.toThrow(error);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });
});
