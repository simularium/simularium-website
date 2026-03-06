module.exports = {
    preset: "ts-jest/presets/default-esm",
    transform: {
        "^.+\\.(ts|tsx)?$": ["ts-jest", { useESM: true, babelConfig: true }],
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    // From https://jestjs.io/docs/webpack#mocking-css-modules
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/scripts/jestAssetTransformer.js",
        "\\.(css|less)$": "identity-obj-proxy",
        "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
        "^uuid/(.*)$": "<rootDir>/node_modules/uuid/dist/index.js",
        "^lodash$": "lodash-es",
        "^lodash/(.*)$": "lodash-es/$1",
    },
    coverageThreshold: {
        "./src/state/*/selectors/index.ts": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
        "./src/containers/*/selectors.ts": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
        "./src/util": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/three/examples/(?!jsm/)"],
    setupFiles: ["<rootDir>/src/test/testSetup.ts"],
};
