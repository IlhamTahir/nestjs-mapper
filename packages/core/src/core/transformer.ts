import { metadataStorage } from '../metadata/metadata.storage';
import type { MappingOptions } from '../types/mapping.type';

// 支持嵌套路径读取
function getValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

// 支持嵌套路径赋值
function setValue(obj: any, path: string, value: any) {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => (acc[key] ??= {}), obj);
  target[lastKey] = value;
}

export function transform<TInput, TOutput>(
  mapper: any,
  method: string,
  input: TInput,
  outputType: new () => TOutput
): TOutput {
  const output = new outputType();
  const mappings: MappingOptions[] = metadataStorage.getMappings(mapper.constructor, method);

  const usedTargetKeys = new Set<string>();

  // 1️⃣ 显式字段映射
  for (const mapping of mappings) {
    const value = getValue(input, mapping.source);
    setValue(output, mapping.target, value);
    usedTargetKeys.add(mapping.target);
  }

  // 2️⃣ 自动字段匹配（字段名一致 + typeof 一致）
  const inputKeys = Object.keys(input || {});
  const outputKeys = new Set([
    ...Object.getOwnPropertyNames(output),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(output)),
  ]);

  for (const key of inputKeys) {
    if (outputKeys.has(key) && !usedTargetKeys.has(key)) {
      const inputValue = (input as any)[key];
      const outputValue = (output as any)[key];

      const inputType = typeof inputValue;
      const outputTypeGuess = typeof outputValue;

      // 若输出初始值是 undefined，则只检查 input 是否为 object、number、string 等合理值
      if (outputValue === undefined || inputType === outputTypeGuess) {
        (output as any)[key] = inputValue;
      }
    }
  }

  return output;
}
