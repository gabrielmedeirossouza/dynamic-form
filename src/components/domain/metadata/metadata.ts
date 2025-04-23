import { AssertionConcern } from "../../base/assertion-concern";
import { Presentation } from "./presentation";
import { Validation } from "./validation";

export class Metadata {
  public readonly id: string;
  public readonly label: string;
  public readonly slug: string;
  public readonly type: "text" | "boolean" | "select" | "multiselect";
  public readonly showOnPortal: boolean;
  public readonly sensitiveData: boolean;
  public readonly active: boolean;
  public readonly validation?: Validation;
  public readonly presentation?: Presentation;

  constructor(param: {
    id: string,
    slug: string,
    label: string,
    type: string,
    showOnPortal: boolean,
    sensitiveData: boolean,
    active: boolean,
    validation?: Validation,
    presentation?: Presentation
  }) {
    const { id, label, slug, type, showOnPortal, sensitiveData, active, validation, presentation } = param;

    this.id = id;
    this.slug = slug;
    this.showOnPortal = showOnPortal;
    this.sensitiveData = sensitiveData;
    this.active = active;
    this.validation = validation;
    this.presentation = presentation;

    AssertionConcern.assertArgumentLength("label", label, 1, 20);
    AssertionConcern.assertArgumentOneOf("type", type, ["text", "boolean", "select", "multiselect"]);

    this.label = label;
    this.type = type;
  }
}
