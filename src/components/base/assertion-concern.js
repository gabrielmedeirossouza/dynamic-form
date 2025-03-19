export class AssertionConcern {
  static assertArgumentInstanceOf(argumentName, argument, expectedInstance, optional = false) {
    if (!(argument instanceof expectedInstance) && !optional) {
      throw new Error(`${argumentName} must be an instance of ${expectedInstance.name}. Received ${argument.constructor.name}.`);
    }

    if (optional && argument !== undefined && !(argument instanceof expectedInstance)) {
      throw new Error(`${argumentName} must be an instance of ${expectedInstance.name} or undefined. Received ${argument.constructor.name}.`);
    }
  }

  static assertArgumentBoolean(argumentName, argument, optional = false) {
    if (typeof argument !== 'boolean' && !optional) {
      throw new Error(`${argumentName} must be a boolean. Received ${argument}.`);
    }

    if (optional && argument !== undefined && typeof argument !== 'boolean') {
      throw new Error(`${argumentName} must be a boolean or undefined. Received ${argument}.`);
    }
  }

  static assertArgumentString(argumentName, argument, optional = false) {
    if (typeof argument !== 'string' && !optional) {
      throw new Error(`${argumentName} must be a string. Received ${argument}.`);
    }

    if (optional && argument !== undefined && typeof argument !== 'string') {
      throw new Error(`${argumentName} must be a string or undefined. Received ${argument}.`);
    }
  }

  static assertArgumentNumber(argumentName, argument, optional = false) {
    if (typeof argument !== 'number' && !optional) {
      throw new Error(`${argumentName} must be a number. Received ${argument}.`);
    }

    if (optional && argument !== undefined && typeof argument !== 'number') {
      throw new Error(`${argumentName} must be a number or undefined. Received ${argument}.`);
    }
  }

  static assertArgumentArray(argumentName, argument, optional = false) {
    if (!Array.isArray(argument) && !optional) {
      throw new Error(`${argumentName} must be an array. Received ${argument}.`);
    }

    if (optional && argument !== undefined && !Array.isArray(argument)) {
      throw new Error(`${argumentName} must be an array or undefined. Received ${argument}.`);
    }
  }

  static assertArgumentPositive(argumentName, argument) {
    this.assertArgumentNumber(argumentName, argument);

    if (argument <= 0) {
      throw new Error(`${argumentName} must be a positive number. Received ${argument}.`);
    }
  }

  static assertArgumentOneOf(argumentName, argument, validValues) {
    if (!validValues.includes(argument)) {
      throw new Error(`${argumentName} must be one of [${validValues.join(', ')}]. Received ${argument}.`);
    }
  }

  static assertArgumentLength(argumentName, argument, minLength, maxLength) {
    this.assertArgumentString(argumentName, argument);

    if (argument.length < minLength || argument.length > maxLength) {
      throw new Error(`${argumentName} must have a length between ${minLength} and ${maxLength}. Received ${argument.length}.`);
    }
  }

  static assertArgumentRange(argumentName, argument, min, max) {
    AssertionConcern.assertArgumentNumber(argumentName, argument);

    if (argument < min || argument > max) {
      throw new Error(`${argumentName} must be between ${min} and ${max}. Received ${argument}.`);
    }
  }
}