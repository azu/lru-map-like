const LRUMapLike = require("../src/lru-map-like");
const assert = require("assert");
describe("LRUMapLike", () => {
    it("work as LRU", () => {
        const cache = new LRUMapLike(3);
        cache.set(0, "a");
        cache.set(1, "b");
        cache.set(2, "c");
        assert.deepEqual(cache.values(), ["a", "b", "c"]);
        cache.set(-1, "ADDED");
        assert.deepEqual(cache.values(), ["b", "c", "ADDED"]);
    });
    it("support non-string(object) key", () => {
        const cache = new LRUMapLike();
        const keyObject = {};
        const valueObject = {};
        cache.set(keyObject, valueObject);
        assert.strictEqual(cache.get(keyObject), valueObject);
        assert.notStrictEqual(cache.get({}), valueObject);
    });
    it("support non-string(symbol) key", () => {
        const cache = new LRUMapLike();
        const keyObject = Symbol("key");
        const valueObject = {};
        cache.set(keyObject, valueObject);
        assert.strictEqual(cache.get(keyObject), valueObject);
        assert.notStrictEqual(cache.get(Symbol("another key")), valueObject);
    });
});

