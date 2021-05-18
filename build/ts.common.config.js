const fs = require('fs');
const path = require('path');

const configuration = (modules) => {
    let config = {};
    const file = path.resolve(path.dirname(process.cwd()), 'tsconfig.json');
    if (fs.existsSync(file)) {
        config = require(file);
        if (config.include && config.include instanceof Array) config.include.pop();
    }
    return Object.assign({...config.compilerOptions}, {
        noUnusedParameters: true,
        noUnusedLocals: true,
        strictNullChecks: true,
        target: 'esnext',
        jsx: 'preserve',
        moduleResolution: 'node',
        declaration: true,
        declarationDir: modules === false ? 'es' : 'lib',
        allowSyntheticDefaultImports: true
    });
};

module.exports = configuration;