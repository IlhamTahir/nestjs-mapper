import 'reflect-metadata';
import { transform } from './transformer';

/**
 * Create Mapper proxy object, supporting auto transform and custom method preservation
 *
 * @param MapperClass Mapper class constructor (supports abstract class)
 * @returns Proxied Mapper instance
 */
export function createMapperProxy<T extends object>(MapperClass: new (...args: any[]) => T): T {
  // Create instance (even abstract class can be instantiated)
  const instance = new MapperClass();

  return new Proxy(instance, {
    get(target, propKey, receiver) {
      const original = Reflect.get(target, propKey, receiver);

      // Only handle function type properties
      if (typeof original === 'function') {
        return function (this: any, ...args: any[]) {
          // Check if it's an empty method body or abstract method
          const shouldAutoTransform = isEmptyOrAbstractMethod(
            original as (...args: any[]) => any,
            target,
            propKey
          );

          if (shouldAutoTransform) {
            // Automatically execute transform
            return executeAutoTransform(target, String(propKey), args[0]);
          } else {
            // Preserve original method logic
            return original.apply(this, args);
          }
        };
      }

      return original;
    },
  }) as T;
}

/**
 * Determine if method is empty implementation or abstract method
 */
function isEmptyOrAbstractMethod(
  method: (...args: any[]) => any,
  _target: any,
  _propKey: string | symbol
): boolean {
  try {
    // Get method source code
    const methodSource = method.toString();

    // Simplified detection logic: check if it only contains return {} or return {} as Type
    const isEmptyBody =
      // Only contains return {};
      /{\s*(?:\/\/[^\n]*\n\s*)*(?:\/\*[\s\S]*?\*\/\s*)*return\s*\{\s*\}\s*;\s*}/.test(
        methodSource
      ) ||
      // Only contains return {} as Type;
      /{\s*(?:\/\/[^\n]*\n\s*)*(?:\/\*[\s\S]*?\*\/\s*)*return\s*\{\s*\}\s*as\s+\w+\s*;\s*}/.test(
        methodSource
      ) ||
      // Completely empty method body
      /{\s*(?:\/\/[^\n]*\n\s*)*(?:\/\*[\s\S]*?\*\/\s*)*\s*}/.test(methodSource);

    return isEmptyBody;
  } catch (error) {
    // If unable to get method source code, default to not auto transform
    return false;
  }
}

/**
 * Execute auto transform
 */
function executeAutoTransform(target: any, methodName: string, input: any): any {
  try {
    // Get method return type
    const returnType = (Reflect as any).getMetadata('design:returntype', target, methodName);

    if (!returnType) {
      throw new Error(
        `Unable to get return type for method ${methodName}. Please ensure TypeScript's experimentalDecorators and emitDecoratorMetadata options are enabled.`
      );
    }

    // Call transform function
    return transform(target, methodName, input, returnType);
  } catch (error) {
    throw new Error(
      `Auto transform failed (method: ${methodName}): ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Check if class is abstract class
 * Note: This function is mainly used for debugging and logging, actual Proxy logic doesn't depend on this
 */
export function isAbstractClass(constructor: new (...args: any[]) => any): boolean {
  // Cannot directly detect abstract keyword at JavaScript runtime
  // But we can infer through other means, such as checking for unimplemented methods
  try {
    new constructor();
    return false; // If instantiation succeeds, it's not abstract or is an instantiable abstract
  } catch (error) {
    return true; // If instantiation fails, it might be an abstract class
  }
}
