import { columnFactory } from "./__test__/column-factory"

it("Should throw an error when trying to delete self without a parent.", () => {
  // arrange
  const column = columnFactory()

  // act
  const action = () => column.delete()

  // assert
  expect(action).toThrowError("Column must have a parent!")
})

it("Should throw an error if parent does not have a deleteColumn method.", () => {
  // arrange
  const column = columnFactory()
  const mockParent = {}

  column.setParent(mockParent)

  // act
  const action = () => column.delete()

  // assert
  expect(action).toThrowError("Column parent must have a deleteColumn method!")
})
