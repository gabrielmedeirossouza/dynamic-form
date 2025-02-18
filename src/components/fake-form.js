import { Column } from "./column";
import { Form } from "./form";
import { Metadata } from "./metadata";
import { Row } from "./row";

export const fakeForm = new Form(
  [
    new Row(
      [
        new Column(
          new Metadata(1, "CPF", "cpf", "text", true, false, true, { type: "cpf", required: true }, { placeholder: "Digite seu CPF" }),
          {
            width: "33.33%",
          }
        ),

        new Column(
          new Metadata(2, "Nome", "nome", "text", true, false, true, { type: "text", required: true }, { placeholder: "Digite seu nome" }),
          {
            width: "33.33%"
          }
        ),

        new Column(
          new Metadata(3, "Sobrenome", "sobrenome", "text", true, false, true, { type: "text", required: true }, { placeholder: "Digite seu sobrenome" }),
          {
            width: "33.33%"
          }
        )
      ],
      {}
    ),

    new Row(
      [
        new Column(
          new Metadata(4, "Email", "cpf", "text", true, false, true, { type: "cpf", required: true }, { placeholder: "Digite seu CPF" }),
          {
            width: "50%",
          }
        ),

        new Column(
          new Metadata(5, "Grau", "nome", "text", true, false, true, { type: "text", required: true }, { placeholder: "Digite seu nome" }),
          {
            width: "50%"
          }
        ),
      ],
      {}
    )
  ],
  {
    type: "grid",
  }
)