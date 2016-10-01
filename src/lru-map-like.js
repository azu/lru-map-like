// MIT License
const MapLike = require("map-like");
/**
 * LRU cache implementation
 * Based on https://github.com/rse/cache-lru
 * @public
 */
class LRUMapLike {
    /**
     * @param {number} max max size of LRU cache - default: Infinity
     * @returns {LRUMapLike}
     */
    constructor(max = Infinity) {
        this._map = new MapLike();
        this._LRU = {newer: null};
        this._MRU = {older: null};
        this._LRU.newer = this._MRU;
        this._MRU.older = this._LRU;
        this._cur = 0;
        this._max = max;
        this._dispose = (/* key, val, op */) => {
        };
        return this;
    }

    /**
     * set the cache limit
     * @returns {number}
     * @public
     */
    get limit() {
        return this._max;
    }

    /**
     * set the cache limit
     * @param {number} max
     * @public
     */
    set limit(max) {
        this._max = max;
        this._purge();
    }

    /**
     * configure function to be called before item is disposed
     * @param {Function} cb
     * @returns {LRUMapLike}
     * @public
     */
    onDispose(cb) {
        this._dispose = cb;
        return this;
    }

    /**
     * get size of items
     * @returns {number}
     * @public
     */
    get size() {
        return this._cur;
    }

    /**
     * get keys of all items in order
     * @returns {*[]}
     * @public
     */
    keys() {
        return this.forEach(function(val, key) {
            this.push(key);
        }, []).reverse();
    }

    /**
     * get values of all items in order
     * @returns {*[]}
     * @public
     */
    values() {
        return this.forEach(function(val /* , key */) {
            this.push(val);
        }, []).reverse();
    }

    /**
     * iterate over all items in order
     * @param {function(value, key)} cb
     * @param {*} ctx
     * @returns {*}
     * @public
     */
    forEach(cb, ctx) {
        if (arguments < 2) {
            ctx = this;
        }
        let i = 0;
        let bucket = this._MRU.older;
        while (bucket !== this._LRU) {
            cb.call(ctx, bucket.val, bucket.key, i++);
            bucket = bucket.older;
        }
        return ctx;
    }

    /**
     * check whether item exists under key
     * @param {*} key
     * @returns {boolean}
     * @public
     */
    has(key) {
        return this._map.has(key);
    }

    /**
     * get value under key without promoting item
     * @param {*} key
     * @returns {*}
     * @public
     */
    peek(key) {
        const bucket = this._map.get(key);
        if (bucket === undefined) {
            return undefined;
        }
        return bucket.val;
    }

    /**
     * get value under key
     * @param {*} key
     * @returns {*|undefined}
     * @public
     */
    get(key) {
        const bucket = this._map.get(key);
        if (bucket === undefined) {
            return undefined;
        }
        this._promote(bucket);
        return bucket.val;
    }

    /**
     * set key as value
     * @param {*} key - string, object etc..
     * @param {*} val
     * @returns {LRUMapLike}
     * @public
     */
    set(key, val) {
        let bucket = this._map.get(key);
        if (bucket === undefined) {
            /*  insert new bucket  */
            bucket = {
                older: null,
                newer: null,
                key,
                val
            };
            this._map.set(key, bucket);
            this._attach(bucket);
            this._cur++;
            this._purge();
        } else {
            /*  replace existing bucket  */
            const valOld = bucket.val;
            bucket.val = val;
            this._promote(bucket);
            this._dispose.call(undefined, bucket.key, valOld, "set");
        }
        return this;
    }

    /**
     * delete item under key
     * @param {*} key
     * @returns {LRUMapLike}
     * @public
     */
    delete(key) {
        const bucket = this._map.get(key);
        if (bucket === undefined) {
            throw new Error("del: no such item");
        }
        this._map.delete(key);
        this._detach(bucket);
        this._cur--;
        this._dispose.call(undefined, key, bucket.val, "del");
        return this;
    }

    /**
     * delete all items
     * @returns {LRUMapLike}
     * @public
     */
    clear() {
        while (this._cur > 0) {
            this.delete(this._LRU.newer.key);
        }
        return this;
    }

    /**
     * @returns {Array}
     * @protected
     */
    toJSON() {
        return this._map.entries();
    }

    /**
     * @private
     */
    _purge() {
        while (this._cur > this._max) {
            this.delete(this._LRU.newer.key);
        }
    }

    /**
     * @param {*} bucket
     * @private
     */
    _promote(bucket) {
        /*  promote bucket to be MRU bucket  */
        this._detach(bucket);
        this._attach(bucket);
    }

    /**
     * @param {*} bucket
     * @private
     */
    _detach(bucket) {
        bucket.older.newer = bucket.newer;
        bucket.newer.older = bucket.older;
        bucket.older = null;
        bucket.newer = null;
    }

    /**
     * @param bucket
     * @private
     */
    _attach(bucket) {
        bucket.older = this._MRU.older;
        bucket.newer = this._MRU;
        bucket.newer.older = bucket;
        bucket.older.newer = bucket;
    }
}

module.exports = LRUMapLike;

