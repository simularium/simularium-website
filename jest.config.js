module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "esbuild-jest",
    },
    testEnvironment: "jsdom",

    // From https://jestjs.io/docs/webpack#mocking-css-modules
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/scripts/jestAssetTransformer.js",
        "\\.(css|less)$": "identity-obj-proxy",
    },
    coverageThreshold: {
        global: {
            lines: 25,
            statements: 50,
        },
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
