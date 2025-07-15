import type { MappingOptions } from '../types/mapping.type';

interface MapperMeta {
  methods: {
    [methodName: string]: MappingOptions[];
  };
}

class MetadataStorage {
  private mappers = new Map<any, MapperMeta>();

  registerMapper(mapper: any) {
    if (!this.mappers.has(mapper)) {
      this.mappers.set(mapper, { methods: {} });
    }
  }

  registerMapping(mapper: any, method: string, option: MappingOptions) {
    if (!this.mappers.has(mapper)) this.registerMapper(mapper);
    const meta = this.mappers.get(mapper)!;
    if (!meta.methods[method]) meta.methods[method] = [];
    meta.methods[method].push(option);
  }

  getMappings(mapper: any, method: string): MappingOptions[] {
    return this.mappers.get(mapper)?.methods[method] || [];
  }

  getAllMappers(): any[] {
    return Array.from(this.mappers.keys());
  }
}

export const metadataStorage = new MetadataStorage();
