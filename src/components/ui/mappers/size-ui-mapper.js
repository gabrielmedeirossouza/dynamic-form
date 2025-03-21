export class SizeUiMapper {
  static map(size, each = false) {
    if (each) return size.map(data => SizeUiMapper.map(data))

    return {
      type: size.type,
      value: size.value,
      min: size.min,
      isPercentage: size.isPercentage,
      isFixed: size.isFixed,
      staticValue: size.staticValue
    }
  }
}