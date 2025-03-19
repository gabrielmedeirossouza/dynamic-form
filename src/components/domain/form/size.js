import { AssertionConcern } from "../../base/assertion-concern"

export class Size {
  #type
  #value
  #min

  constructor(type, value, min) {
    this.#setType(type)
    this.#setValue(value)
    this.#setMin(min)
  }

  get type() {
    return this.#type
  }

  get value() {
    return this.#value
  }

  get min() {
    return this.#min
  }

  get isPercentage() {
    return this.#type === 'percentage'
  }

  get isFixed() {
    return this.#type === 'fixed'
  }

  get staticValue() {
    return this.isPercentage ? this.#min : this.#value
  }

  #setType(type) {
    AssertionConcern.assertArgumentOneOf("type", type, ["fixed", "percentage"])
    this.#type = type
  }

  #setValue(value) {
    if (this.isPercentage) {
      AssertionConcern.assertArgumentRange("value", value, 20, 100)
    } else {
      AssertionConcern.assertArgumentRange("value", value, 100, 320)
    }

    this.#value = value
  }

  #setMin(min) {
    if (min !== undefined && !this.isPercentage) {
      throw new Error('Only percentage sizes can have a min value.')
    }

    if (min === undefined && this.isPercentage) {
      throw new Error('Percentage sizes must have a min value.')
    }

    if (this.isPercentage) {
      AssertionConcern.assertArgumentRange("min", min, 100, 320)
    }

    this.#min = min
  }
}