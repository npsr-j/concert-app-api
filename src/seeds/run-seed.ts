import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';

async function runSeed() {
  console.log('🌱 Starting database seeding...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const userRepository = dataSource.getRepository(UserEntity);

    // Check if users already exist
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('⚠️  Users already exist. Skipping user seeding.');
    } else {
      // Seed users
      const users = [
        {
          id: 1,
          name: 'Admin',
          role: 'admin',
        },
        {
          id: 2,
          name: 'User',
          role: 'user',
        },
      ];

      await userRepository.save(users);
      console.log('✅ Successfully seeded 2 users:');
      console.log('   - Admin (role: admin)');
      console.log('   - User (role: user)');
    }
    
    console.log('\n✅ Database seeding completed successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeed();
