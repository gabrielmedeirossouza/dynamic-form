import { Inject } from "src/components/base/di";
import { AssertionConcern } from "../../base/assertion-concern";
import { DeviceBasedSizeService } from "./services/device-based-size-service";

export class Size {
  @Inject private deviceBasedSizeService: DeviceBasedSizeService;

  constructor(
    public readonly type: string,
    public readonly value: number
  ) {
    const minValue = this.deviceBasedSizeService.minSize();

    AssertionConcern.assertArgumentOneOf("type", type, ["huge", "medium", "small"]);
    AssertionConcern.assertArgumentRange("value", value, minValue, 100);
  }
}
