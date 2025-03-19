import { Column } from "../column"
import { ColumnLayout } from "../column-layout"
import { Row } from "../row"
import { Size } from "../size"
import { TemplateLayout } from "../template-layout"
import { Template } from "../template"

const columnFactory = (metadataId, type, value, min) => {
  return new Column(metadataId, new ColumnLayout(new Size(type, value, min)))
}

it("Should move a column.", () => {
  const templateLayout = new TemplateLayout(20, 20)

  const rows = [
    new Row("1", [
      columnFactory("1", "fixed", 100),
      columnFactory("2", "fixed", 200)
    ]),
    new Row("2", [
      columnFactory("3", "fixed", 100),
      columnFactory("4", "fixed", 200)
    ])
  ]

  const template = new Template("1", templateLayout, rows)

  const tests = [
    ["1", "before", "1", {
      expected: [
        ["1", "2"],
        ["3", "4"]
      ]
    }],
    ["1", "after", "1", {
      expected: [
        ["1", "2"],
        ["3", "4"]
      ]
    }],
    ["1", "before", "4", {
      expected: [
        ["2"],
        ["3", "1", "4"]
      ]
    }],
    ["1", "after", "4", {
      expected: [
        ["2"],
        ["3", "4", "1"]
      ]
    }],
    ["2", "before", "4", {
      expected: [
        ["3", "2", "4", "1"]
      ]
    }],
    ["3", "after", "1", {
      expected: [
        ["2", "4", "1", "3"]
      ]
    }],
    ["4", "before", "1", {
      expected: [
        ["2", "4", "1", "3"]
      ]
    }]
  ]

  expect(template.breakpoint).toBe(300)

  for (const test of tests) {
    const [columnId, position, targetId, { expected }] = test
    template.moveColumn(columnId, position, targetId)

    expect(template.rows.map(row => row.columns.map(column => column.metadataId))).toEqual(expected)
    expect(template.rows.map(row => row.columns.length)).toEqual(expected.map(row => row.length))
  }

  expect(template.breakpoint).toBe(600)
  expect(template.rows.length).toBe(1)

  template.moveColumnToNewRow("1", "after", "2")

  expect(template.breakpoint).toBe(500)
  expect(template.rows.length).toBe(2)
  expect(template.rows.map(row => row.columns.map(column => column.metadataId))).toEqual([
    ["2", "4", "3"],
    ["1"]
  ])

  template.moveColumnToNewRow("1", "before", "2")

  expect(template.breakpoint).toBe(500)
  expect(template.rows.length).toBe(2)
  expect(template.rows.map(row => row.columns.map(column => column.metadataId))).toEqual([
    ["1"],
    ["2", "4", "3"]
  ])
})
