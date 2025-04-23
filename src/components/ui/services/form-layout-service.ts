import { Inject, Injectable } from "../../base/di";
import { UndefinedBehaviour } from "../../base/undefined-behaviour";
import { FormSizeObserver } from "../form-size-observer";

@Injectable("formLayoutService")
export class FormLayoutService {
  @Inject private formSizeObserver: FormSizeObserver;

  public getFieldWidthInPixels(templateRowGap: number, totalColumns: number, columnKind: string, columnSize: number) {
    if (columnKind === "percentage") {
      const totalUsablePercentageArea = this.getTotalUsablePercentageAreaInPixels(templateRowGap, totalColumns);
      const fieldWidth = totalUsablePercentageArea * (columnSize / 100);

      return fieldWidth;
    }

    throw new UndefinedBehaviour();
  }

  public getTotalUsablePercentageAreaInPixels(templateRowGap: number, totalColumns: number) {
    const totalGap = templateRowGap * (totalColumns + 1);
    const rowWidth = this.formSizeObserver.rowWidth.value;

    return rowWidth - totalGap;
  }
}
