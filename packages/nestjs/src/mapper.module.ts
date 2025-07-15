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
}
