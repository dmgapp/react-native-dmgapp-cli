#!/usr/bin/env node

/**
 * Used arguments:
 *   -v --version - to print current version of react-native-cli and react-native dependency
 */
'use strict';

var fs             = require( 'fs' );
var path           = require( 'path' );
var exec           = require( 'child_process' ).exec;
var prompt         = require( 'prompt' );
var help           = require( "./common/help.js" );
var projectRename  = require( "./common/project_rename" );
var argv           = require( 'minimist' )( process.argv.slice( 2 ) );
var debug          = true;
var kitPath        = 'https://github.com/dmgapp/react-native-dmgapp-kit.git ';
var gitProjectName = '';
var needNpm        = false;

//console.log( argv );
var commands = argv._;
//console.log( commands );

//if ( commands.length === 0 ) {
//  console.error(
//    '你没有通过任何命令, 你想运行 `dmgapp init`?'
//  );
//  process.exit( 1 );
//}

switch ( commands[ 0 ] ) {
  case 'init':
    if ( !commands[ 1 ] ) {
      console.error(
        '用法：dmgapp init 项目名称 [-模板类型] [--原生平台语言]' +
        '\n 模板类型 [--mall]或[--news]' +
        '\n 原生平台语言 [--ios-oc][--ios-swift][--android]'
      );
      process.exit( 1 );
    } else {
      if ( argv[ 'mall' ] ) {
        kitPath = '';
        needNpm = true;
      } else if ( argv[ 'news' ] ) {
        kitPath = '';
        needNpm = true;
      } else if ( argv[ 'ios-oc' ] ) {
        kitPath        = 'https://git.coding.net/scot/TestProjectIos.git';
        gitProjectName = 'TestProjectIos';
        needNpm        = false;
      } else if ( argv[ 'ios-swift' ] ) {
        kitPath = '';
        needNpm = false;
      } else if ( argv[ 'android' ] ) {
        gitProjectName = 'TestProjectAndroid';
        kitPath        = 'https://git.coding.net/scot/TestProjectAndroid.git';
        needNpm        = false;
      } else {
        needNpm        = true;
        gitProjectName = 'DMGAppKit';
        kitPath        = 'https://github.com/dmgapp/react-native-dmgapp-kit.git';//新闻的git
        console.log( 'default news' );
      }
      init( commands[ 1 ] , needNpm );
    }
    break;
  case 'install':
    if ( !commands[ 1 ] ) {
      console.error(
        '用法：dmgapp install [--组件编号]' +
        '\n [1] dmgapp-share' +
        '\n [2] dmgapp-comment' +
        '\n [3] dmgapp-favorite'
      );
      process.exit( 1 );
    } else {
      //init( commands[ 1 ] );
    }
    break;
  default:
    if ( argv[ 'h' ] ) {
      help();
    }
    break;
}
/**
 * 初始化项目或者工程
 * @param name
 * @param needNpm
 */
function init( name , needNpm ) {
  validatePackageName( name );
  //createAfterConfirmation(name);
  if ( fs.existsSync( name ) ) {
    if ( debug ) {
      var root        = path.resolve( name );
      var projectName = path.basename( root );
      projectRename.init( root , projectName , gitProjectName , needNpm );
    } else {
      console.log( '项目名称已存在!' );
      process.exit();
    }
    //console.log( '项目名称已存在!' );
    //process.exit();
  } else {
    createProject( name , needNpm );
  }
}

function createAfterConfirmation( name ) {
  prompt.start();
  var property = {
    name : 'yesno' ,
    message : '目录 ' + name + ' 已经存在. 是否继续?' ,
    validator : /y[es]*|n[o]?/ ,
    warning : '必须回答 yes or no' ,
    default : 'no'
  };

  prompt.get( property , function ( err , result ) {
    if ( result.yesno[ 0 ] === 'y' ) {
      createProject( name );
    } else {
      console.log( '取消项目初始化!' );
      process.exit();
    }
  } );
}
/**
 * 检查项目名是否有效
 * @param name
 */
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
 * 创建项目或者工程
 * @param name
 * @param needNpm
 */
function createProject( name , needNpm ) {
  var root = path.resolve( name );
  exec( 'git clone ' + kitPath + ' ' + root , function ( e , stdout , stderr ) {
    if ( e ) {
      console.log( stdout );
      console.error( stderr );
      console.error( 'git clone 获取失败！' );
      process.exit( 1 );
    } else {
      if ( needNpm ) {
        installPackge( root , projectName );
      } else {
        delGit( name , needNpm );
      }

    }
  } );
}
/**
 * 删除不是react-native项目的.git文件夹。否则会出错
 * @param name
 * @param needNpm
 */
function delGit( name , needNpm ) {
  var root        = path.resolve( name );
  var projectName = path.basename( root );

  exec( 'rm -rf ' + root + '/.git ' , function ( e , stdout , stderr ) {
    if ( e ) {
      console.log( stdout );
      console.error( stderr );
      console.error( 'git 文件夹删除失败!' );
      process.exit( 1 );
    } else {
      projectRename.init( root , projectName , gitProjectName ,needNpm );

    }
  } );
}

/**
 * 安装packge依赖包，并初始化项目
 * @param root 项目路径
 * @param projectName 项目名称
 */
function installPackge( root , projectName ) {
  exec( 'npm install' , function ( e , stdout , stderr ) {
    if ( e ) {
      console.log( stdout );
      console.error( stderr );
      console.error( 'npm 执行失败!' );
      process.exit( 1 );
    } else {
      projectRename.init( root , projectName, gitProjectName ,needNpm );
    }
  } );
}
