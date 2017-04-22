// https://github.com/chriso/lru
const assert = require("assert");
const vows = require("vows");
const {LRUMapLike} = require("../lib/lru-map-like");
const suite = vows.describe("LRU");

suite.addBatch({
    "clear() sets the cache to its initial state": function() {
        const lru = new LRUMapLike(2);

        const json1 = JSON.stringify(lru);

        lru.set("foo", "bar");
        lru.clear();
        const json2 = JSON.stringify(lru);
        assert.equal(json2, json1);
    }
});

suite.addBatch({
    "setting keys doesn't grow past max size": function() {
        const lru = new LRUMapLike(3);
        assert.equal(0, lru.size);
        lru.set("foo1", "bar1");
        assert.equal(1, lru.size);
        lru.set("foo2", "bar2");
        assert.equal(2, lru.size);
        lru.set("foo3", "bar3");
        assert.equal(3, lru.size);

        lru.set("foo4", "bar4");
        assert.equal(3, lru.size);
    }
});

suite.addBatch({
    "lru invariant is maintained for set()": function() {
        const lru = new LRUMapLike(2);

        lru.set("foo1", "bar1");
        lru.set("foo2", "bar2");
        lru.set("foo3", "bar3");
        lru.set("foo4", "bar4");

        assert.deepEqual(["foo3", "foo4"], lru.keys());
    }
});

suite.addBatch({
    "ovrewriting a key updates the value": function() {
        const lru = new LRUMapLike(2);
        lru.set("foo1", "bar1");
        assert.equal("bar1", lru.get("foo1"));
        lru.set("foo1", "bar2");
        assert.equal("bar2", lru.get("foo1"));
    }
});

suite.addBatch({
    "lru invariant is maintained for get()": function() {
        const lru = new LRUMapLike(2);

        lru.set("foo1", "bar1");
        lru.set("foo2", "bar2");

        lru.get("foo1"); // now foo2 should be deleted instead of foo1

        lru.set("foo3", "bar3");

        assert.deepEqual(["foo1", "foo3"], lru.keys());
    },
    "lru invariant is maintained after set(), get() and delete()": function() {
        const lru = new LRUMapLike(2);
        lru.set("a", 1);
        lru.set("b", 2);
        assert.deepEqual(lru.get("a"), 1);
        lru.delete("a");
        lru.set("c", 1);
        lru.set("d", 1);
        assert.deepEqual(["c", "d"], lru.keys());
    }
});

suite.addBatch({
    "lru invariant is maintained in the corner case size == 1": function() {
        const lru = new LRUMapLike(1);

        lru.set("foo1", "bar1");
        lru.set("foo2", "bar2");

        lru.get("foo2"); // now foo2 should be deleted instead of foo1

        lru.set("foo3", "bar3");

        assert.deepEqual(["foo3"], lru.keys());
    }
});

suite.addBatch({
    "peek() returns item value without changing the order": function() {
        const lru = new LRUMapLike(2);
        lru.set("foo", "bar");
        lru.set("bar", "baz");
        assert.equal(lru.peek("foo"), "bar");
        lru.set("baz", "foo");
        assert.equal(lru.get("foo"), null);
    }
});

suite.addBatch({
    "idempotent changes": {
        "set() and delete() on empty LRU is idempotent": function() {
            const lru = new LRUMapLike();
            const json1 = JSON.stringify(lru);

            lru.set("foo1", "bar1");
            lru.delete("foo1");
            const json2 = JSON.stringify(lru);

            assert.deepEqual(json2, json1);
        },

        "2 set()s and 2 delete()s on empty LRU is idempotent": function() {
            const lru = new LRUMapLike();
            const json1 = JSON.stringify(lru);

            lru.set("foo1", "bar1");
            lru.set("foo2", "bar2");
            lru.delete("foo1");
            lru.delete("foo2");
            const json2 = JSON.stringify(lru);

            assert.deepEqual(json2, json1);
        },

        "2 set()s and 2 delete()s (in opposite order) on empty LRU is idempotent": function() {
            const lru = new LRUMapLike();
            const json1 = JSON.stringify(lru);

            lru.set("foo1", "bar1");
            lru.set("foo2", "bar2");
            lru.delete("foo2");
            lru.delete("foo1");
            const json2 = JSON.stringify(lru);

            assert.deepEqual(json2, json1);
        }
    }
});


suite.export(module);
