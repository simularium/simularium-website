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
            "branches": 50,
            "functions": 50,
            "lines": 50,
            "statements": 50
        },
        "./src/state/*/selectors.ts": {
            // "branches": 80,
            "lines": 60,
        },
        "./src/containers/*/selectors.ts": {
            "branches": 50,
            "functions": 50,
            "lines": 50,
            "statements": 50
        }
    }
};