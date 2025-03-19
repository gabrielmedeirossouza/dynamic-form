import { AssertionConcern } from "../../base/assertion-concern"

export class Metadata {
  #id
  #label
  #slug
  #type
  #showOnPortal
  #sensitiveData
  #active
  #validation
  #presentation

  constructor({ id, label, slug, type, showOnPortal, sensitiveData, active, validation, presentation }) {
    this.#id = id
    this.#slug = slug
    this.#showOnPortal = showOnPortal
    this.#sensitiveData = sensitiveData
    this.#active = active
    this.#validation = validation
    this.#presentation = presentation

    this.#setLabel(label)
    this.#setType(type)
  }

  get id() {
    return this.#id
  }

  get label() {
    return this.#label
  }

  get slug() {
    return this.#slug
  }

  get type() {
    return this.#type
  }

  get showOnPortal() {
    return this.#showOnPortal
  }

  get sensitiveData() {
    return this.#sensitiveData
  }

  get active() {
    return this.#active
  }

  get validation() {
    return this.#validation
  }

  get presentation() {
    return this.#presentation
  }

  #setLabel(label) {
    AssertionConcern.assertArgumentLength('label', label, 1, 20)
    this.#label = label
  }

  #setType(type) {
    AssertionConcern.assertArgumentOneOf('type', type, ["text", "boolean", "select", "multiselect"])
    this.#type = type
  }
}