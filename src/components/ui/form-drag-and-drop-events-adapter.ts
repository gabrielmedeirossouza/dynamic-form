import { MoveColumnToNewRowUseCase } from "../application/use-cases/move-column-to-new-row-use-case";
import { MoveColumnUseCase } from "../application/use-cases/move-column-use-case";
import { Inject } from "../base/di";
import { FormContext } from "./contexts/form-context";

export class FormDragAndDropEventsAdapter {
  @Inject private formContext: FormContext;
  @Inject private moveColumnUseCase: MoveColumnUseCase;
  @Inject private moveColumnToNewRowUseCase: MoveColumnToNewRowUseCase;

  private draggingColumnId?: string;
  public isDragging = false;

  constructor() {
    this.onDrag = this.onDrag.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  public onDrag(columnId: string) {
    this.isDragging = true;
    this.draggingColumnId = columnId;
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();

    const isRow = (event.target instanceof HTMLElement) && event.target.dataset.isRow;
    const isColumn = (event.target instanceof HTMLElement) && event.target.dataset.isColumn;

    if (!this.isDragging || (!isRow && !isColumn)) {
      this.reset();

      return;
    }

    const position = event.target.dataset.position!;
    const targetId = event.target.dataset.targetId!;

    if (isRow) {
      this.moveColumnToNewRowUseCase.execute(
        this.formContext.currentForm!.id,
        this.formContext.currentTemplate!.id,
        this.draggingColumnId!,
        position,
        targetId
      );
    } else {
      this.moveColumnUseCase.execute(
        this.formContext.currentForm!.id,
        this.formContext.currentTemplate!.id,
        this.draggingColumnId!,
        position,
        targetId
      );
    }

    this.formContext.update({});

    this.reset();
  }

  public onStop() {
    this.reset();
  }

  private reset() {
    this.isDragging = false;
    this.draggingColumnId = undefined;
  }
}
