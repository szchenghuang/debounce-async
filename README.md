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

Say `d` is a debounced function of `f`, `var d = debounce(f, 400);`, and `d` is
called evenly during the first and the third seconds as the timeline below.

seconds elapsed    0        1         2         3         4
d called           d d d d d - - - - - d d d d d - - - - - 
f called                       f                   f

Only the last of the five sequential calls to `d` actually invokes `f`. The rest
four are simply ignored.

When it comes to promise-based asynchronous functions, this package ignores
function calls by rejecting the promises. The original fullfillment is bypassed,
and simply rejected with a customizable object for the sake of telling which/when
an ignorance occurs.

## Installation ##

```sh
npm install debounce-async --save
```

## Usage ##

```js
var debounce = require( 'debounce-async' );

/**
  * debounce(func, [wait=0], [options={}])
  *
  * @param {Function} func The function to debounce.
  * @param {number} [wait=0] The number of milliseconds to delay.
  * @param {Object} [options={}] The options object.
  * @param {boolean} [options.leading=false] Specify invoking on the leading edge of the timeout.
  * @param {cancelObj} [options.cancelObj='canceled'] Specify the error object to be rejected.
  * @returns {Function} Returns the new debounced function.
  */
```

This package aims at maintaining the same signature of the `debounce` function from `lodash`.
Please report if there is discrenency.

## Example ##

### Promise ###

```js
var debounce = require( 'debounce-async' );

var f = value => new Promise( resolve => setTimeout( () => resolve( value ), 50 ) );
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
var f = async value => await new Promise( resolve => setTimeout( () => resolve( value ), 50 ) );
```

Same output can be expected after execution.

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

