import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-dto.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = { 
        name: 'John', 
        email: 'john@example.com', 
        password: 'securepassword123' 
      };
      const user = new User();
      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      expect(await service.create(createUserDto)).toBe(user);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [new User()];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const result = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOneByEmail('john@example.com')).toBe(result);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: CreateUserDto = { 
        name: 'John Doe', 
        email: 'john.doe@example.com', 
        password: 'newsecurepassword123' 
      };
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      await service.update(1, updateUserDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
