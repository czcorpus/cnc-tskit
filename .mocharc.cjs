module.exports = {
    extension: ['ts'],
    spec: ['./test/**/*.ts'],
    require: ['ts-node/register'],
    loader: ['ts-node/esm']
};