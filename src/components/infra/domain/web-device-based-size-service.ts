import { DeviceBasedSizeService } from "../../domain/form/services/device-based-size-service";

export class WebDeviceBasedSizeService implements DeviceBasedSizeService {
  constructor(
    private readonly deviceType: "desktop" | "tablet" | "mobile"
  ) {}

  public minSize(): number {
    const minSizeBasedDeviceType = {
      desktop: 15,
      tablet: 25,
      mobile: 40
    } as const;

    return minSizeBasedDeviceType[this.deviceType];
  }
}
