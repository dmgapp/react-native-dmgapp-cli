var exec = require( 'child_process' ).exec;

function installPackage() {
  exec( 'npm install' , function ( e , stdout , stderr ) {
    if ( e ) {
      console.log( stdout );
      console.error( stderr );
      console.error( 'npm 执行失败!' );
      process.exit( 1 );
    }
  } );
}

installPackage();