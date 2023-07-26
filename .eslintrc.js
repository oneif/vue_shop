module.exports = {
    extends: [
        "standard",
        "eslint:recommended",
        "plugin:vue/essential"
    ],

    // root: true,

    env: {
        node: true,
        browser: true,
        es6: true
    },

    parser: "Espree",

    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        },
        parser: "@babel/eslint-parser"
    },

    globals: {
        data1: "writable",
        data2: "readonly"
    },

    rules: {
        indent: ["error", 4],
        quotes: [
            "error",
            "double"
        ],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
    },

    extends: [
        "standard",
        "eslint:recommended",
        "plugin:vue/essential",
        "@vue/standard"
    ],

    root: true
}
