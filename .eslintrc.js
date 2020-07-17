module.exports = {
    "globals": {
        "$statepipe": true,
        "$statepipeLog": true,
        "$statepipeAutoStart": true,
        "$statepipeStores": true,
        "$statepipeInstances": true
    },
    "env": {
        "browser": true,
        "node": true,
        "es2020": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "ignorePatterns": [
        "test-utils/**",
        "node_modules/**",
        "pages/**",
        "**/test/**"
    ],
    "rules": {
        "semi-style": ["error", "last"],
        "semi": ["error","always"]
    }
};
