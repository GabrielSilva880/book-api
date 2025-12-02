"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
test("should return Hello World!", () => {
    expect((0, index_1.hello)()).toBe("Hello World!");
});
