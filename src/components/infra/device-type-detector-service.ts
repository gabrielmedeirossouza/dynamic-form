export type DeviceType =
  "desktop" |
  "tablet" |
  "mobile"

export interface DeviceTypeDetectorService {
  getDeviceType(): DeviceType
}
