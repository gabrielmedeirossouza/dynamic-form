export class FormDragAndDropEventsAdapter {
  #formContext
  #moveTemplateColumnUseCase
  #moveTemplateColumnToNewRowUseCase
  #draggingColumnId = null

  isDragging = false

  constructor(
    formContext,
    moveTemplateColumnUseCase,
    moveTemplateColumnToNewRowUseCase
  ) {
    this.#formContext = formContext
    this.#moveTemplateColumnUseCase = moveTemplateColumnUseCase
    this.#moveTemplateColumnToNewRowUseCase = moveTemplateColumnToNewRowUseCase

    this.onDrag = this.onDrag.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onStop = this.onStop.bind(this)
  }

  onDrag(columnId) {
    this.isDragging = true
    this.#draggingColumnId = columnId
  }

  onDrop(event) {
    event.preventDefault()

    const isRow = (event.target instanceof HTMLElement) && event.target.dataset.isRow
    const isColumn = (event.target instanceof HTMLElement) && event.target.dataset.isColumn

    if (!this.isDragging || (!isRow && !isColumn)) {
      this.#reset()
      return
    }

    const position = event.target.dataset.position
    const targetId = event.target.dataset.targetId

    if (isRow) {
      this.#moveTemplateColumnToNewRowUseCase.execute(
        this.#formContext.currentForm.id,
        this.#formContext.currentTemplate.id,
        this.#draggingColumnId,
        position,
        targetId
      )
    } else {
      this.#moveTemplateColumnUseCase.execute(
        this.#formContext.currentForm.id,
        this.#formContext.currentTemplate.id,
        this.#draggingColumnId,
        position,
        targetId
      )
    }

    this.#formContext.update()

    this.#reset()
  }

  onStop() {
    this.#reset()
  }

  #reset() {
    this.isDragging = false
    this.#draggingColumnId = null
  }
}