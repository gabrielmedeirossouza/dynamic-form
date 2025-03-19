export class ValidationUiMapper {
  static map(validation, each = false) {
    if (each) return validation.map(data => ValidationUiMapper.map(data))

    if (!validation) return;

    return {
      type: validation.type,
      required: validation.required
    }
  }
}