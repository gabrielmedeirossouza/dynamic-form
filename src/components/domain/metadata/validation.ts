import { AssertionConcern } from "../../base/assertion-concern";

export class Validation {
  public readonly type: "only-numbers" | "only-letters" | "cep" | "cpf" | "cnpj" | "phone" | "date" | "email";

  constructor(
    type: string,
    public readonly required: boolean
  ) {
    AssertionConcern.assertArgumentOneOf("type", type, ["only-numbers", "only-letters", "cep", "cpf", "cnpj", "phone", "date", "email"]);
    this.type = type;
  }
}
