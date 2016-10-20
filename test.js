#!/usr/bin/env node

var ProgressBar = require( 'progress' );

var bar = new ProgressBar( '  [:bar] :percent :elapseds' , 10 );

var id = setInterval( function () {
  bar.tick();
  if ( bar.complete ) {
    clearInterval( id );
  }
} , 100 );