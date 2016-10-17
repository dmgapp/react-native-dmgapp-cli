#!/usr/bin/env node

/**
 * Used arguments:
 *   -v --version - to print current version of react-native-cli and react-native dependency
 */
'use strict';

var fs            = require( 'fs' );
var path          = require( 'path' );
var exec          = require( 'child_process' ).exec;
var help          = require( "./common/help.js" );
var projectRename = require( "./common/project_rename" );

var argv = require( 'minimist' )( process.argv.slice( 2 ) );

if ( argv[ 'h' ] ) {
  help();
}

var commands = argv._;
if ( commands.length === 0 ) {
  console.error(
    'You did not pass any commands, did you mean to run `react-native init`?'
  );
  process.exit( 1 );
}

switch ( commands[ 0 ] ) {
  case 'init':
    if ( !commands[ 1 ] ) {
      console.error(
        'Usage: react-native init <ProjectName> [--verbose]'
      );
      process.exit( 1 );
    } else {
      init( commands[ 1 ] , argv.verbose , argv.version );
    }
    break;
  default:
    console.error(
      'Command `%s` unrecognized. ' +
      'Did you mean to run this inside a react-native project?' ,
      commands[ 0 ]
    );
    process.exit( 1 );
    break;
}

function init( name , verbose , rnPackage ) {
  validatePackageName( name );

  if ( fs.existsSync( name ) ) {
    //createAfterConfirmation( name , verbose , rnPackage );
    console.log( 'Project Name has Exists!' );
    process.exit();
  } else {
    createProject( name );
  }
}

function validatePackageName( name ) {
  if ( !name.match( /^[$A-Z_][0-9A-Z_$]*$/i ) ) {
    console.error(
      '"%s" is not a valid name for a project. Please use a valid identifier ' +
      'name (alphanumeric).' ,
      name
    );
    process.exit( 1 );
  }

  if ( name === 'React' ) {
    console.error(
      '"%s" is not a valid name for a project. Please do not use the ' +
      'reserved word "React".' ,
      name
    );
    process.exit( 1 );
  }
}
/**
 *
 * @param name
 */
function createProject( name ) {
  var root        = path.resolve( name );
  var projectName = path.basename( root );
  //console.log( '888888888' , '' + root );
  //console.log( 'projectName' , '' + projectName );

  exec( 'git clone https://github.com/dmgapp/react-native-dmgapp-kit.git ' + root , function ( e , stdout , stderr ) {
    if ( e ) {
      console.log( stdout );
      console.error( stderr );
      console.error( 'git clonse failed' );
      process.exit( 1 );
    } else {
      projectRename.init( root , projectName );
    }
  } );

}

//function run(root, projectName, rnPackage) {
//  exec('npm install --save --save-exact ' + getInstallPackage(rnPackage), function(e, stdout, stderr) {
//    if (e) {
//      console.log(stdout);
//      console.error(stderr);
//      console.error('`npm install --save --save-exact react-native` failed');
//      process.exit(1);
//    }
//
//  });
//}
