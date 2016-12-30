# lru-map-like

LRU cache top on Map-like. Support non-string key.

## Features

- Based on [Map-like](https://github.com/azu/map-like)
    - It means that allow to use object as key
- Tiny size: 2kb

```
env  bundle   minify   gzip
--   13.8 kB  6.32 kB  2.34 kB
```

## Motivation

I have used [isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache "isaacs/node-lru-cache"), but this library is large for me.

```
env  bundle   minify   gzip
--   43.9 kB  27.5 kB  10.1 kB
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install lru-map-like

## Usage

```js
const LRUMapLike = require("lru-map-like");
const cache = new LRUMapLike(3);
cache.set(0, "a");
cache.set(1, "b");
cache.set(2, "c");
assert.deepEqual(cache.values(), ["a", "b", "c"]);
// over limit(3)
cache.set(-1, "ADDED");
assert.deepEqual(cache.values(), ["b", "c", "ADDED"]);
```

### non-string key supported

Object as key are fully supported.
It is [map-like](https://github.com/azu/map-like "map-like") feature.

```js
const LRUMapLike = require("lru-map-like");
const cache = new LRUMapLike();
const keyObject = {};
const valueObject = {};
cache.set(keyObject, valueObject);
assert.strictEqual(cache.get(keyObject), valueObject);
assert.notStrictEqual(cache.get({}), valueObject);
```

## API

### `LRUMapLike`

LRU cache implementation
Based on <https://github.com/rse/cache-lru>

#### `limit`

set the cache limit

Returns: **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### `limit`

set the cache limit

**Parameters**

-   `max`: **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### `onDispose(cb: Function): LRUMapLike`

configure function to be called before item is disposed

**Parameters**

-   `cb`: **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)**

Returns: **LRUMapLike**

#### `size`

get size of items

Returns: **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### `keys(): Array<Any>`

get keys of all items in order

Returns: **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Any>**

#### `values(): Array<Any>`

get values of all items in order

Returns: **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Any>**

#### `forEach(cb: function (value, key), ctx: Any): Any`

iterate over all items in order

**Parameters**

-   `cb`: **function (value, key)**
-   `ctx`: **Any**

Returns: **Any**

#### `has(key: Any): boolean`

check whether item exists under key

**Parameters**

-   `key`: **Any**

Returns: **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

#### `peek(key: Any): Any`

get value under key without promoting item

**Parameters**

-   `key`: **Any**

Returns: **Any**

#### `get(key: Any): (Any | undefined)`

get value under key

**Parameters**

-   `key`: **Any**

Returns: **(Any | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))**

#### `set(key: Any, val: Any): LRUMapLike`

set key as value

**Parameters**

-   `key`: **Any** - string, object etc..
-   `val`: **Any**

Returns: **LRUMapLike**

#### `delete(key: Any): LRUMapLike`

delete item under key

**Parameters**

-   `key`: **Any**

Returns: **LRUMapLike**

#### `clear(): LRUMapLike`

delete all items

Returns: **LRUMapLike**

## Changelog

See [Releases page](https://github.com/azu/lru-map-like/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/lru-map-like/issues).

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Author

-   [github/azu](https://github.com/azu)
-   [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu

This library based on <https://github.com/rse/cache-lru>

> Copyright (c) 2015-2016 Ralf S. Engelschall (<http://engelschall.com/>)
