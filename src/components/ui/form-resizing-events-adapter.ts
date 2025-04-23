import { CheckIsValidResizePercentageColumnUseCase } from "../application/use-cases/check-is-valid-resize-percentage-column-use-case";
import { ResizeColumnUseCase } from "../application/use-cases/resize-column-use-case";
import { Inject } from "../base/di";
import { UndefinedBehaviour } from "../base/undefined-behaviour";
import { FormContext } from "./contexts/form-context";
import { FormLayoutService } from "./services/form-layout-service";

export class FormResizingEventsAdapter {
  @Inject private formContext: FormContext;
  @Inject private formLayoutService: FormLayoutService;
  @Inject private resizeColumnUseCase: ResizeColumnUseCase;
  @Inject private checkIsValidResizePercentageColumnUseCase: CheckIsValidResizePercentageColumnUseCase;

  private isResizing = false;
  private rowId?: string;
  private totalColumns: number;
  private columnId?: string;
  private columnKind?: string;
  private columnSize?: number;
  private startX = 0;

  private boundOnResize = this.onResize.bind(this);
  private boundOnStopResizing = this.onStopResizing.bind(this);

  constructor() {
    window.addEventListener("mousemove", this.boundOnResize);
    window.addEventListener("mouseup", this.boundOnStopResizing);
  }

  public clearListeners() {
    window.removeEventListener("mousemove", this.boundOnResize);
    window.removeEventListener("mouseup", this.boundOnStopResizing);
  }

  public onStartResizing(event: DragEvent, rowId: string, columnId: string, columnKind: string, columnSize: number) {
    this.isResizing = true;
    this.rowId = rowId;
    this.columnId = columnId;
    this.columnKind = columnKind;
    this.columnSize = columnSize;
    this.startX = event.x;
  }

  public onResize(event: MouseEvent) {
    if (!this.isResizing) return;

    const mouseDiff = event.x - this.startX;

    if (this.columnKind === "percentage") {
      return this.processPercentageColumn(mouseDiff);
    }

    throw new UndefinedBehaviour();
  }

  public processPercentageColumn(mouseDiff: number) {
    const fieldWidth = this.formLayoutService.getFieldWidthInPixels(
      this.formContext.currentTemplate!.layout.rowGap,
      this.totalColumns,
      this.columnKind!,
      this.columnSize!
    );

    const totalUsablePercentageArea = this.formLayoutService.getTotalUsablePercentageAreaInPixels(
      this.formContext.currentTemplate!.layout.rowGap,
      this.totalColumns!
    );

    const normalizedPercentageArea = (fieldWidth + mouseDiff) / totalUsablePercentageArea;
    const size = Math.round(normalizedPercentageArea * 100);

    const isValidResizePercentageValue = this.checkIsValidResizePercentageColumnUseCase.execute(
      this.formContext.currentForm!.id,
      this.formContext.currentTemplate!.id,
      this.rowId!,
      this.columnId!,
      size
    );

    const outsidePercentageRange =
      size < 20 ||
      size > 100 ||
      !isValidResizePercentageValue;

    if (outsidePercentageRange) return;

    this.resizeColumnUseCase.execute(
      this.formContext.currentForm!.id,
      this.formContext.currentTemplate!.id,
      this.columnId!,
      size
    );

    this.formContext.update({});
  }

  public onStopResizing() {
    this.isResizing = false;
    this.rowId = undefined;
    this.columnId = undefined;
    this.columnKind = undefined;
    this.columnSize = undefined;
    this.startX = 0;
  }
}
