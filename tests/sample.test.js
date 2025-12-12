const { main } = require('../src/index');

test('main runs without throwing', () => {
    expect(() => main()).not.toThrow();
});
