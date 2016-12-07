'use strict';

/**
 * 项目下载，替换及后续处理
 *
 *
 * @author DMG ( Zix , Scott )
 * @version 1.0.0 , 2016-10-26
 */

var path     = require( "path" );
var chalk    = require( 'chalk' );
var loading  = require( "./loading" );
var fs       = require( 'fs' );
var exec     = require( 'child_process' ).exec;
var Promise  = require( 'promise' );
var exeCli   = Promise.denodeify( exec );
var readFile = Promise.denodeify( fs.readFile );

var projectInfo = {
  'rn-start' : {
    'name' : 'RNDMGAppStartKit' ,
    'uri' : 'https://git.coding.net/zix/react-native-dmgapp-start-kit.git' ,
    'preInstall' : null ,
    'postInstall' : function () {
      updateRNPackageJson();
      return exeCli( 'cd ' + config.projectName + ' && npm install && react-native link' );
    }
  } ,
  'rn-news' : {
    'name' : 'RNDMGAppNewsKit' ,
    'uri' : 'https://git.coding.net/zix/react-native-dmgapp-news-kit.git' ,
    'preInstall' : null ,
    'postInstall' : function () {
      updateRNPackageJson();
      return exeCli( 'cd ' + config.projectName + ' && npm install && react-native link' );
    }
  } ,
  'rn-mall' : {
    'name' : 'RNDMGAppMallKit' ,
    'uri' : 'https://git.coding.net/zix/react-native-dmgapp-mall-kit.git' ,
    'preInstall' : null ,
    'postInstall' : function () {
      updateRNPackageJson();
      return exeCli( 'cd ' + config.projectName + ' && npm install && react-native link' );
    }
  } ,
  'ios-oc-news' : {
    'name' : 'OCDMGAppNewsKit' ,
    'uri' : 'https://git.coding.net/wuway/oc-dmgapp-news-kit.git' ,
    'preInstall' : null ,
    'postInstall' : null
  } ,
  'ios-oc-mall' : {
    'name' : 'OCDMGAppMallKit' ,
    'uri' : 'https://git.coding.net/wuway/oc-dmgapp-mall-kit.git' ,
    'preInstall' : null ,
    'postInstall' : null
  } ,
  'ios-swift-news' : {
    'name' : 'DMGAppSwiftKit' ,
    'uri' : '' ,
    'preInstall' : null ,
    'postInstall' : null
  } ,
  'ios-swift-mall' : {
    'name' : 'DMGAppSwiftKit' ,
    'uri' : '' ,
    'preInstall' : null ,
    'postInstall' : null
  } ,
  'android-news' : {
    'name' : 'DMGAppAndroidKit' ,
    'uri' : 'https://git.coding.net/scot/TestProjectAndroid.git' ,
    'preInstall' : null ,
    'postInstall' : null
  } ,
  'android-mall' : {
    'name' : 'DMGAppAndroidKit' ,
    'uri' : 'https://git.coding.net/scot/TestProjectAndroid.git' ,
    'preInstall' : null ,
    'postInstall' : null
  } ,
  'web' : {
    'name' : 'DMGApp' ,
    'uri' : 'https://git.coding.net/Dark-Matter-Group/php-smart2.git' ,
    'preInstall' : null ,
    'postInstall' : function () {
      var cli = 'cd ' + config.projectName + ' && ' +
                'chmod -R 0777 runtime/ && ' +
                'chmod -R 0777 public/logs && ' +
                'chmod -R 0777 public/upload && ' +
                'cd public && ' +
                'npm install';
      return exeCli( cli );
    }
  }
};

var config = {
  basePath : '' ,
  projectType : '' ,
  projectPath : '' ,
  projectName : '' ,
  projectNameLower : '' ,
  searchUpper : '' ,
  searchLower : '' ,
  replaceFiles : [] ,
  renameDirUpper : [] ,
  renameDirLower : [] ,
  renameFileUpper : [] ,
  renameFileLower : [] ,
  gitCloneCli : 'git clone {kitUri} {projectPath} && cd {projectPath} && rm -rf .git/'
};

//克隆项目
function start( projectName , projectType ) {

  //console.log( projectType );
  var projectKit = projectInfo[ projectType ];
  var kitUri     = projectKit.uri;

  config.basePath         = process.cwd();
  config.projectType      = projectType;
  config.projectPath      = path.resolve( projectName );
  config.projectName      = projectName;
  config.projectNameLower = projectName.toLowerCase();
  config.searchUpper      = projectKit.name;
  config.searchLower      = config.searchUpper.toLowerCase();
  config.gitCloneCli      = config.gitCloneCli
                                  .replace( /\{kitUri}/g , kitUri )
                                  .replace( /\{projectPath}/g , config.projectPath );

  console.log( '项目将安装在 ' + config.projectPath );
  loading.start( '开始从Git下载' );
  exeCli( config.gitCloneCli )
    .then( function () {
      loading.stop();
      //扫描目录
      loading.start( '开始安装' );
      return scanFiles( config.projectPath );
    } )
    .then( function () {
      //替换文件内容
      replaceContent();
    } )
    .then( function () {
      //文件更名
      renameFiles();
    } )
    .then( function () {
      //目录更名
      renameFolders();
    } )
    .then( function () {
      loading.stop();

      if ( projectKit.postInstall ) {
        //安装后的操作
        loading.start( '执行安装后的操作' );
        return projectKit.postInstall();
      }
    } )
    .then( function () {
      loading.stop();
      return getTips();
    } )
    .then( function ( tipsContent ) {
      console.log( tipsContent.replace( /\{basePath}/g , config.basePath )
                              .replace( /\{projectName}/g , config.projectName ) );
    } )
    .catch( function ( e ) {
      console.log( e );
    } );
}

