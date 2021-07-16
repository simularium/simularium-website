import * as React from "react";

import {
    bindAll,
    convertToSentenceCase,
    roundTimeForDisplay,
    clearUrlParams,
    wrapText,
} from "../";
import {
    getGoogleDriveFileId,
    getUserTrajectoryUrl,
    isGoogleDriveUrl,
    urlCheck,
} from "../userUrlHandling";

process.env.GOOGLE_API_KEY = "key";
describe("General utilities", () => {
    describe("bindAll", () => {
        it("binds class methods to a class", () => {
            class Foo extends React.Component {
                private message = "Hello from Foo";

                constructor(props: any) {
                    super(props);
                    bindAll(this, [this.bar]);
                }

                public bar() {
                    return this.message;
                }
            }

            const foo = new Foo({});
            const bar = foo.bar;
            expect(foo.bar()).toBe(bar());
        });

        it("does not bind a method that it was not asked to bind", () => {
            class Foo extends React.Component {
                private message = "Hello from Foo";

                constructor(props: {}) {
                    super(props);
                    bindAll(this, [this.bar]);
                }

                public bar() {
                    return this.message;
                }

                public baz() {
                    return this.message;
                }
            }

            const foo = new Foo({});
            const baz = foo.baz;

            expect(foo.baz()).toBe("Hello from Foo");
            expect(baz).toThrowError(TypeError);
        });
    });

    describe("toSentenceCase", () => {
        it("returns an empty string as is", () => {
            const startingString = "";
            expect(convertToSentenceCase(startingString)).toBe("");
        });
        it("takes a string and converts it to sentence case", () => {
            const startingString = "all lowercase. all lowercase";
            expect(convertToSentenceCase(startingString)).toBe(
                "All lowercase. All lowercase"
            );
        });
        it("ignores camelcase", () => {
            const startingString = "all lowercase. has camelCase";
            expect(convertToSentenceCase(startingString)).toBe(
                "All lowercase. Has camelCase"
            );
        });
        it("fixes mid sentence caps", () => {
            const startingString = "all lowercase. has Mid sentence cap";
            expect(convertToSentenceCase(startingString)).toBe(
                "All lowercase. Has mid sentence cap"
            );
        });
    });

    describe("wrapText", () => {
        it("does not wrap a 1-word title", () => {
            expect(wrapText("1234567890", 8)).toEqual({
                formattedText: "1234567890",
                numLines: 1,
            });
        });
        it("wraps a title with a long first word", () => {
            expect(wrapText("1234567890 abc", 8)).toEqual({
                formattedText: "1234567890<br>abc",
                numLines: 2,
            });
        });
        it("does not wrap text shorter than maximum character length", () => {
            expect(wrapText("12345 7", 8)).toEqual({
                formattedText: "12345 7",
                numLines: 1,
            });
        });
        it("wraps text longer than maximum character length", () => {
            expect(wrapText("123 567 890 abcdefg wxyz", 8)).toEqual({
                formattedText: "123 567<br>890<br>abcdefg<br>wxyz",
                numLines: 4,
            });
        });
    });

    describe("clearUrlParams", () => {
        it("clears one URL param", () => {
            const baseUrl = `${location.origin}${location.pathname}`;
            history.replaceState({}, "", "?trajFileName=traj.simularium");
            expect(location.href).toBe(
                baseUrl + "?trajFileName=traj.simularium"
            );

            clearUrlParams();

            expect(location.href).toBe(baseUrl);
        });
        it("clears multiple URL params", () => {
            const baseUrl = `${location.origin}${location.pathname}`;
            history.replaceState(
                {},
                "",
                "?trajFileName=traj.simularium&month=jan"
            );
            expect(location.href).toBe(
                baseUrl + "?trajFileName=traj.simularium&month=jan"
            );

            clearUrlParams();

            expect(location.href).toBe(baseUrl);
        });
    });

    describe("roundTimeForDisplay", () => {
        it("returns a float with the requisite number of sig figs as is", () => {
            expect(roundTimeForDisplay(1.23)).toBe(1.23);
        });
        it("returns a float with less than the requisite number of sig figs as is", () => {
            expect(roundTimeForDisplay(1.2)).toBe(1.2);
        });
        it("rounds a float with greater than the requisite number of sig figs", () => {
            expect(roundTimeForDisplay(1.234123)).toBe(1.23);
        });
        it("returns an integer with the requisite number of sig figs as is", () => {
            expect(roundTimeForDisplay(123)).toBe(123);
        });
        it("returns an integer with less than the requisite number of sig figs as is", () => {
            expect(roundTimeForDisplay(12)).toBe(12);
        });
        it("rounds an integer with greater than the requisite number of sig figs", () => {
            expect(roundTimeForDisplay(1234123)).toBe(1230000);
        });
        it("does not include unnecessary zeros", () => {
            expect(roundTimeForDisplay(1.20000001)).toBe(1.2);
        });
    });
});

