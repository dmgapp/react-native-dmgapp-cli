'use strict';

var fs=require('fs');
var path   = require( 'path' );

/**
 *
 * @returns {string[]|string|String|*}
 * @constructor
 */
var HELP_PATH = function () {
  return path.resolve(
    __dirname,
    'help.txt'
  );
};

function help(){
  fs.readFile(HELP_PATH(),'utf-8',function(err,data){
    if(err){
      console.error(err);
    }
    else{
      console.log(data);
    }
  });
}

module.exports=help;