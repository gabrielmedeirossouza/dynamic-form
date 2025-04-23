import { Injectable } from "../../base/di";
import { DeviceType, DeviceTypeDetectorService } from "../../infra/device-type-detector-service";

@Injectable("deviceTypeDetectorService")
export class BrowserDeviceTypeDetectorService implements DeviceTypeDetectorService {
  private static currentDeviceType: DeviceType;

  static {
    this.currentDeviceType = this.detectDeviceType(window.innerWidth);

    window.addEventListener("load", () => {
      this.currentDeviceType = this.detectDeviceType(window.innerWidth);
    });

    window.addEventListener("resize", () => {
      this.currentDeviceType = this.detectDeviceType(window.innerWidth);
    });
  }

  private static detectDeviceType(width: number): DeviceType {
    if (width >= 1024) return "desktop";
    if (width >= 600) return "tablet";

    return "mobile";
  }

  public getDeviceType(): DeviceType {
    return BrowserDeviceTypeDetectorService.currentDeviceType;
  }
}
