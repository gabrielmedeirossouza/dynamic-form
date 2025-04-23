import { Percentage } from "./percentage";

export interface Size {
  resize(value: number): Size
  isPercentage(): this is Percentage
}