//扫描目录和文件
function scanFiles( baseDir ) {
  //读取文件目录
  var files = fs.readdirSync( baseDir );
  for ( var index in files ) {
    if ( !files.hasOwnProperty( index ) ) {
      continue;
    }
    var filename = files[ index ];
    var fileType = fs.lstatSync( path.join( baseDir , filename ) );
    if ( fileType.isDirectory() ) {
      //检查目录名是否要替换
      needRenameDir( baseDir , filename );
      //继续扫描下级目录
      scanFiles( path.join( baseDir , filename ) );
    } else {
      //检查文件名是否需要替换
      needRenameFile( baseDir , filename );
      //检查文件内容是否需要替换
      needReplaceFile( baseDir , filename );
    }
  }
}

//判断是否要修改目录名称
function needRenameDir( baseDir , dirName ) {
  var patternUpper = new RegExp( config.searchUpper );
  var patternLower = new RegExp( config.searchLower );

  if ( patternUpper.test( dirName ) ) {
    config.renameDirUpper.push( path.join( baseDir , dirName ) );
  }

  if ( patternLower.test( dirName ) ) {
    config.renameDirLower.push( path.join( baseDir , dirName ) );
  }
}

//判断是否要修改文件名
function needRenameFile( baseDir , filename ) {
  var patternUpper = new RegExp( config.searchUpper );
  var patternLower = new RegExp( config.searchLower );

  if ( patternUpper.test( filename ) ) {
    config.renameFileUpper.push( path.join( baseDir , filename ) );
  }

  if ( patternLower.test( filename ) ) {
    config.renameFileLower.push( path.join( baseDir , filename ) );
  }
}

//查找是否文件内容需要替换
function needReplaceFile( baseDir , filename ) {
  var filePath    = path.join( baseDir , filename );
  var fileContent = fs.readFileSync( filePath , "utf-8" );
  var pattern     = new RegExp( config.searchLower + '|' + config.searchUpper );

  //保存文件内容数组
  if ( pattern.test( fileContent ) ) {
    config.replaceFiles.push( filePath );
  }
}

//替换文件内容
function replaceContent() {
  var patternUpper = new RegExp( config.searchUpper , "gm" );
  var patternLower = new RegExp( config.searchLower , "gm" );

  for ( var i = 0 ; i < config.replaceFiles.length ; i++ ) {
    var filePath = config.replaceFiles[ i ];
    var data     = fs.readFileSync( filePath , "utf-8" );
    var newData  = data.replace( patternUpper , config.projectName )
                       .replace( patternLower , config.projectNameLower );

    fs.writeFileSync( filePath , newData );
  }
}

//文件更名
function renameFiles() {
  //处理需要替换大写文件名的文件
  for ( var i = 0 ; i < config.renameFileUpper.length ; i++ ) {
    var upperFile    = config.renameFileUpper[ i ];
    var newUpperFile = upperFile.substr( 0 , upperFile.lastIndexOf( config.searchUpper ) ) + config.projectName +
                       upperFile.substr( upperFile.lastIndexOf( config.searchUpper ) + config.searchUpper.length );

    fs.renameSync( upperFile , newUpperFile );
  }
  //处理需要替换小写文件名的文件
  for ( var j = 0 ; j < config.renameFileLower.length ; j++ ) {
    var lowerFile    = config.renameFileLower[ j ];
    var newLowerFile = lowerFile.substr( 0 , lowerFile.lastIndexOf( config.searchLower ) ) + config.projectName +
                       lowerFile.substr( lowerFile.lastIndexOf( config.searchLower ) + config.searchLower.length );

    fs.renameSync( lowerFile , newLowerFile );
  }
}

//修改目录名
function renameFolders() {
  var patternUpper = new RegExp( config.searchUpper , "gm" );
  var patternLower = new RegExp( config.searchLower , "gm" );

  for ( var i = config.renameDirUpper.length - 1 ; i >= 0 ; i-- ) {
    var upperDirName = config.renameDirUpper[ i ];
    var newUpperName = upperDirName.replace( patternUpper , config.projectName );
    fs.renameSync( upperDirName , newUpperName );
  }

  for ( var j = config.renameDirLower.length - 1 ; j >= 0 ; j-- ) {
    var lowerDirName = config.renameDirLower[ j ];
    var newLowerName = lowerDirName.replace( patternLower , config.projectNameLower );
    fs.renameSync( lowerDirName , newLowerName );
  }
}

//更新rn项目的 package.json文件
function updateRNPackageJson() {
  var paJson     = require( config.projectPath + '/package.json' );
  paJson.version = '1.0.0';

  fs.writeFileSync( path.join( config.projectPath , '/package.json' ) , JSON.stringify( paJson , null , 2 ) );
}

//取帮助文件
function getTips() {
  var tipsPath = path.resolve( __dirname , 'tips' , config.projectType + '.txt' );
  return readFile( tipsPath , 'utf-8' );
}

module.exports = start;