import { Inject, Injectable } from "../../base/di";
import { PercentageSizeCalculatorService } from "../../domain/form/services/percentage-size-calculator-service";
import { DeviceTypeDetectorService } from "../device-type-detector-service";

@Injectable("percentageSizeCalculatorService")
export class PercentageDeviceBasedSizeCalculatorService implements PercentageSizeCalculatorService {
  @Inject private deviceTypeDetectorService: DeviceTypeDetectorService;

  public minSize(): number {
    const minSizeBasedDeviceType = {
      desktop: 15,
      tablet: 25,
      mobile: 40
    } as const;

    const deviceType = this.deviceTypeDetectorService.getDeviceType();

    return minSizeBasedDeviceType[deviceType];
  }
}
