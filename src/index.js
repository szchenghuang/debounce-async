function debounce( func, wait = 0, { leading = false, cancelObj = 'canceled' } = {} ) {
  let timer, latestResolve, shouldCancel

  return function ( ...args ) {
    if ( !latestResolve ) {
      return leading ?
        func.apply( this, args ) : new Promise( ( resolve, reject ) => {
          latestResolve = resolve
          timer = setTimeout( exec.bind( this, args, resolve, reject ), wait )
        });
    }

    shouldCancel = true;
    return new Promise( ( resolve, reject ) => {
      latestResolve = resolve
      timer = setTimeout( exec.bind( this, args, resolve, reject ), wait )
    })
  }

  function exec( args, resolve, reject ) {
    if ( shouldCancel && resolve !== latestResolve ) {
      reject( cancelObj )
    } else {
      func.apply( this, args ).then( resolve ).catch( reject )
      if ( resolve === latestResolve ) {
        shouldCancel = false
        clearTimeout( timer )
        timer = latestResolve = null
      }
    }
  }
}

export default debounce
