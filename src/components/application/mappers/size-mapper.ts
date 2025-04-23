import { UndefinedBehaviour } from "../../base/undefined-behaviour";
import { Size } from "../../domain/form/size";

export class SizeMapper {
  public static map(size: Size) {
    if (size.isPercentage()) {
      return {
        kind: "percentage" as const,
        value: size.value
      };
    }

    throw new UndefinedBehaviour();
  }
}
