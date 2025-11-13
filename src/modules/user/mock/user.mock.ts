import { UserEntity } from '../entities';

export const mockUser: UserEntity = {
    id: 1,
    name: 'John Doe',
    role: 'user',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};
