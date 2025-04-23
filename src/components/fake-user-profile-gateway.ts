import { FormGateway } from "./application/form-gateway";
import { Column } from "./domain/form/column";
import { ColumnLayout } from "./domain/form/column-layout";
import { Form } from "./domain/form/form";
import { Percentage } from "./domain/form/percentage";
import { Row } from "./domain/form/row";
import { Template } from "./domain/form/template";
import { TemplateLayout } from "./domain/form/template-layout";
import { Metadata } from "./domain/metadata/metadata";

const cpf = new Metadata({ id: "1", label: "CPF", slug: "cpf", type: "text", showOnPortal: true, sensitiveData: false, active: true });
const nome = new Metadata({ id: "2", label: "Nome", slug: "nome", type: "text", showOnPortal: true, sensitiveData: false, active: true });
const sobrenome = new Metadata({ id: "3", label: "Sobrenome", slug: "sobrenome", type: "text", showOnPortal: true, sensitiveData: false, active: true });
const email = new Metadata({ id: "4", label: "Email", slug: "email", type: "text", showOnPortal: true, sensitiveData: false, active: true });
const grau = new Metadata({ id: "5", label: "Grau", slug: "grau", type: "text", showOnPortal: true, sensitiveData: false, active: true });

const mainTemplate = new Template(
  crypto.randomUUID(),
  new TemplateLayout(20, 20),
  [
    new Row(
      crypto.randomUUID(),
      [
        new Column(
          crypto.randomUUID(),
          cpf.id,
          new ColumnLayout(new Percentage(50))
        ),
        new Column(
          crypto.randomUUID(),
          nome.id,
          new ColumnLayout(new Percentage(50))
        )
      ]
    ),

    new Row(
      crypto.randomUUID(),
      [
        new Column(
          crypto.randomUUID(),
          sobrenome.id,
          new ColumnLayout(new Percentage(50))
        ),
        new Column(
          crypto.randomUUID(),

          email.id,
          new ColumnLayout(new Percentage(50))
        )
      ]
    ),

    new Row(
      crypto.randomUUID(),
      [
        new Column(
          crypto.randomUUID(),
          grau.id,
          new ColumnLayout(new Percentage(100))
        )
      ]
    )
  ],
  -1
);

const form = new Form(
  crypto.randomUUID(),
  [cpf.id, nome.id, sobrenome.id, email.id, grau.id],
  mainTemplate,
  []
);

const metadataList = [cpf, nome, sobrenome, email, grau];

export class FakeUserProfileGateway implements FormGateway {
  public fetch(): Promise<[form: Form, metadataList: Metadata[]]> {
    return Promise.resolve([form, metadataList]);
  }
}
