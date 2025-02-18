import { columnFactory } from "./__test__/column-factory"
import { Row } from "./row"

it("Should attempt get a column by id.", () => {
  // arrange
  const columns = [
    columnFactory({ metadata: { id: 1, label: "CPF" } }),
    columnFactory({ metadata: { id: 2, label: "Name" } }),
  ]

  const row = new Row(columns, {})

  // act
  const column = row.attemptGetColumn(2)
  const columnNotFound = row.attemptGetColumn(3)

  // assert
  expect(column.metadata.id).toBe(2)
  expect(column.metadata.label).toBe("Name")
  expect(columnNotFound).toBeUndefined()
})
