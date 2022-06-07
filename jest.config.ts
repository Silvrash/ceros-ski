export default {
    preset: "ts-jest",
    clearMocks: true,
    resetMocks: true,
    testEnvironment: "jsdom",
    globals: {
        "ts-jest": {
            isolatedModules: true,
        },
        NODE_ENV: "test",
    },
};
