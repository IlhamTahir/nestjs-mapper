import {ClassProvider, DynamicModule, Module, Provider} from '@nestjs/common';
import { metadataStorage } from '@ilhamtahir/ts-mapper';
import {Injectable} from "@nestjs/common/interfaces";

@Module({})
export class MapperModule {
    static forRoot(): DynamicModule {
        const mapperClasses = metadataStorage.getAllMappers() as Array<new (...args: any[]) => any>;

        const providers: Provider[] = mapperClasses.map((item) => ({
            provide: item,
            useClass: item,
        }));

        return {
            module: MapperModule,
            providers,
            exports: providers,
        };
    }
}
