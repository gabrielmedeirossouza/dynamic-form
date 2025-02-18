import { Column } from "../column"

export const columnFactory = (overrides = {}) => {
  const metadata = {
    id: 1,
    label: "CPF",
    slug: "cpf",
    type: "text",
    showOnPortal: true,
    sensitiveData: false,
    active: true,
    validation: null,
    presentation: null,
    ...overrides.metadata
  }

  const layout = {
    width: "50%",
    ...overrides.layout
  }

  return new Column(metadata, layout)
}