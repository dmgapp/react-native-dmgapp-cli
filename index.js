#!/usr/bin/env node

/**
 * dmgapp-cli 命令行 入口
 *
 * 例如：
 * dmgapp -v 或 dmgapp --version
 * dmgapp -h 或 dmgapp --help
 * dmgapp init ProjectName
 *
 * @author DMG ( Zix , Scott )
 * @version 1.0.0 , 2016-10-26
 */

'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var prompt      = require( 'prompt' );
var install     = require( "./common/install" );
var packageInfo = require( './package.json' );
var argv        = require( 'minimist' )( process.argv.slice( 2 ) );
var commands    = argv._;

var command     = commands[ 0 ] || 'all'; //取操作
var projectName = commands[ 1 ] || ''; //取项目名称

/**
 * 开始处理
 */
function start() {
  if ( argv[ 'h' ] || argv[ 'help' ] ) {
    //处理帮助信息
    showHelp();
  } else if ( argv[ 'v' ] || argv[ 'version' ] ) {
    //处理版本信息
    console.log( packageInfo.version );
  } else {
    //处理命令
    switch ( command ) {
      case 'init':
        //新建项目
        commandInit();
        break;
      case 'install':
        //安装模块
        commandInstall();
        break;
      default:
        console.log( '请输入有效的命令' );
        break;
    }
  }
}

/**
 * 处理 init 命令
 */
function commandInit() {
  if ( projectName == '' ) {
    console.error(
      '用法：dmgapp init 项目名称 [--模板类型] [--平台语言]' +
      '\n 模板类型 [--mall]或[--news]' +
      '\n 原生平台语言 [--ios-oc][--ios-swift][--android]' +
      '\n 默认 React Native'
    );
    process.exit( 1 );
  } else {
    var projectType = '';

    if ( argv[ 'ios' ] ) {
      projectType = 'ios-oc';
    } else if ( argv[ 'ios-swift' ] ) {
      projectType = 'ios-swift';
    } else if ( argv[ 'android' ] ) {
      projectType = 'android';
    } else if ( argv[ 'web' ] ) {
      projectType = 'web';
    } else {
      projectType = 'rn';
    }
    projectType += argv[ 'mall' ] ? '-mall' : '-news';

    //检查项目名称 并开始安装
    if ( validateProjectName() ) {
      install( projectName , projectType );
    }
  }
}

/**
 * 处理 install 命令
 */
function commandInstall() {
  console.log( '开发中...' );
}

/**
 * 检查项目名是否有效
 */
function validateProjectName() {
  //检查项目名称
  if ( !projectName.match( /^[$A-Z_][0-9A-Z_$]*$/i ) ) {
    console.error(
      '"%s" 并不是一个项目的有效名称。请使用一个有效的标识符 ' +
      '名称（字母）.' ,
      name
    );
  }

  //检查项目名称是否 为关键字
  if ( projectName === 'dmgapp' ) {
    console.error(
      '"%s" 并不是一个项目的有效名称。请不要使用 ' + '保留字 "dmgapp".' ,
      projectName
    );
    return false;
  }

  //检查项目是否存在
  if ( fs.existsSync( projectName ) ) {
    console.log( '项目名称已存在!' );
    return false;
  }

  return true;
}

/**
 * 显示帮助
 */
function showHelp() {
  var helpFile = path.resolve( __dirname , 'help' , command + '.txt' );
  var content  = fs.readFileSync( helpFile , 'utf-8' );
  console.log( content );
}

//开始处理
start();