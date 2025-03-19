import { Size } from "../domain/form/size"

export class SizeMapper {
  static map(size, each = false) {
    if (each) return size.map(data => SizeMapper.map(data))

    return {
      type: size.type,
      value: size.value,
      min: size.min,
      isPercentage: size.isPercentage,
      isFixed: size.isFixed,
      staticValue: size.staticValue
    }
  }

  static from(size, each = false) {
    if (each) return size.map(data => SizeMapper.from(data))

    return new Size(size.type, size.value, size.min)
  }
}