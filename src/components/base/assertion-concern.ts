export class AssertionConcern {
  public static assertArgumentPositive(argumentName: string, argument: number) {
    if (argument <= 0) {
      throw new Error(`${argumentName} must be a positive number. Received ${argument}.`);
    }
  }

  public static assertArgumentOneOf<T, const K extends T[]>(argumentName: string, argument: T, validValues: K): asserts argument is K[number] {
    const argumentMessage = typeof argument === "string" ? argument : "[Non string type]";

    if (!validValues.includes(argument)) {
      throw new Error(`${argumentName} must be one of [${validValues.join(", ")}]. Received ${argumentMessage}.`);
    }
  }

  public static assertArgumentLength(argumentName: string, argument: string, minLength: number, maxLength: number) {
    if (argument.length < minLength || argument.length > maxLength) {
      throw new Error(`${argumentName} must have a length between ${minLength} and ${maxLength}. Received ${argument.length}.`);
    }
  }

  public static assertArgumentRange(argumentName: string, argument: number, min: number, max: number) {
    if (argument < min || argument > max) {
      throw new Error(`${argumentName} must be between ${min} and ${max}. Received ${argument}.`);
    }
  }
}
