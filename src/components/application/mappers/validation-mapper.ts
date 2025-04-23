import { Validation } from "../../domain/metadata/validation";

export class ValidationMapper {
  public static map(validation?: Validation) {
    if (!validation) return;

    return {
      type: validation.type,
      required: validation.required
    };
  }
}
