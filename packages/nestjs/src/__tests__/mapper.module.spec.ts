import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { MapperModule } from '../mapper.module';
import { Mapper } from '../decorators/mapper.decorator';
import { transform } from '@ilhamtahir/ts-mapper';

// Test entities and DTOs
class TestEntity {
  id: number;
  name: string;

  constructor(data: Partial<TestEntity> = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
  }
}

class TestDto {
  id: number;
  name: string;

  constructor() {
    this.id = 0;
    this.name = '';
  }
}

@Mapper()
class TestMapper {
  toDto(entity: TestEntity): TestDto {
    return transform(this, 'toDto', entity, TestDto);
  }
}

@Injectable()
class TestService {
  constructor(private readonly testMapper: TestMapper) {}

  processEntity(entity: TestEntity): TestDto {
    return this.testMapper.toDto(entity);
  }
}

describe('MapperModule', () => {
  let module: TestingModule;
  let testService: TestService;
  let testMapper: TestMapper;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MapperModule.forRoot()],
      providers: [TestService],
    }).compile();

    testService = module.get<TestService>(TestService);
    testMapper = module.get<TestMapper>(TestMapper);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide mapper instances', () => {
    expect(testMapper).toBeDefined();
    expect(testMapper).toBeInstanceOf(TestMapper);
  });

  it('should inject mappers into services', () => {
    expect(testService).toBeDefined();

    const entity = new TestEntity({ id: 1, name: 'Test' });
    const dto = testService.processEntity(entity);

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('Test');
  });

  it('should work with forFeature', async () => {
    const featureModule = await Test.createTestingModule({
      imports: [MapperModule.forFeature([TestMapper])],
      providers: [TestService],
    }).compile();

    const featureTestService = featureModule.get<TestService>(TestService);
    const featureTestMapper = featureModule.get<TestMapper>(TestMapper);

    expect(featureTestService).toBeDefined();
    expect(featureTestMapper).toBeDefined();

    const entity = new TestEntity({ id: 2, name: 'Feature Test' });
    const dto = featureTestService.processEntity(entity);

    expect(dto.id).toBe(2);
    expect(dto.name).toBe('Feature Test');

    await featureModule.close();
  });
});
