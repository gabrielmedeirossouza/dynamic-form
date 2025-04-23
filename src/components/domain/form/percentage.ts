import { AssertionConcern } from "../../base/assertion-concern";
import { Inject } from "../../base/di";
import { PercentageSizeCalculatorService } from "./services/percentage-size-calculator-service";
import { Size } from "./size";

export class Percentage implements Size {
  @Inject private percentageSizeCalculatorService: PercentageSizeCalculatorService;

  constructor(
    public readonly value: number
  ) {
    const minSize = this.percentageSizeCalculatorService.minSize();

    AssertionConcern.assertArgumentRange("value", value, minSize, 100);
  }

  public isPercentage(): this is Percentage {
    return true;
  }

  public resize(value: number): Size {
    return new Percentage(value);
  }
}
