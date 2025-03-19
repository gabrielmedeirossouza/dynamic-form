import { AssertionConcern } from "../../base/assertion-concern"

export class Validation {
  #type
  #required

  constructor(type, required) {
    this.#required = required
    this.#setType(type)
  }

  get type() {
    return this.#type
  }

  get required() {
    return this.#required
  }

  #setType(type) {
    AssertionConcern.assertArgumentOneOf('type', type, ["only-numbers", "only-letters", "cep", "cpf", "cnpj", "phone", "date", "email"])
    this.#type = type
  }
}