import { expect } from "chai";

import { wrapTitle } from "../selectors";

describe("wrapTitle", () => {
    it("does not wrap a 1-word title", () => {
        expect(wrapTitle("1234567890", 8)).to.deep.equal({
            formattedText: "1234567890",
            numLines: 1,
        });
    });
    // it("wraps a title with a very long first word", () => {
    //     expect(wrapTitle("1234567890 abc", 8)).to.deep.equal({
    //         formattedText: "1234567890<br>abc",
    //         numLines: 2,
    //     });
    // });
    it("does not wrap text shorter than maximum character length", () => {
        expect(wrapTitle("123456", 8)).to.deep.equal({
            formattedText: "123456",
            numLines: 1,
        });
    });
    it("wraps text longer than maximum character length", () => {
        expect(wrapTitle("123 567 890 abcdefg wxyz", 8)).to.deep.equal({
            formattedText: "123 567<br>890<br>abcdefg<br>wxyz",
            numLines: 4,
        });
    });
});
