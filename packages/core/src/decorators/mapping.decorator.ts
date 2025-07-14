import 'reflect-metadata';
import { metadataStorage } from '../metadata/metadata.storage';
import type { MappingOptions } from '../types/mapping.type';

export function Mapping(options: MappingOptions): MethodDecorator {
    return (target, propertyKey) => {
        metadataStorage.registerMapping(target.constructor, propertyKey as string, options);
    };
}
