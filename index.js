#!/usr/bin/env node

/**
 * Used arguments:
 *   -v --version - to print current version of react-native-cli and react-native dependency
 */
'use strict';

var fs      = require( 'fs' );
var path    = require( 'path' );
var exec    = require( 'child_process' ).exec;
var prompt  = require( 'prompt' );
var help    = require( "./common/help.js" );
var loading = require( "./common/loading" );
var install = require( "./common/install" );
var argv    = require( 'minimist' )( process.argv.slice( 2 ) );

var commands = argv._;

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
      var projectType = '';
      if ( argv[ 'mall' ] ) {
        projectType = 'rn-mall';
        init( commands[ 1 ] , projectType );
      } else if ( argv[ 'news' ] ) {
        projectType = 'rn-news';
        init( commands[ 1 ] , projectType );
      } else if ( argv[ 'ios-oc' ] ) {
        projectType = 'ios-oc';
        init( commands[ 1 ] , projectType );
      } else if ( argv[ 'ios-swift' ] ) {
        projectType = 'ios-swift';
        init( commands[ 1 ] , projectType );
      } else if ( argv[ 'android' ] ) {
        projectType = 'android';
        init( commands[ 1 ] , projectType );
      } else {
        projectType = 'rn-news';
        init( commands[ 1 ] , projectType );
      }

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
      //待完善;
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
 * @param projectType
 */
function init( name,projectType ) {
  validatePackageName( name );
  if ( fs.existsSync( name ) ) {
    console.log( '项目名称已存在!' );
    process.exit();
  } else {
    install.init(name , projectType );
  }
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
