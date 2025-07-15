import { Injectable } from '@nestjs/common';
import { metadataStorage } from '@ilhamtahir/ts-mapper';

export function Mapper() {
  return (target: any) => {
    Injectable()(target); // 标记为可注入
    metadataStorage.registerMapper(target);
  };
}
