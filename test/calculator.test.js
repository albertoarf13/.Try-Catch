const opc = require("./calculator");

test("adds 1 + 2 to equal 3", () =>{
    expect(opc.suma(1, 2)).toBe(3);
});
test("subs 1 - 2 to equal -2", () =>{
    expect(opc.resta(1, 2)).toBe(-1);
});