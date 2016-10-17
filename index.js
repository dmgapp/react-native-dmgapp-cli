#!/usr/bin/env node

/**
 * Used arguments:
 *   -v --version - to print current version of react-native-cli and react-native dependency
 */
'use strict';

var fs       = require( 'fs' );
var path     = require( 'path' );
var exec     = require( 'child_process' ).exec;
var help     = require( "./common/help.js" );
var fileList = require( "./common/filelist" );

var argv = require( 'minimist' )( process.argv.slice( 2 ) );

//path.resolve( 'dmgtest' );

if ( argv[ 'h' ] ) {
  //console.log(help.());
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

  //var data = fs.readFileSync(
  // '/Users/scott/ReactWorkSpace/dmgapptest/android/app/src/main/java/com/dmgappexample/MainActivity.java' , "utf-8"
  // ); var data2=data.replace( 'DMGAppExample' , 'dmgapptest' ); fs.writeFileSync(
  // '/Users/scott/ReactWorkSpace/dmgapptest/android/app/src/main/java/com/dmgappexample/MainActivity.java' , data2);

  //if ( fs.existsSync( name ) ) {
  //  //createAfterConfirmation( name , verbose , rnPackage );
  //  console.log( 'Project Name has Exists!' );
  //  //fileList();
  //  process.exit();
  //} else {
    createProject( name );
  //}
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
  //var react='';
  //var reactNative='';
  //
  //console.log( '888888888' , '' + root );
  //console.log(
  //  'This will walk you through creating a new React Native project in' ,
  //  root
  //);

  //if ( !fs.existsSync( root ) ) {
  //  fs.mkdirSync( root );
  //}
  //
  //var packageJson = {
  //  name : projectName ,
  //  version : '0.0.1' ,
  //  private : true ,
  //  scripts : {
  //    start : 'node node_modules/react-native/local-cli/cli.js start'
  //  }
  //};
  //fs.writeFileSync( path.join( root , 'package.json' ) , JSON.stringify( packageJson ) );
  //process.chdir( root );

  //exec( 'git clone https://git.coding.net/scot/dmgapp-example.git ' + root , function ( e , stdout , stderr ) {
  //  if ( e ) {
  //    console.log( stdout );
  //    console.error( stderr );
  //    console.error( 'git clonse failed' );
  //    process.exit( 1 );
  //  } else {
  //    //fileList.fileList();
  //  }
  //} );

  var remotePath = "/Users/Zix/react-native-workspace/DmgProject/";

  fileList.start( remotePath);

  //console.log( 'Project initialization Has successful!' );

  //react=require( root+'/package.json' ).dependencies.react;
  //reactNative = require( root+'/package.json' ).dependencies.react-native;
  //
  //var packageJson = {
  //  name : projectName ,
  //  version : '0.0.1' ,
  //  private : true ,
  //  scripts : {
  //    start : 'node node_modules/react-native/local-cli/cli.js start'
  //  },
  //  dependencies : {
  //    react : react
  //    react-native:reactNative
  //  }
  //};
  //fs.writeFileSync( path.join( root , 'package.json' ) , JSON.stringify( packageJson ) );
  //console.log(require( root+'/package.json' ).dependencies);

  //if ( verbose ) {
  //  runVerbose( root , projectName , rnPackage );
  //} else {
  //  run( root , projectName , rnPackage );
  //}
}

//console.log( argv._ );

//console.log( 'dmgapp: ' + require( './package.json' ).version );

//var fs     = require( 'fs' );
//var path   = require( 'path' );
//var exec   = require( 'child_process' ).exec;
//var spawn  = require( 'child_process' ).spawn;
//var chalk  = require( 'chalk' );
//var prompt = require( 'prompt' );
//var semver = require( 'semver' );
//
//var argv = require( 'minimist' )( process.argv.slice( 2 ) );
//
//var CLI_MODULE_PATH = function () {
//  return path.resolve(
//    process.cwd() ,
//    'node_modules' ,
//    'react-native' ,
//    'cli.js'
//  );
//};
//
//var REACT_NATIVE_PACKAGE_JSON_PATH = function () {
//  return path.resolve(
//    process.cwd() ,
//    'node_modules' ,
//    'react-native' ,
//    'package.json'
//  );
//};
//
//checkForVersionArgument();
//
//var cli;
//var cliPath = CLI_MODULE_PATH();
//if ( fs.existsSync( cliPath ) ) {
//  cli = require( cliPath );
//}
//
//// minimist api
//var commands = argv._;
//if ( cli ) {
//  cli.run();
//} else {
//  if ( commands.length === 0 ) {
//    console.error(
//      'You did not pass any commands, did you mean to run `react-native init`?'
//    );
//    process.exit( 1 );
//  }
//
//  switch ( commands[ 0 ] ) {
//    case 'init':
//      if ( !commands[ 1 ] ) {
//        console.error(
//          'Usage: react-native init <ProjectName> [--verbose]'
//        );
//        process.exit( 1 );
//      } else {
//        init( commands[ 1 ] , argv.verbose , argv.version );
//      }
//      break;
//    default:
//      console.error(
//        'Command `%s` unrecognized. ' +
//        'Did you mean to run this inside a react-native project?' ,
//        commands[ 0 ]
//      );
//      process.exit( 1 );
//      break;
//  }
//}
//

