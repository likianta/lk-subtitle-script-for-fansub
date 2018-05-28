module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        sourceType: 'module'
    },
    rules: {
        indent: ['warn', 4, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'windows'],
        quotes: ['off', 'single'],
        semi: ['error', 'always'],
        /////////////////////////
        //// Custom Rules ////
        ////////////////////////
        'no-unused-vars': [
            // https://eslint.org/docs/rules/no-unused-vars
            'warn',
            {
                vars: 'local', // 只对局部变量（或函数）检查其是否从未被使用；对于全局变量则不要
                // ↑ 为什么？因为全局变量一般先声明出来，并不会立刻着急用；如果这个报错的话看着很讨厌，会增加不必要的焦虑感……
                args: 'after-used',
                ignoreRestSiblings: false // 当批量声明变量时，允许有些变量只声明而不赋值
            }
        ],
        'no-fallthrough': 'off', // 允许switch...case垂降
        'no-inner-declarations': 'warn', // 对于代码块内声明函数的行为予以警告（但不报错），以提示我尽快修复
        'no-control-regex': 'off',
        'no-empty': 'off'
    }
};