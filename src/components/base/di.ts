const providers = new Map<string, object>();

export function Injectable<T extends string>(
  name: `${Lowercase<T>}${string}`
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function(target: Function) {
    Reflect.defineProperty(target.prototype, "__diProviderName", {
      value: name,
      writable: true
    });
  };
}

export function Inject(target: any, key: any) {
  if (!Reflect.has(target, "__diRequiredProviders")) {
    Reflect.defineProperty(target, "__diRequiredProviders", {
      value: [],
      writable: true
    });
  }

  const requiredProviders = Reflect.get(
    target,
    "__diRequiredProviders"
  ) as string[];
  if (!requiredProviders.includes(key)) {
    requiredProviders.push(key);
  }

  const privateKey = `__${key}`;

  Reflect.defineProperty(target, key, {
    get() {
      if (this[privateKey]) return this[privateKey];

      const instance = providers.get(key);
      if (!instance) {
        throw new Error(`Nenhum provider registrado para "${key}"`);
      }

      this[privateKey] = instance;

      return instance;
    },
    set(value: any) {
      this[privateKey] = value;
    },
    enumerable: true,
    configurable: true
  });
}

export class Container {
  public static register<T extends object>(instance: T): T {
    const providerName = Reflect.get(instance, "__diProviderName") as string | undefined;
    if (!providerName)
      throw new Error(
        "Only injectable classes can be registered. Use @Injectable('...') decorator."
      );

    const alreadyExists = providers.get(providerName);
    if (alreadyExists)
      throw new Error(
        `Provider ${providerName} already registered. Remove the provider using Container.unregister("${providerName}") to avoid unexpected behaviour.`
      );

    providers.set(providerName, instance);

    return instance;
  }

  public static unregister(providerName: string) {
    return providers.delete(providerName);
  }

  public static resolve<T extends { new(...args: any[]): any }>(
    Target: T,
    ...args: ConstructorParameters<T>
  ): { using: (...providers: object[]) => InstanceType<T> } {
    function usingFn(...providers: any[]): InstanceType<T> {
      const target = new Target(...args);

      const diRequiredProviders = Reflect.get(
        target,
        "__diRequiredProviders"
      ) as string[] | undefined;

      if (!diRequiredProviders)
        throw new Error(
          `DI resolve "${target.name}" does not have any inject decorator to handle. Please, use a inject decorator with @Inject to use it.`
        );

      const providersNames = providers.map((provider) => {
        const isClass =
          typeof provider === "object" &&
          typeof provider?.constructor === "function";

        if (!isClass) {
          throw new Error(
            "DI invalid provider! Please, use a class to inject."
          );
        }

        const diProviderName = Reflect.get(provider, "__diProviderName") as
          | string
          | undefined;
        if (!diProviderName) {
          const className = provider.constructor?.name || "[Anonymous class]";
          throw new Error(
            `DI invalid provider! Please turn the provider injectable using @Injectable decorator. Class name: ${className}.`
          );
        }

        return diProviderName;
      });

      const unusedProviders = new Set(providersNames);
      const missingProviders = new Set(diRequiredProviders);

      for (const requiredProviderName of diRequiredProviders) {
        for (const receivedProviderInstance of providers) {
          const diProviderName = Reflect.get(
            receivedProviderInstance,
            "__diProviderName"
          ) as string;

          if (requiredProviderName !== diProviderName) continue;

          unusedProviders.delete(diProviderName);
          missingProviders.delete(requiredProviderName);

          Reflect.defineProperty(target, requiredProviderName, {
            writable: true,
            value: receivedProviderInstance
          });
        }
      }

      if (missingProviders.size > 0) {
        const formattedMissingProviders = [...missingProviders]
          .map((provider) => `"${provider}"`)
          .join(", ");
        throw new Error(`DI missing providers: ${formattedMissingProviders}.`);
      }

      if (unusedProviders.size > 0) {
        const formattedUnusedProviders = [...unusedProviders]
          .map((provider) => `"${provider}"`)
          .join(", ");
        throw new Error(`DI unused providers: ${formattedUnusedProviders}.`);
      }

      return target;
    }

    return {
      using: usingFn
    };
  }
}
