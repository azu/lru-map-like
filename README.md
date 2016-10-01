# lru-map-like

LRU cache top on Map-like. Support non-string key.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install lru-map-like

## Usage

```js
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
const cache = new LRUMapLike();
const keyObject = {};
const valueObject = {};
cache.set(keyObject, valueObject);
assert.strictEqual(cache.get(keyObject), valueObject);
assert.notStrictEqual(cache.get({}), valueObject);
```

## API

## Changelog

See [Releases page](https://github.com/azu/lru-map-like/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/lru-map-like/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu

This library based on https://github.com/rse/cache-lru
> Copyright (c) 2015-2016 Ralf S. Engelschall (http://engelschall.com/)
