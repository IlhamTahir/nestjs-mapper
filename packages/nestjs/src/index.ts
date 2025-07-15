// Re-export core functionality from @ilhamtahir/ts-mapper
export { Mapping, transform, metadataStorage } from '@ilhamtahir/ts-mapper';
export type { MappingOptions } from '@ilhamtahir/ts-mapper';

// Export NestJS-specific functionality
export { Mapper } from './decorators/mapper.decorator';
export { MapperModule } from './mapper.module';
