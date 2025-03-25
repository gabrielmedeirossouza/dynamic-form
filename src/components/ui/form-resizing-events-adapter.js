export class FormResizingEventsAdapter {
  #formContext
  #formLayoutService
  #resizeColumnUseCase
  #checkIsValidResizePercentageColumnUseCase

  isResizing = false
  #row = null
  #column = null
  #startX = 0

  #boundOnResize = this.#onResize.bind(this)
  #boundOnStopResizing = this.#onStopResizing.bind(this)

  constructor(formContext, formLayoutService, resizeColumnUseCase, checkIsValidResizePercentageColumnUseCase) {
    this.#formContext = formContext
    this.#formLayoutService = formLayoutService
    this.#resizeColumnUseCase = resizeColumnUseCase
    this.#checkIsValidResizePercentageColumnUseCase = checkIsValidResizePercentageColumnUseCase

    window.addEventListener("mousemove", this.#boundOnResize)
    window.addEventListener("mouseup", this.#boundOnStopResizing)
  }

  clearListeners() {
    window.removeEventListener("mousemove", this.#boundOnResize)
    window.removeEventListener("mouseup", this.#boundOnStopResizing)
  }

  onStartResizing(event, row, column) {
    this.isResizing = true
    this.#row = row
    this.#column = column
    this.#startX = event.x
  }

  #onResize(event) {
    if (!this.isResizing) return

    const mouseDiff = event.x - this.#startX

    if (this.#column.layout.size.isFixed) {
      return this.#processFixedColumn(mouseDiff)
    }

    if (this.#column.layout.size.isPercentage) {
      return this.#processPercentageColumn(mouseDiff)
    }

    throw new Error(
      `Cannot process resize. Process is not implemented yet of this size type: ${this.#column.layout.size.type}.`
    )
  }

  #processFixedColumn(mouseDiff) {
    const size = this.#column.layout.size.value + mouseDiff

    if (size < 100 || size > 320) return

    this.#resizeColumnUseCase.execute(
      this.#formContext.currentForm.id,
      this.#formContext.currentTemplate.id,
      this.#column.id,
      size,
      this.#column.layout.size.min
    )

    this.#formContext.update()
  }

  #processPercentageColumn(mouseDiff) {
    const fieldWidth = this.#formLayoutService.getFieldWidthInUnits(this.#formContext.currentTemplate, this.#row, this.#column)
    const totalUsablePercentageArea = this.#formLayoutService.getTotalUsablePercentageAreaInUnits(this.#formContext.currentTemplate, this.#row)
    const normalizedPercentageArea = (fieldWidth + mouseDiff) / totalUsablePercentageArea
    const size = Math.round(normalizedPercentageArea * 100)

    const isValidResizePercentageValue = this.#checkIsValidResizePercentageColumnUseCase.execute(
      this.#formContext.currentForm.id,
      this.#formContext.currentTemplate.id,
      this.#row.id,
      this.#column.id,
      size
    )

    const outsidePercentageRange =
      size < 20 ||
      size > 100 ||
      !isValidResizePercentageValue

    if (outsidePercentageRange) return

    this.#resizeColumnUseCase.execute(
      this.#formContext.currentForm.id,
      this.#formContext.currentTemplate.id,
      this.#column.id,
      size,
      this.#column.layout.size.min
    )

    this.#formContext.update()
  }

  #onStopResizing() {
    this.isResizing = false
    this.#row = null
    this.#column = null
    this.#startX = 0
  }
}