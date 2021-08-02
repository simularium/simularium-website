module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "jsdom",
    
    // From https://jestjs.io/docs/webpack#mocking-css-modules
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/scripts/jestAssetTransformer.js",
        "\\.(css|less)$": "identity-obj-proxy"
    },
    coverageThreshold: {
        "global": {
            "lines": 50,
            "statements": 50
        },
        // TODO: Bring this back and change to 100% once the basic selectors are successfully ignored
        // "./src/state/*/selectors.ts": {
        //     "lines": 60,
        // },
        "./src/containers/*/selectors.ts": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        },
        "./src/util": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        }
    }
};