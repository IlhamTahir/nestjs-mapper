import { DynamicModule, Module, Provider } from '@nestjs/common';
import { metadataStorage, createMapperProxy } from '@ilhamtahir/ts-mapper';

@Module({})
export class MapperModule {
  static forRoot(): DynamicModule {
    const mapperClasses = metadataStorage.getAllMappers() as Array<new (...args: any[]) => any>;

    const providers: Provider[] = mapperClasses.map(MapperClass => ({
      provide: MapperClass,
      useFactory: () => createMapperProxy(MapperClass),
    }));

    return {
      module: MapperModule,
      providers,
      exports: providers,
    };
  }

  static forFeature(mappers: Array<new (...args: any[]) => any>): DynamicModule {
    const providers: Provider[] = mappers.map(MapperClass => ({
      provide: MapperClass,
      useFactory: () => createMapperProxy(MapperClass),
    }));

    return {
      module: MapperModule,
      providers,
      exports: providers,
    };
  }
}
