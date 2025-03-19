import { Column } from "../column";
import { ColumnLayout } from "../column-layout";
import { Size } from "../size";
import { Row } from "../row";

it.each([
  { sizes: [["fixed", 100], ["fixed", 200], ["fixed", 300]] },
  { sizes: [["fixed", 100], ["fixed", 200], ["percentage", 20, 300]] },
  { sizes: [["fixed", 100], ["percentage", 20, 200], ["percentage", 20, 300]] },
  { sizes: [["percentage", 20, 100], ["percentage", 20, 200], ["percentage", 20, 300]] }
])("Should create a valid row.", ({ sizes }) => {
  const row = new Row("row-1", [
    new Column("column-1", new ColumnLayout(new Size(sizes[0][0], sizes[0][1], sizes[0][2]))),
    new Column("column-2", new ColumnLayout(new Size(sizes[1][0], sizes[1][1], sizes[1][2]))),
    new Column("column-3", new ColumnLayout(new Size(sizes[2][0], sizes[2][1], sizes[2][2])))
  ]);

  expect(row.id).toBe("row-1");
  expect(row.columns.length).toBe(3);
  expect(row.breakpoint).toBe(600);
})

it("Should add a column next to another.", () => {
  const row = new Row("row-1", [
    new Column("column-1", new ColumnLayout(new Size("fixed", 100))),
    new Column("column-2", new ColumnLayout(new Size("fixed", 200))),
    new Column("column-3", new ColumnLayout(new Size("fixed", 300)))
  ]);

  const column = new Column("column-4", new ColumnLayout(new Size("fixed", 230)));

  row.addColumnNextTo(column, "before", "column-2");

  expect(row.columns.length).toBe(4);
  expect(row.columns[0].metadataId).toBe("column-1");
  expect(row.columns[1].metadataId).toBe("column-4");
  expect(row.columns[2].metadataId).toBe("column-2");
  expect(row.columns[3].metadataId).toBe("column-3");
})

it("Should add multiple columns next to another.", () => {
  const row = new Row("row-1", [
    new Column("column-1", new ColumnLayout(new Size("fixed", 100))),
    new Column("column-2", new ColumnLayout(new Size("fixed", 200))),
    new Column("column-3", new ColumnLayout(new Size("fixed", 300)))
  ]);

  const column1 = new Column("column-4", new ColumnLayout(new Size("fixed", 230)));
  const column2 = new Column("column-5", new ColumnLayout(new Size("fixed", 150)));

  row.addColumnNextTo(column1, "before", "column-2");
  row.addColumnNextTo(column2, "after", "column-4");

  expect(row.columns.length).toBe(5);
  expect(row.columns[0].metadataId).toBe("column-1");
  expect(row.columns[1].metadataId).toBe("column-4");
  expect(row.columns[2].metadataId).toBe("column-5");
  expect(row.columns[3].metadataId).toBe("column-2");
  expect(row.columns[4].metadataId).toBe("column-3");
})

it("Should delete a column.", () => {
  const row = new Row("row-1", [
    new Column("column-1", new ColumnLayout(new Size("fixed", 100))),
    new Column("column-2", new ColumnLayout(new Size("fixed", 200))),
    new Column("column-3", new ColumnLayout(new Size("fixed", 300)))
  ]);

  row.deleteColumn("column-2");

  expect(row.columns.length).toBe(2);
  expect(row.columns[0].metadataId).toBe("column-1");
  expect(row.columns[1].metadataId).toBe("column-3");
})