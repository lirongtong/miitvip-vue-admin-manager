const resolve = (module) => require.resolve(module);
module.exports = function(modules) {
    const presets = [
        [resolve("@babel/preset-env"), {
            spec: true,
            modules,
            targets: {
                browsers: [
                    "last 3 Chrome versions",
                    "last 3 Firefox versions",
                    "Safari >= 10",
                    "Explorer >= 11",
                    "Edge >= 12",
                    "iOS >= 10",
                    "Android >= 6",
                    '> 1%',
                ]
            }
        }]
    ];
    const plugins = [
        [resolve("@babel/plugin-transform-typescript"), {isTSX: true}],
        [resolve("@vue/babel-plugin-jsx"), {mergeProps: false}],
        resolve("@babel/plugin-proposal-optional-chaining"),
        resolve("@babel/plugin-transform-object-assign"),
        resolve("@babel/plugin-proposal-object-rest-spread"),
        resolve("@babel/plugin-proposal-export-default-from"),
        resolve("@babel/plugin-proposal-export-namespace-from"),
        resolve("@babel/plugin-proposal-class-properties"),
        resolve("@babel/plugin-syntax-dynamic-import"),
        [resolve("@babel/plugin-transform-runtime"), {helpers: false}]
    ];
    return {
        presets,
        plugins
    }
};