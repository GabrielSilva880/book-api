import { hello } from "./index";

test("should return Hello World!", () => {
  expect(hello()).toBe("Hello World!");
});
