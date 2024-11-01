import * as React from "react";

import {
    URL_PARAM_KEY_FILE_NAME,
    URL_PARAM_KEY_USER_URL,
    USER_TRAJ_REDIRECTS,
} from "../../constants";
import {
    bindAll,
    convertToSentenceCase,
    roundTimeForDisplay,
    wrapText,
    getIconGlyphClasses,
    formatFloatForDisplay,
    copyToClipboard,
    roundToTimeStepPrecision,
    compareAgentTrees,
    applyColorChangeToUiDisplayData,
} from "../";
import {
    getFileIdFromUrl,
    getGoogleDriveFileId,
    getRedirectUrl,
    getUserTrajectoryUrl,
    isGoogleDriveUrl,
    isOnlineTrajectory,
    urlCheck,
    hasUrlParamsSettings,
    editUrlParams,
    clearBrowserUrlParams,
    getUrlParamValue,
} from "../userUrlHandling";
import { IconGlyphs } from "../../constants/interfaces";
import { UIDisplayData } from "@aics/simularium-viewer";

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

                constructor(props: Record<string, never>) {
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
        it("does not capitalize a letter immediately following a period", () => {
            const startingString = "like a .simularium file extension";
            expect(convertToSentenceCase(startingString)).toBe(
                "Like a .simularium file extension"
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

    describe("hasUrlParamsSettings", () => {
        it("returns false if no url params or trajectory", () => {
            const url = `${location.origin}${location.pathname}`;
            history.replaceState({}, "", url);
            expect(hasUrlParamsSettings()).toBe(false);
        });
        it("returns false if no url params", () => {
            const url = `${location.origin}${location.pathname}`;
            history.replaceState({}, "", url + "?trajFileName=traj.simularium");
            expect(hasUrlParamsSettings()).toBe(false);
        });
        it("returns true if url time param", () => {
            const url = `${location.origin}${location.pathname}`;
            history.replaceState(
                {},
                "",
                url + "?trajFileName=traj.simularium&t=0"
            );
            expect(hasUrlParamsSettings()).toBe(true);
        });
        it("returns false if url params are not in urlSetttings", () => {
            const url = `${location.origin}${location.pathname}`;
            history.replaceState(
                {},
                "",
                url + "?trajFileName=traj.simularium&notparam=foo"
            );
            expect(hasUrlParamsSettings()).toBe(false);
        });
    });

    describe("editUrlParams", () => {
        it("adds a url param when that param was not present before", () => {
            const url = `${location.origin}${location.pathname}?trajFileName=traj.simularium`;
            const value = "0";
            const paramKey = "t";
            expect(editUrlParams(url, value, paramKey)).toBe(url + "&t=0");
        });
        it("updates an existing param", () => {
            const url = `${location.origin}${location.pathname}?trajFileName=traj.simularium`;
            const param = "&t=0";
            const value = "1";
            const paramKey = "t";
            expect(editUrlParams(url + param, value, paramKey)).toBe(
                url + "&t=1"
            );
        });
    });

    describe("clearBrowserUrlParams", () => {
        it("clears one URL param", () => {
            const baseUrl = `${location.origin}${location.pathname}`;
            history.replaceState({}, "", "?trajFileName=traj.simularium");
            expect(location.href).toBe(
                baseUrl + "?trajFileName=traj.simularium"
            );
            clearBrowserUrlParams();
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

            clearBrowserUrlParams();

            expect(location.href).toBe(baseUrl);
        });
    });

    describe("roundTimeForDisplay", () => {
        it("returns a float with the requisite number of sig figs as is", () => {
            expect(roundTimeForDisplay(1.23)).toBe(1.23);
        });
        it("returns zero if given zero", () => {
            expect(roundTimeForDisplay(0)).toBe(0);
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

    describe("applyColorChangeToUiDisplayData", () => {
        const mockUIDisplayData: UIDisplayData = [
            {
                name: "agent1",
                color: "#0000FF",
                displayStates: [
                    { name: "state1", id: "1", color: "#0000FF" },
                    { name: "state2", id: "2", color: "#0000FF" },
                ],
            },
            {
                name: "agent2",
                color: "#FF0000",
                displayStates: [
                    { name: "state3", id: "3", color: "#FF0000" },
                    { name: "state4", id: "4", color: "#FF0000" },
                ],
            },
        ];

        it("should update agent color when tags include empty string", () => {
            const colorChange = {
                color: "#00FF00",
                agent: {
                    name: "agent1",
                    tags: [""],
                },
            };

            const result = applyColorChangeToUiDisplayData(
                colorChange,
                mockUIDisplayData
            );

            expect(result[0].color).toBe("#00FF00");
            expect(result[1].color).toBe("#FF0000");
        });

        it("should update specific display states based on tags", () => {
            const colorChange = {
                color: "#FFFF00",
                agent: {
                    name: "agent1",
                    tags: ["state1"],
                },
            };

            const result = applyColorChangeToUiDisplayData(
                colorChange,
                mockUIDisplayData
            );

            expect(result[0].displayStates[0].color).toBe("#FFFF00"); // state1 updated
            expect(result[0].displayStates[1].color).toBe("#0000FF"); // state2 unchanged
        });

        it("should update multiple display states for agents with multiple tags", () => {
            const colorChange = {
                color: "#800080",
                agent: {
                    name: "agent1",
                    tags: ["state1", "state2"],
                },
            };

            const result = applyColorChangeToUiDisplayData(
                colorChange,
                mockUIDisplayData
            );

            expect(result[0].displayStates[0].color).toBe("#800080");
            expect(result[0].displayStates[1].color).toBe("#800080");
        });

        it("should not modify data when agent name does not match", () => {
            const colorChange = {
                color: "#FFA500",
                agent: {
                    name: "nonexistentAgent",
                    tags: [""],
                },
            };

            const result = applyColorChangeToUiDisplayData(
                colorChange,
                mockUIDisplayData
            );

            expect(result).toEqual(mockUIDisplayData);
        });
    });
});

describe("User Url handling", () => {
    describe("urlCheck", () => {
        it("returns strings that match the regex", () => {
            const shouldMatch = [
                "https://aics-simularium-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium",
                "https://aics-simularium-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.json",
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
            "https://aics-simularium-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium",
            "https://aics-simularium-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.json",
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
        it("returns undefined if not google drive url", () => {
            const id = "id";
            const urls = [
                `https://blah/${id}/view`,
                `https://amazon.com/${id}`,
            ];
            const result = urls.map((url) => getGoogleDriveFileId(url));
            expect(result).toEqual(Array(urls.length).fill(undefined));
        });
    });

    describe("getFileIdFromUrl", () => {
        it("returns an id if the URL is a Google Drive URL", () => {
            const url = "https://drive.google.com/file/d/123456789";
            expect(getFileIdFromUrl(url)).toBe("123456789");
        });
        it("returns file name if the URL is not a Google Drive URL and has a query string", () => {
            const url =
                "https://s3.amazonaws.com/trajectory/vivarium_ecoli.simularium?city=seattle";
            expect(getFileIdFromUrl(url)).toBe("vivarium_ecoli.simularium");
        });
        it("returns file name if the URL is not a Google Drive URL and does not have a query string", () => {
            const url =
                "https://s3.amazonaws.com/trajectory/vivarium_ecoli.simularium";
            expect(getFileIdFromUrl(url)).toBe("vivarium_ecoli.simularium");
        });
    });

    describe("getRedirectUrl", () => {
        it("returns empty string for a URL that shouldn't be redirected", () => {
            const url =
                "https://s3.amazonaws.com/trajectory/vivarium_ecoli.simularium";
            const fileName = "vivarium_ecoli.simularium";
            expect(getRedirectUrl(url, fileName)).toBe("");
        });
        it("replaces the trajUrl param in current URL with a trajFileName param if URL is listed in USER_TRAJ_REDIRECTS", () => {
            const fileName = "testFileName";
            const url = USER_TRAJ_REDIRECTS[0];
            window.history.replaceState({}, "", `/viewer?trajUrl=${url}`);

            const redirectUrl = getRedirectUrl(url, fileName);
            const expected =
                "http://localhost/viewer?trajFileName=testFileName";
            expect(redirectUrl).toBe(expected);
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
    describe("isOnlineTrajectory", () => {
        it("it returns true if the trajectory is hosted online", () => {
            const cloudTrajectoryUrl = `simularium?${URL_PARAM_KEY_USER_URL}=url`;
            const result = isOnlineTrajectory(cloudTrajectoryUrl);
            expect(result).toBeTruthy;
        });
        it("true if the trajectory is one of our networked models", () => {
            const networkedUrl = `simularium?${URL_PARAM_KEY_FILE_NAME}=url`;
            const result = isOnlineTrajectory(networkedUrl);
            expect(result).toBeTruthy;
        });
        it("it returns false if no relevant url params are present", () => {
            const url = `simularium?other_url_param=value`;
            const result = isOnlineTrajectory(url);
            expect(result).toBeFalsy;
        });
    });
    describe("getIconGlyphClasses", () => {
        it("returns a string of icon-moon, anticon, and the passed in glyph", () => {
            const glyphClassName = getIconGlyphClasses(IconGlyphs.StarEmpty);
            expect(glyphClassName).toEqual("icon-moon anticon star-empty-icon");
        });
    });
    describe("formatFloatForDisplay", () => {
        it("returns a string with the requisite number of sig figs as is", () => {
            expect(formatFloatForDisplay(1.23)).toBe("1.23");
        });
        it("returns zero if given zero", () => {
            expect(formatFloatForDisplay(0)).toBe("0");
        });
        it("returns a float with less than the requisite number of sig figs as is", () => {
            expect(formatFloatForDisplay(1.2)).toBe("1.2");
        });
        it("rounds a float with greater than the requisite number of sig figs", () => {
            expect(formatFloatForDisplay(1.234123)).toBe("1.23");
        });
        it("returns an integer with the requisite number of sig figs as is", () => {
            expect(formatFloatForDisplay(123)).toBe("123");
        });
        it("returns an integer with less than the requisite number of sig figs as is", () => {
            expect(formatFloatForDisplay(12)).toBe("12");
        });
        it("does not include unnecessary zeros", () => {
            expect(formatFloatForDisplay(1.20000001)).toBe("1.2");
        });
    });

    describe("copyToClipboard", () => {
        beforeAll(() => {
            // Mock the clipboard API
            Object.defineProperty(navigator, "clipboard", {
                value: {
                    writeText: jest.fn(),
                },
                writable: true,
            });
        });

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should copy text to clipboard", async () => {
            const text = "Hello, World!";

            await copyToClipboard(text);

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
        });

        it("should handle error if writing to clipboard fails", async () => {
            const text = "Hello, World!";
            const error = new Error("Failed to write to clipboard");
            console.error = jest.fn();

            (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
                error
            );

            await copyToClipboard(text);

            expect(console.error).toHaveBeenCalledWith(
                "Failed to copy text: ",
                error
            );
        });
    });

    describe("getUrlParamValue", () => {
        it("should return the value of the given parameter from the URL", () => {
            const url = "https://example.com?param1=value1&param2=value2";
            const param = "param1";
            const result = getUrlParamValue(url, param);
            expect(result).toBe("value1");
        });

        it("should return null if the parameter does not exist in the URL", () => {
            const url = "https://example.com?param1=value1&param2=value2";
            const param = "param3";
            const result = getUrlParamValue(url, param);
            expect(result).toBeNull();
        });

        it("should return null if the URL has no parameters", () => {
            const url = "https://example.com";
            const param = "param1";
            const result = getUrlParamValue(url, param);
            expect(result).toBeNull();
        });

        it("should return null if param is an empty string", () => {
            const url = "https://example.com?param1=value1&param2=value2";
            const param = "";
            const result = getUrlParamValue(url, param);
            expect(result).toBeNull();
        });

        it("should return null if value is an empty string", () => {
            const url = "https://example.com?param1=&param2=value2";
            const param = "param1";
            const result = getUrlParamValue(url, param);
            expect(result).toBe("");
        });

        it("should handle parameters with special characters", () => {
            const url = "https://example.com?param%201=value%201&param2=value2";
            const param = "param 1";
            const result = getUrlParamValue(url, param);
            expect(result).toBe("value 1");
        });
    });
    describe("roundToTimeStepPrecision", () => {
        it("should round the input to the precision of the timestep", () => {
            const input = 1.23456789;
            const timestep = 0.1;
            const result = roundToTimeStepPrecision(input, timestep);
            expect(result).toBe(1.2);
            expect(result.toString().split(".")[1].length).toEqual(
                timestep.toString().split(".")[1].length
            );
        });
        it("will return no decimal places if the timestep is an integer", () => {
            const input = 1.23456789;
            const timestep = 1;
            const result = roundToTimeStepPrecision(input, timestep);
            expect(result).toBe(1);
        });
    });
    describe("compareAgentTrees", () => {
        it("should return false if the arrays are different lengths", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [],
                    color: "",
                },
            ];
            const secondUIData: UIDisplayData = [];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(false);
        });
        it("should return false if the names are different", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [],
                    color: "",
                },
            ];
            const secondUIData: UIDisplayData = [
                {
                    name: "b",
                    displayStates: [],
                    color: "",
                },
            ];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(false);
        });
        it("should return false if some entry names match, but others don't", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [],
                    color: "",
                },
                {
                    name: "b",
                    displayStates: [],
                    color: "",
                },
            ];
            const secondUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [],
                    color: "",
                },
                {
                    name: "c",
                    displayStates: [],
                    color: "",
                },
            ];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(false);
        });
        it("should return false if displayState lengths don't match", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [],
                    color: "",
                },
            ];
            const secondUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [{ name: "b", id: "1", color: "" }],
                    color: "",
                },
            ];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(false);
        });
        it("should return false if displayState names don't match", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [{ name: "name", id: "1", color: "" }],
                    color: "",
                },
            ];
            const secondUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [
                        { name: "different name", id: "1", color: "" },
                    ],
                    color: "",
                },
            ];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(false);
        });
        it("should return false if displayState ids don't match", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [{ name: "name", id: "id", color: "" }],
                    color: "",
                },
            ];
            const secondUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [
                        { name: "name", id: "different id", color: "" },
                    ],
                    color: "",
                },
            ];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(false);
        });
        it("should return true if the agent tree structures match", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [{ name: "name", id: "id", color: "" }],
                    color: "",
                },
            ];
            const secondUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [{ name: "name", id: "id", color: "" }],
                    color: "",
                },
            ];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(true);
        });
        it("should return true if the agent tree structures match but have different color properties", () => {
            const firstUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [
                        {
                            name: "name",
                            id: "id",
                            color: "red",
                        },
                    ],
                    color: "red",
                },
            ];
            const secondUIData: UIDisplayData = [
                {
                    name: "a",
                    displayStates: [
                        {
                            name: "name",
                            id: "id",
                            color: "blue",
                        },
                    ],
                    color: "blue",
                },
            ];
            const result = compareAgentTrees(firstUIData, secondUIData);
            expect(result).toBe(true);
        });
    });
});
