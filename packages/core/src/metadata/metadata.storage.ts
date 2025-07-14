import type { MappingOptions } from '../types/mapping.type';

interface MapperMeta {
    methods: {
        [methodName: string]: MappingOptions[];
    };
}

class MetadataStorage {
    private mappers = new Map<Function, MapperMeta>();

    registerMapper(mapper: Function) {
        if (!this.mappers.has(mapper)) {
            this.mappers.set(mapper, { methods: {} });
        }
    }

    registerMapping(mapper: Function, method: string, option: MappingOptions) {
        if (!this.mappers.has(mapper)) this.registerMapper(mapper);
        const meta = this.mappers.get(mapper)!;
        if (!meta.methods[method]) meta.methods[method] = [];
        meta.methods[method].push(option);
    }

    getMappings(mapper: Function, method: string): MappingOptions[] {
        return this.mappers.get(mapper)?.methods[method] || [];
    }

    getAllMappers(): Function[] {
        return Array.from(this.mappers.keys());
    }
}

export const metadataStorage = new MetadataStorage();
