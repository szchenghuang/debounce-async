import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'babel-polyfill';

should();
chai.use( chaiAsPromised );

import PromiseResults from 'promise-results';
import debounce from '../index'

describe( 'debounce-async', function() {
  describe( 'feature test', function() {
    function sleep( ms ) {
      return new Promise( resolve => setTimeout( resolve, ms ) )
    }

    it('returns the result of a single operation', async () => {
      const debounced = debounce(async value => value, 100)
      const promise = debounced('foo')
      const result = await promise

      result.should.deep.equal( 'foo' )
    });

    it('pending promises are canceled', async () => {
      const debounced = debounce(async value => value, 100)
      const promises = ['foo', 'bar'].map(debounced)

      PromiseResults(promises)
        .then( res => {
          res.should.deep.equal(['canceled', 'bar'])
        });
    })

    it('Promise.all exits once the first pending promise is canceled ', async () => {
      const debounced = debounce(async value => value, 100)
      const promises = ['foo', 'bar'].map(debounced)

      try {
        const results = await Promise.all( promises )
      } catch ( err ) {
        err.should.deep.equal('canceled')
      }
    })

    it('if leading is true', async () => {
      const debounced = debounce(async value => value, 100, {leading: true})
      const promises = ['foo', 'bar', 'baz'].map(debounced)

      PromiseResults(promises)
        .then( res => {
          res.should.deep.equal(['foo', 'canceled', 'baz'])
        });
    })

    it('do not call the given function repeatedly', async () => {
      let callCount = 0
      const debounced = debounce(async value => { callCount++; return value }, 100)
      const promises = [1,2,,].map(debounced)

      PromiseResults(promises)
        .then( res => {
          res.should.deep.equal(['canceled',2,,])
          callCount.should.deep.equal(1)
        });
    })

    it('does not call the given function again after the timeout when leading=true if executed only once', async () => {
      let callCount = 0
      const debounced = debounce(async () => callCount++, 100, {leading: true})
      await debounced()
      await sleep(200)
      callCount.should.deep.equal(1)
    })

    it('waits until the wait time has passed', async () => {
      let callCount = 0
      const debounced = debounce(async () => callCount++, 10)

      debounced()
      callCount.should.deep.equal(0)
      await sleep(20)
      callCount.should.deep.equal(1)
    })

    it('supports passing function as wait parameter', async () => {
      let callCount = 0
      const debounced = debounce(async () => callCount++, () => 10)

      debounced()
      callCount.should.deep.equal(0)
      await sleep(20)
      callCount.should.deep.equal(1)
    })

    it('calls the given function again if wait time has passed', async () => {
      let callCount = 0
      const debounced = debounce(async () => callCount++, 10)
      debounced()

      await sleep(20)
      callCount.should.deep.equal(1)

      debounced()

      await sleep(20)
      callCount.should.deep.equal(2)
    })

    it('maintains the context of the original function', async () => {
      const context = {
        foo: 1,
        debounced: debounce(async function () { await this.foo++ }, 10)
      }

      context.debounced()

      await sleep(20)
      context.foo.should.deep.equal(2)
    })

    it('maintains the context of the original function when leading is true', async () => {
      const context = {
        foo: 1,
        debounced: debounce(async function () { await this.foo++ }, 10, {leading: true})
      }

      await context.debounced()

      context.foo.should.deep.equal(2)
    })
  });
});
