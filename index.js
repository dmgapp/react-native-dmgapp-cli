#!/usr/bin/env node

/**
 * Used arguments:
 *   -v --version - to print current version of react-native-cli and react-native dependency
 */
'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var exec = require( 'child_process' ).exec;
var prompt = require('prompt');
var help = require( "./common/help.js" );
var projectRename = require( "./common/project_rename" );
var argv = require( 'minimist' )( process.argv.slice( 2 ) );
var debug = true;
var kitPath = 'https://github.com/dmgapp/react-native-dmgapp-kit.git ';

if ( argv[ 'h' ] ) {
  help();
}

var commands = argv._;
if ( commands.length === 0 ) {
  console.error(
    '你没有通过任何命令, 你是想运行 `react-native init`?'
  );
  process.exit( 1 );
}

switch ( commands[ 0 ] ) {
  case 'init':
    if ( !commands[ 1 ] ) {
      console.error(
        '用法：react-native init <项目名称>[--verbose]'
      );
      process.exit( 1 );
    } else {
      init( commands[ 1 ], argv.verbose, argv.version );
    }
    break;
  default:
    console.error(
      '无法识别的命令 `%s`. ' +
      '你是想子本地运行这个react-native 工程吗?' ,
      commands[ 0 ]
    );
    process.exit( 1 );
    break;
}

function init( name ) {
  validatePackageName( name );
  //createAfterConfirmation(name);
  if ( fs.existsSync( name ) ) {
    if(debug){
      var root        = path.resolve( name );
      var projectName = path.basename( root );
      projectRename.init( root , projectName );
    }else{
      console.log( '项目名称已存在!' );
      process.exit();
    }
  } else {
    createProject( name );
  }
}

function createAfterConfirmation(name) {
  prompt.start();

  var property = {
    name: 'yesno',
    message: '目录 ' + name + ' 已经存在. 是否继续?',
    validator: /y[es]*|n[o]?/,
    warning: '必须回答 yes or no',
    default: 'no'
  };

  prompt.get(property, function (err, result) {
    if (result.yesno[0] === 'y') {
      createProject(name);
    } else {
      console.log('取消项目初始化!');
      process.exit();
    }
  });
}


function validatePackageName( name ) {
  if ( !name.match( /^[$A-Z_][0-9A-Z_$]*$/i ) ) {
    console.error(
      '"%s" 并不是一个项目的有效名称。请使用一个有效的标识符 ' +
      '名称（字母）.' ,
      name
    );
    process.exit( 1 );
  }

  if ( name === 'React' ) {
    console.error(
      '"%s" 并不是一个项目的有效名称。请不要使用 ' +
      '保留字 "React".' ,
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
  var root = path.resolve( name );
  var projectName = path.basename( root );

  exec( 'git clone ' + kitPath + ' ' + root, function ( e, stdout, stderr ) {
    if ( e ) {
      console.log( stdout );
      console.error( stderr );
      console.error( 'git clone 获取失败！' );
      process.exit( 1 );
    } else {
      installPackge( root, projectName );
    }
  } );
}

/**
 * 安装packge依赖包，并初始化项目
 * @param root 项目路径
 * @param projectName 项目名称
 */
function installPackge( root, projectName ) {
  exec( 'npm install', function ( e, stdout, stderr ) {
    if ( e ) {
      console.log( stdout );
      console.error( stderr );
      console.error( 'npm install failed' );
      process.exit( 1 );
    } else {
      projectRename.init( root, projectName );
    }
  } );
}
