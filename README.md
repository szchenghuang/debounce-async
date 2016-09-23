# debounce-async #

[![Build Status][travis_img]][travis_site]
[![NPM Package][npm_img]][npm_site]
[![Dependency status][david_img]][david_site]
[![devDependency status][david_dev_img]][david_dev_site]

[![NPM][nodei_img]][nodei_site]

A debounced function that delays invoking asynchronous functions.

## Preliminaries ##

A debounced function groups sequential calls to a function within a period. Only
the last call in the group is executed. The others are simply ignored as if no
calls to them ever happened.

When it comes to asynchronous functions, this package ignores a function call
by rejecting it. Its original fullfillment is bypassed. It is simply rejected,
with a customizable object to tell which is an ignorance.

## Installation ##

```sh
npm install debounce-async --save
```

## Usage ##

```js
var debounce = require( 'debounce-async' );

/**
 * debounce(func, [wait=0], [options={}])

 * func (Function): The function to debounce.
 * [wait=0] (number): The number of milliseconds to delay.
 * [options={}] (Object): The options object.
 * [options.leading=false] (boolean): Specify invoking on the leading edge of the timeout.
 * [options.cancelObj='canceled'] (object): Specify the rejected object when canceled.
 */
```

## Example ##

### Promise ###

```js
var debounce = require( 'debounce-async' );

var f = function( value ) {
  return new Promise( resolve => {
    setTimeout( () => {
      resolve( value );
    }, 50 );
  });
};

var debounced = debounce( f, 100 );

var promises = [ 'foo', 'bar' ].map( debounced );

promises.forEach( promise => {
  promise
    .then( res => {
      console.log( 'resolved:', res );
    })
    .catch( err => {
      console.log( 'rejected:', err );
    });
});

// Output:
// rejected: canceled
// resolved: bar
```

In the example above, `f` is an asynchronous function which returns a promise.
The promise is resolved with the input after 50ms. `debounced` is a debounced
function of `f` with a delay of 100ms.

The debounced function is called twice consecutively by the callback of
`Array.proptotype.map`, with `'foo'` and `'bar'` being the input value
respectively. The two returned promises are next fullfilled by printing the
resolved result or rejected error on the console.

This snippet results in the given output. The first promise was rejected while
the second one was resolved. It is because the second call comes before the delay
of 100ms since the first call fired.

### async/await ###

Same thing when it comes to asynchronous ES7 async/await functions. Take the
prior example and transform the `f` into an ES7 async function.

```js
var f = async function( value ) {
  return await new Promise( resolve => {
    setTimeout( () => {
      resolve( value );
    }, 50 );
  });
};
```

Same output is expected when running it.

## Test ##

```js
npm test

```
## License ##

MIT. See [LICENSE.md][license] for details.

[travis_img]: https://travis-ci.org/szchenghuang/debounce-async.svg?branch=master
[travis_site]: https://travis-ci.org/szchenghuang/debounce-async
[npm_img]: https://img.shields.io/npm/v/debounce-async.svg
[npm_site]: https://www.npmjs.org/package/debounce-async
[nodei_img]: https://nodei.co/npm/debounce-promise.png
[nodei_site]: https://nodei.co/npm/debounce-async
[david_img]: https://david-dm.org/szchenghuang/debounce-async/status.svg
[david_site]: https://david-dm.org/szchenghuang/debounce-async/
[david_dev_img]: https://david-dm.org/szchenghuang/debounce-async/dev-status.svg
[david_dev_site]: https://david-dm.org/szchenghuang/debounce-async/?type=dev
[license]: http://github.com/szchenghuang/debounce-async/blob/master/LICENSE.md