describe("User Url handling", () => {
    describe("urlCheck", () => {
        it("returns strings that match the regex", () => {
            const shouldMatch = [
                "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium",
                "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.json",
                "http://web5-site.com/directory",
                "https://fa-st.web9site.com/directory/file.filename",
                "https://fa-st.web9site.com/directory-name/file.filename",
                "https://website.com/directory/?key=val",
                "http://www.website.com/?key=val#anchor",
                "https://drive.google.com/uc?export=download&id=1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR",
            ];
            const result = shouldMatch.map(urlCheck);
            expect(result).toEqual(shouldMatch);
        });
        it("returns an empty string if give a non string", () => {
            const shouldNotMatch = [[], {}, 2, null, undefined];
            const result = shouldNotMatch.map(urlCheck);
            expect(result).toEqual(Array(shouldNotMatch.length).fill(""));
        });
        it("returns an empty string if the given string is not an accepted url", () => {
            const shouldNotMatch = [
                "website.com/?querystring",
                "www.website.com/?key=val",
                "http://website.c-om/directory",
                "https://website",
                "fast..web9site.com/directory/file.filename",
                "web?site.com",
                "website...com/??querystring",
                "www.w;ebsite.?com/",
            ];
            const result = shouldNotMatch.map(urlCheck);
            expect(result).toEqual(Array(shouldNotMatch.length).fill(""));
        });
    });
    describe("isGoogleDriveUrl", () => {
        it("returns true if the url has google.com in it", () => {
            const shouldMatch = [
                "https://google.com.amazonaws.com/trajectory/endocytosis.simularium",
                "https://drive.google.com/file/d/1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR/view",
                "drive.google.com/uc?export=download&id=1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR",
            ];
            const result = shouldMatch.map(isGoogleDriveUrl);
            expect(result).toEqual([true, true, true]);
        });
    });
    it("returns false if the url doesn't have google.com in it", () => {
        const shouldNotMatch = [
            "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium",
            "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.json",
            "http://web5-site.com/directory",
            "https://fa-st.web9site.com/directory/file.filename",
            "https://fa-st.web9site.com/directory-name/file.filename",
            "https://website.com/directory/?key=val",
            "http://www.website.com/?key=val#anchor",
        ];
        const result = shouldNotMatch.map(isGoogleDriveUrl);
        expect(result).toEqual(Array(shouldNotMatch.length).fill(false));
    });

    describe("getGoogleDriveFileId", () => {
        it("returns an id from a url", () => {
            const id = "id";
            const urls = [
                `https://drive.google.com/file/d/${id}/view`,
                `https://drive.google.com/file/d/${id}`,
                `https://drive.google.com/file/d/${id}/edit`,
            ];
            const result = urls.map((url) => getGoogleDriveFileId(url));
            expect(result).toEqual(Array(urls.length).fill(id));
        });
        it("returns an id if given one", () => {
            const id = "id";

            expect(getGoogleDriveFileId("url", id)).toEqual(id);
        });
    });
    describe("getUserTrajectoryUrl", () => {
        it("returns a google api url if given an id and a google url", () => {
            const id = "id";

            const result = getUserTrajectoryUrl("google.com", id);
            expect(result).toEqual(
                `https://www.googleapis.com/drive/v2/files/${id}?alt=media&key=key`
            );
        });
        it("returns the url if given an id, but not a google url", () => {
            const id = "id";
            const result = getUserTrajectoryUrl("url", id);
            expect(result).toEqual("url");
        });
        it("returns replaces dropbox.com", () => {
            const id = "id";
            const result = getUserTrajectoryUrl("dropbox.com/path", id);
            expect(result).toEqual("dl.dropboxusercontent.com/path");
        });
    });
});
