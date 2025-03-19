import { Validation } from "../../domain/metadata/validation";

export class ValidationMapper {
  static map(validation, each = false) {
    if (each) return validation.map(data => ValidationMapper.map(data))

    if (!validation) return;

    return {
      type: validation.type,
      required: validation.required
    }
  }

  static from(validation, each = false) {
    if (each) return validation.map(data => ValidationMapper.from(data))

    if (!validation) return;

    return new Validation(validation.type, validation.required)
  }
}