//
//function init( name , verbose , rnPackage ) {
//  validatePackageName( name );
//
//  if ( fs.existsSync( name ) ) {
//    createAfterConfirmation( name , verbose , rnPackage );
//  } else {
//    createProject( name , verbose , rnPackage );
//  }
//}
//
//function createAfterConfirmation( name , verbose , rnPackage ) {
//  prompt.start();
//
//  var property = {
//    name : 'yesno' ,
//    message : 'Directory ' + name + ' already exists. Continue?' ,
//    validator : /y[es]*|n[o]?/ ,
//    warning : 'Must respond yes or no' ,
//    default : 'no'
//  };
//
//  prompt.get( property , function ( err , result ) {
//    if ( result.yesno[ 0 ] === 'y' ) {
//      createProject( name , verbose , rnPackage );
//    } else {
//      console.log( 'Project initialization canceled' );
//      process.exit();
//    }
//  } );
//}
//

//
//function getInstallPackage( rnPackage ) {
//  var packageToInstall = 'react-native';
//  var valideSemver     = semver.valid( rnPackage );
//  if ( valideSemver ) {
//    packageToInstall += '@' + valideSemver;
//  } else if ( rnPackage ) {
//    // for tar.gz or alternative paths
//    packageToInstall = rnPackage;
//  }
//  return packageToInstall;
//}
//
//function run( root , projectName , rnPackage ) {
//  exec( 'npm install --save --save-exact ' + getInstallPackage( rnPackage ) , function ( e , stdout , stderr ) {
//    if ( e ) {
//      console.log( stdout );
//      console.error( stderr );
//      console.error( '`npm install --save --save-exact react-native` failed' );
//      process.exit( 1 );
//    }
//
//    checkNodeVersion();
//
//    var cli = require( CLI_MODULE_PATH() );
//    cli.init( root , projectName );
//  } );
//}
//
//function runVerbose( root , projectName , rnPackage ) {
//  var proc = spawn( 'npm' , [
//    'install' ,
//    '--verbose' ,
//    '--save' ,
//    '--save-exact' ,
//    getInstallPackage( rnPackage )
//  ] , { stdio : 'inherit' } );
//  proc.on( 'close' , function ( code ) {
//    if ( code !== 0 ) {
//      console.error( '`npm install --save --save-exact react-native` failed' );
//      return;
//    }
//
//    cli = require( CLI_MODULE_PATH() );
//    cli.init( root , projectName );
//  } );
//}
//
//function checkNodeVersion() {
//  var packageJson = require( REACT_NATIVE_PACKAGE_JSON_PATH() );
//  if ( !packageJson.engines || !packageJson.engines.node ) {
//    return;
//  }
//  if ( !semver.satisfies( process.version , packageJson.engines.node ) ) {
//    console.error( chalk.red(
//        'You are currently running Node %s but React Native requires %s. ' +
//        'Please use a supported version of Node.\n' +
//        'See https://facebook.github.io/react-native/docs/getting-started.html'
//      ) ,
//      process.version ,
//      packageJson.engines.node );
//  }
//}
//
//function checkForVersionArgument() {
//  if ( argv._.length === 0 && (argv.v || argv.version) ) {
//    console.log( 'react-native-cli: ' + require( './package.json' ).version );
//    try {
//      console.log( 'react-native: ' + require( REACT_NATIVE_PACKAGE_JSON_PATH() ).version );
//    } catch ( e ) {
//      console.log( 'react-native: n/a - not inside a React Native project directory' )
//    }
//    process.exit();
//  }
//}