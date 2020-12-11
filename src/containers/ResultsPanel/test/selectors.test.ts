import { expect } from "chai";

import { wrapTitle } from "../selectors";

describe("wrapTitle", () => {
    it("does not wrap text shorter than maximum character length", () => {
        expect(wrapTitle("Listeria change over time", 32)).to.deep.equal({
            formattedText: "Listeria change over time",
            numLines: 1,
        });
    });
    it("wraps text longer than maximum character length", () => {
        expect(
            wrapTitle(
                "Listeria change over time an even longer title trajectory simulation",
                32
            )
        ).to.deep.equal({
            formattedText:
                "Listeria change over time an<br>even longer title trajectory<br>simulation",
            numLines: 3,
        });
    });
});
