function debounce(
  func,
  wait = 0,
  {
    leading = false,
    cancelObj = 'canceled'
  } = {}
) {
  let timerId, latestResolve, shouldCancel

  return function ( ...args ) {
    if ( !latestResolve ) {
      return leading ?
        func.apply( this, args ) : new Promise( ( resolve, reject ) => {
          latestResolve = resolve
          timerId = setTimeout( invokeFunc.bind( this, args, resolve, reject ), wait )
        })
    }

    shouldCancel = true;
    return new Promise( ( resolve, reject ) => {
      latestResolve = resolve
      timerId = setTimeout( invokeFunc.bind( this, args, resolve, reject ), wait )
    })
  }

  function invokeFunc( args, resolve, reject ) {
    if ( shouldCancel && resolve !== latestResolve ) {
      reject( cancelObj )
    } else {
      func.apply( this, args ).then( resolve ).catch( reject )
      if ( resolve === latestResolve ) {
        shouldCancel = false
        clearTimeout( timerId )
        timerId = latestResolve = null
      }
    }
  }
}

export default debounce
