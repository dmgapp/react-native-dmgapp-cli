'use strict';

var fs   = require( "fs" );
//path模块，可以生产相对和绝对路径
var path = require( "path" );

var ROOT = '';
//配置远程路径
//var remotePath        = path.resolve( );
//var remotePath = "/Users/scott/ReactWorkSpace/dmgapptest/";

//var lookingForString ='DMGAppExample';
//var lookingForString ="dmgappexample";
var lookingStringUpper = "DMGAppExample";
var lookingStringLower = lookingStringUpper.toLowerCase();

var projectName      = 'DmgProject';
var projectNameLower = projectName.toLowerCase();

//获取当前目录绝对路径，这里resolve()不传入参数
//var filePath              = path.resolve();
//读取文件存储数组

var fileContentReplaceArr   = [];
var needChangeNameDirUpper  = [];
var needChangeNameDirLower  = [];
var needChangeNameFileUpper = [];
var needChangeNameFileLower = [];

function fileOrDirNeedChangeName( dir , fileOrDir , isFile ) {
  var pattern1 = new RegExp( lookingStringUpper );

  if ( fileOrDir == 'DMGAppExampleTests.m' ) {
    console.log( 'DMGAppExampleTests.m' , pattern1.test( fileOrDir ) );
  }
  if ( pattern1.test( fileOrDir ) ) {
    if ( isFile ) {
      needChangeNameFileUpper.push( path.join( dir , fileOrDir ) );
    } else {
      needChangeNameDirUpper.push( path.join( dir , fileOrDir ) );
    }
  }

  var pattern2 = new RegExp( lookingStringLower );
  if ( pattern2.test( fileOrDir ) ) {
    if ( isFile ) {
      needChangeNameFileLower.push( path.join( dir , fileOrDir ) );
    } else {
      needChangeNameDirLower.push( path.join( dir , fileOrDir ) );
    }

  }
}

function start( dir ) {
  fileList( dir , dir );

  //console.log( 'needChangeNameDirUpper' , needChangeNameDirUpper );
  //console.log( 'needChangeNameDirLower' , needChangeNameDirLower );
  //console.log( 'needChangeNameFileUpper' , needChangeNameFileUpper );
  //console.log( 'needChangeNameFileLower' , needChangeNameFileLower );

  replaceContent();
  renameFile();
  renameFolder()

}

function fileList( dir ) {
  //读取文件目录
  var files = fs.readdirSync( dir );

  for ( var index in files ) {
    if ( !files.hasOwnProperty( index ) ) {
      continue;
    }

    var filename = files[ index ];

    var stat = fs.lstatSync( path.join( dir , filename ) );
    if ( stat.isDirectory() ) {
      fileOrDirNeedChangeName( dir , filename , false );
      fileList( path.join( dir , filename ) );
    } else {
      //判断 filename 是否是要替换的 文件或目录
      //如果是 则添加到要改名的 文件 arr

      fileOrDirNeedChangeName( dir , filename , true );

      //检查文件内容是否需要替换
      var filePath       = path.join( dir , filename );
      var fileContent    = fs.readFileSync( filePath , "utf-8" );
      var patternContent = new RegExp( lookingStringLower + '|' + lookingStringUpper );

      //保存文件内容数组
      if ( patternContent.test( fileContent ) ) {
        fileContentReplaceArr.push( filePath );
      }
    }
  }

  //处理文件
  //replaceContent();
}

/**
 * 替换文件内容
 */
function replaceContent() {
  console.log( '开始替换内容!-------' );
  for ( var i = 0 ; i < fileContentReplaceArr.length ; i++ ) {
    var data    = fs.readFileSync( fileContentReplaceArr[ i ] , "utf-8" );
    //var upperPatten = new RegExp('');
    var newData = data.replace( new RegExp(lookingStringUpper,"gm") , projectName )
                      .replace( new RegExp(lookingStringLower,"gm") , projectNameLower );

    fs.writeFileSync( fileContentReplaceArr[ i ] , newData );
  }
  console.log( '替换内容结束!-------' );
}

function renameFile() {
  console.log( '开始替换内容!-------' );
  //for ( var i = 0 ; i < needChangeNameFileLower.length ; i++ ) {
  //  var newData = needChangeNameFileLower[ i ].replace( lookingStringLower , projectNameLower );
  //  fs.renameSync( needChangeNameFileLower[ i ] , newData );
  //}

  for ( var j = 0 ; j < needChangeNameFileUpper.length ; j++ ) {
    //var newData2 = needChangeNameFileUpper[ j ].replace( lookingStringUpper , projectName );

    var filePath     = needChangeNameFileUpper[ j ];
    var newData2 = filePath.substr( 0 , filePath.lastIndexOf( lookingStringUpper ) ) + projectName +
                   filePath.substr( filePath.lastIndexOf( lookingStringUpper ) + lookingStringUpper.length );

    fs.renameSync( needChangeNameFileUpper[ j ] , newData2 );
  }

  console.log( '替换内容结束!-------' );
}

function renameFolder() {
  console.log( '开始替换内容!-------' );
  for ( var i = needChangeNameDirLower.length - 1 ; i >= 0 ; i-- ) {
    var newData = needChangeNameDirLower[ i ].replace( new RegExp(lookingStringLower,"gm") , projectNameLower );
    fs.renameSync( needChangeNameDirLower[ i ] , newData );
  }

  for ( var j = needChangeNameDirUpper.length - 1 ; j >= 0 ; j-- ) {
    var newData2 = needChangeNameDirUpper[ j ].replace( new RegExp(lookingStringUpper,"gm") , projectName );
    fs.renameSync( needChangeNameDirUpper[ j ] , newData2 );
  }

  console.log( '替换内容结束!-------' );
}

/**
 * 写入到filelisttxt文件
 * @param data
 */
//function writeFile( data ) {
//  console.log( '找到匹配文件写入的路径:' , remotePath + "filelist.txt" );
//  var data = data.join( "\n" );
//  fs.writeFile( remotePath + "filelist.txt" , data + '\n' , function ( err ) {
//    if ( err ) {
//      throw err;
//    }
//    console.log( "写入成功" );
//  } );
//}

module.exports = {
  start : start
};