import { Injectable } from '@nestjs/common';
import { metadataStorage } from '@ilhamtahir/ts-mapper';

export function Mapper(): ClassDecorator {
    return (target) => {
        Injectable()(target); // 标记为可注入
        metadataStorage.registerMapper(target);
    };
}
