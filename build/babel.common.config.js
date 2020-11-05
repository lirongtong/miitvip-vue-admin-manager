const resolve = (module) => require.resolve(module);
module.exports = {
    "presets": [
        [resolve("@babel/preset-env"), {
            "spec": true,
            "targets": {
                "browsers": [
                    "last 3 Chrome versions",
                    "last 3 Firefox versions",
                    "Safari >= 10",
                    "Explorer >= 11",
                    "Edge >= 12",
                    "iOS >= 10",
                    "Android >= 6",
                    '> 1%',
                ]
            },
            "useBuiltIns": "usage",
            "corejs": 3
        }],
        resolve("@babel/preset-typescript")
    ],
    "plugins": [
        [resolve("@babel/plugin-transform-typescript"), {"isTSX": true}],
        [resolve("@vue/babel-plugin-jsx"), {"mergeProps": false}],
        resolve("@babel/plugin-proposal-optional-chaining"),
        resolve("@babel/plugin-transform-object-assign"),
        resolve("@babel/plugin-proposal-object-rest-spread"),
        resolve("@babel/plugin-proposal-export-default-from"),
        resolve("@babel/plugin-proposal-export-namespace-from"),
        [resolve("@babel/plugin-proposal-class-properties"), {"loose": true}],
        resolve("@babel/plugin-syntax-dynamic-import"),
        [resolve("@babel/plugin-transform-runtime"), {"helpers": false}]
    ],
    "comments": false
};