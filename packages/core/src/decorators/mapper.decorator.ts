import { metadataStorage } from '../metadata/metadata.storage';

export function Mapper(): ClassDecorator {
    return (target: Function) => {
        metadataStorage.registerMapper(target);
    };
}
