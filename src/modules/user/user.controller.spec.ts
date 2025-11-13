import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from './mock';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users successfully', async () => {
      const users = [mockUser];
      mockUserService.getUsers.mockResolvedValue(users);

      const result = await controller.getUsers();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: users,
        message: 'Users retrieved successfully',
      });
      expect(service.getUsers).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockUserService.getUsers.mockResolvedValue([]);

      const result = await controller.getUsers();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: [],
        message: 'Users retrieved successfully',
      });
      expect(service.getUsers).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      mockUserService.getUsers.mockRejectedValue(error);

      await expect(controller.getUsers()).rejects.toThrow(error);
      expect(service.getUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id successfully', async () => {
      const userId = 1;
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: mockUser,
        message: 'User retrieved successfully',
      });
      expect(service.getUserById).toHaveBeenCalledTimes(1);
      expect(service.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      const userId = 999;
      mockUserService.getUserById.mockResolvedValue(null);

      const result = await controller.getUserById(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        data: null,
        message: 'User retrieved successfully',
      });
      expect(service.getUserById).toHaveBeenCalledTimes(1);
      expect(service.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw error when service fails', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockUserService.getUserById.mockRejectedValue(error);

      await expect(controller.getUserById(userId)).rejects.toThrow(error);
      expect(service.getUserById).toHaveBeenCalledTimes(1);
    });
  });
});
