import { Size } from "../size"

it("Should create a valid fixed size.", () => {
  const size = new Size("fixed", 100);

  expect(size.type).toBe("fixed");
  expect(size.value).toBe(100);
  expect(size.min).toBe(undefined);
  expect(size.isFixed).toBe(true);
  expect(size.isPercentage).toBe(false);
  expect(size.staticValue).toBe(100);
})

it("Should create a invalid fixed size.", () => {
  expect(() => new Size("fixed", 99)).toThrow();
  expect(() => new Size("fixed", 321)).toThrow();
  expect(() => new Size("fixed", 100, 10)).toThrow();
})

it("Should create a valid percentage size.", () => {
  const size = new Size("percentage", 20, 200);

  expect(size.type).toBe("percentage");
  expect(size.value).toBe(20);
  expect(size.min).toBe(200);
  expect(size.isFixed).toBe(false);
  expect(size.isPercentage).toBe(true);
  expect(size.staticValue).toBe(200);
})

it("Should create a invalid percentage size.", () => {
  expect(() => new Size("percentage", 19)).toThrow();
  expect(() => new Size("percentage", 101)).toThrow();
  expect(() => new Size("percentage", 20, 99)).toThrow();
  expect(() => new Size("percentage", 20, 321)).toThrow();
})