import { metadataStorage } from '../metadata/metadata.storage';

export function Mapper() {
  return (target: any) => {
    metadataStorage.registerMapper(target);
  };
}
