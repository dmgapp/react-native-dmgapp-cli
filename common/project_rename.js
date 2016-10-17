'use strict';

var fs   = require( "fs" );
var path = require( "path" );
var exec          = require( 'child_process' ).exec;

var ProjectRename = {
  config : {
    baseRoot : '' ,
    projectName : '' ,
    projectNameLower: '',
    searchUpper : "DMGAppKit" ,
    searchLower : "",
    fileContentReplaceArr:[],
    needChangeNameDirUpper: [],
    needChangeNameDirLower : [],
    needChangeNameFileUpper :[],
    needChangeNameFileLower:[]
  } ,

  init : function ( dir , projectName ) {
    this.config.searchLower = this.config.searchUpper.toLowerCase();
    this.config.baseRoot    = dir;
    this.config.projectName = projectName;
    this.config.projectNameLower = projectName.toLowerCase();

    this.scanFileAndDirectory( dir );

    //console.log( 'this.config.needChangeNameDirUpper' , this.config.needChangeNameDirUpper );
    //console.log( 'this.config.needChangeNameDirLower' , this.config.needChangeNameDirLower );
    //console.log( 'this.config.needChangeNameFileUpper' , this.config.needChangeNameFileUpper );
    //console.log( 'needChangeNameFileLower' , needChangeNameFileLower );

    this.replaceContent();
    this.renameFile();
    this.renameFolder();
    this.runNpmInstall();


  } ,

  scanFileAndDirectory : function ( dir ) {
    //读取文件目录
    var files = fs.readdirSync( dir );
    for ( var index in files ) {
      if ( !files.hasOwnProperty( index ) ) {
        continue;
      }

      var filename = files[ index ];

      var stat = fs.lstatSync( path.join( dir , filename ) );
      if ( stat.isDirectory() ) {
        this.fileOrDirNeedChangeName( dir , filename , false );
        this.scanFileAndDirectory( path.join( dir , filename ) );
      } else {
        //判断 filename 是否是要替换的 文件或目录
        //如果是 则添加到要改名的 文件 arr

        this.fileOrDirNeedChangeName( dir , filename , true );

        //检查文件内容是否需要替换
        var filePath       = path.join( dir , filename );
        var fileContent    = fs.readFileSync( filePath , "utf-8" );
        var patternContent = new RegExp( this.config.searchLower + '|' + this.config.searchUpper );

        //保存文件内容数组
        if ( patternContent.test( fileContent ) ) {
          this.config.fileContentReplaceArr.push( filePath );
        }
      }
    }
  } ,

  fileOrDirNeedChangeName : function ( dir , fileOrDir , isFile ) {
    var pattern1 = new RegExp( this.config.searchUpper );

    if ( pattern1.test( fileOrDir ) ) {
      if ( isFile ) {
        this.config.needChangeNameFileUpper.push( path.join( dir , fileOrDir ) );
      } else {
        this.config.needChangeNameDirUpper.push( path.join( dir , fileOrDir ) );
      }
    }

    var pattern2 = new RegExp( this.config.searchLower );
    if ( pattern2.test( fileOrDir ) ) {
      if ( isFile ) {
        this.config.needChangeNameFileLower.push( path.join( dir , fileOrDir ) );
      } else {
        this.config.needChangeNameDirLower.push( path.join( dir , fileOrDir ) );
      }

    }
  } ,

  replaceContent : function () {
    console.log( '开始替换内容!-------' );
    for ( var i = 0 ; i < this.config.fileContentReplaceArr.length ; i++ ) {
      var data    = fs.readFileSync( this.config.fileContentReplaceArr[ i ] , "utf-8" );
      var newData = data.replace( new RegExp( this.config.searchUpper , "gm" ) , this.config.projectName )
                        .replace( new RegExp( this.config.searchLower , "gm" ) , this.config.projectNameLower );

      fs.writeFileSync( this.config.fileContentReplaceArr[ i ] , newData );
    }
    console.log( '替换内容结束!-------' );
  } ,

  renameFile : function () {
    console.log( '开始替换文件!-------' );

    for ( var j = 0 ; j < this.config.needChangeNameFileUpper.length ; j++ ) {
      //var newData2 = this.config.needChangeNameFileUpper[ j ].replace( this.config.searchUpper , projectName );

      var filePath = this.config.needChangeNameFileUpper[ j ];
      var newData2 = filePath.substr( 0 , filePath.lastIndexOf( this.config.searchUpper ) ) + this.config.projectName +
                     filePath.substr( filePath.lastIndexOf( this.config.searchUpper ) + this.config.searchUpper.length );

      fs.renameSync( this.config.needChangeNameFileUpper[ j ] , newData2 );
    }

    console.log( '替换文件结束!-------' );
  } ,

  renameFolder : function () {
    console.log( '开始替换文件夹!-------' );
    for ( var i = this.config.needChangeNameDirLower.length - 1 ; i >= 0 ; i-- ) {
      var newData = this.config.needChangeNameDirLower[ i ].replace( new RegExp( this.config.searchLower , "gm" ) ,this.config.projectNameLower );
      fs.renameSync( this.config.needChangeNameDirLower[ i ] , newData );
    }

    for ( var j = this.config.needChangeNameDirUpper.length - 1 ; j >= 0 ; j-- ) {
      var newData2 = this.config.needChangeNameDirUpper[ j ].replace( new RegExp( this.config.searchUpper , "gm" ) , this.config.projectName );
      fs.renameSync( this.config.needChangeNameDirUpper[ j ] , newData2 );
    }

    console.log( '替换文件夹结束!-------' );
  },
  runNpmInstall:function () {
    process.chdir(this.config.baseRoot);
    exec( 'npm install ', function ( e , stdout , stderr ) {
      if ( e ) {
        console.log( stdout );
        console.error( stderr );
        console.error(' npm install failed ');
        process.exit( 1 );
      }
    } );
  }
};

module.exports = ProjectRename;