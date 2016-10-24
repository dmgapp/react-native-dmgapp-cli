#!/usr/bin/env node

var Loading = require( './common/loading' );

Loading.start( '从git下载' );

setTimeout( function () {
  Loading.stop();
} , 5000 );