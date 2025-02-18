import { columnFactory } from "./__test__/column-factory";
import { Form } from "./form";
import { Row } from "./row";

it.each([
  [1, "before", 1, { expectedRowA: [1, 2], expectedRowB: [3, 4] }],
  [1, "after", 1, { expectedRowA: [1, 2], expectedRowB: [3, 4] }],
  [1, "before", 4, { expectedRowA: [2], expectedRowB: [3, 1, 4] }],
  [1, "after", 4, { expectedRowA: [2], expectedRowB: [3, 4, 1] }],
  [2, "before", 4, { expectedRowA: [1], expectedRowB: [3, 2, 4] }],
  [2, "after", 4, { expectedRowA: [1], expectedRowB: [3, 4, 2] }],
  [3, "before", 4, { expectedRowA: [1, 2], expectedRowB: [3, 4] }],
  [3, "after", 4, { expectedRowA: [1, 2], expectedRowB: [4, 3] }],
  [4, "before", 1, { expectedRowA: [4, 1, 2], expectedRowB: [3] }],
  [4, "after", 1, { expectedRowA: [1, 4, 2], expectedRowB: [3] }],
  [4, "before", 2, { expectedRowA: [1, 4, 2], expectedRowB: [3] }],
  [4, "after", 2, { expectedRowA: [1, 2, 4], expectedRowB: [3] }],
  [4, "before", 3, { expectedRowA: [1, 2], expectedRowB: [4, 3] }],
  [4, "after", 3, { expectedRowA: [1, 2], expectedRowB: [3, 4] }],
  [4, "before", 4, { expectedRowA: [1, 2], expectedRowB: [3, 4] }],
  [4, "after", 4, { expectedRowA: [1, 2], expectedRowB: [3, 4] }]
])("%# Should move a column", (column, position, target, { expectedRowA, expectedRowB }) => {
  // arrange
  const form = new Form([
    new Row([
      columnFactory({ metadata: { id: 1, label: "CPF" } }),
      columnFactory({ metadata: { id: 2, label: "Name" } })
    ], {}),
    new Row([
      columnFactory({ metadata: { id: 3, label: "Age" } }),
      columnFactory({ metadata: { id: 4, label: "Address" } })
    ], {})
  ], {})

  // act
  form.moveColumn(column, position, target)

  // assert
  const [rowA, rowB] = form.rows
  expect(rowA.columns.map(c => c.metadata.id)).toEqual(expectedRowA)
  expect(rowA.columns.length).toBe(expectedRowA.length)
  expect(rowB.columns.map(c => c.metadata.id)).toEqual(expectedRowB)
  expect(rowB.columns.length).toBe(expectedRowB.length)
});

it.each([
  [[[1, "before", 1], [1, "after", 1], [1, "before", 2]], { expectedRowA: [1, 2], expectedRowB: [3, 4] }],
  [[[1, "before", 4], [1, "after", 4], [1, "before", 4]], { expectedRowA: [2], expectedRowB: [3, 1, 4] }],
  [[[1, "after", 4], [2, "after", 1]], { expectedRowA: [3, 4, 1, 2], expectedRowB: undefined }],
  [[[2, "before", 4], [4, "before", 1], [2, "after", 4]], { expectedRowA: [4, 2, 1], expectedRowB: [3] }],
  [[[4, "after", 2], [3, "before", 1]], { expectedRowA: [3, 1, 2, 4], expectedRowB: undefined }],
])("%# Should move a column N times", (cases, { expectedRowA, expectedRowB }) => {
  // arrange
  const form = new Form([
    new Row([
      columnFactory({ metadata: { id: 1, label: "CPF" } }),
      columnFactory({ metadata: { id: 2, label: "Name" } })
    ], {}),
    new Row([
      columnFactory({ metadata: { id: 3, label: "Age" } }),
      columnFactory({ metadata: { id: 4, label: "Address" } })
    ], {})
  ], {})

  // act
  for (const [column, position, target] of cases) {
    form.moveColumn(column, position, target)
  }

  // assert
  const [rowA, rowB] = form.rows
  expect(rowA?.columns.map(c => c.metadata.id)).toEqual(expectedRowA)
  expect(rowA?.columns.length).toBe(expectedRowA?.length)
  expect(rowB?.columns.map(c => c.metadata.id)).toEqual(expectedRowB)
  expect(rowB?.columns.length).toBe(expectedRowB?.length)
});