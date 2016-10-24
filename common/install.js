'use strict';

var fs      = require( "fs" );
var path    = require( "path" );
var chalk   = require( 'chalk' );
var exec    = require( 'child_process' ).exec;
var loading = require( "./loading" );

var projectInfo = {
  'rn-mall' : {
    'projectName' : '' ,
    'needNpm' : true ,
    'uri' : ''
  } ,
  'rn-news' : {
    'projectName' : 'DMGAppKit' ,
    'needNpm' : true ,
    'uri' : 'https://github.com/dmgapp/react-native-dmgapp-kit.git'
  } ,
  'ios-oc' : {
    'projectName' : 'TestProjectIos' ,
    'needNpm' : false ,
    'uri' : 'https://git.coding.net/scot/TestProjectIos.git'
  } ,
  'ios-swift' : {
    'projectName' : '' ,
    'needNpm' : false ,
    'uri' : ''
  } ,
  'android' : {
    'projectName' : 'TestProjectAndroid' ,
    'needNpm' : false ,
    'uri' : 'https://git.coding.net/scot/TestProjectAndroid.git'
  }
};

var Install = {
  config : {
    baseRoot : '' ,
    projectName : '' ,
    projectNameLower : '' ,
    searchUpper : "" ,
    searchLower : "" ,
    fileContentReplaceArr : [] ,
    needChangeNameDirUpper : [] ,
    needChangeNameDirLower : [] ,
    needChangeNameFileUpper : [] ,
    needChangeNameFileLower : []
  } ,

  init : function ( name , projectType ) {
    var dir                 = path.resolve( name );
    var projectName         = path.basename( dir );
    this.config.searchUpper = projectInfo[ projectType ].projectName;

    this.config.searchLower      = this.config.searchUpper.toLowerCase();
    this.config.baseRoot         = dir;
    this.config.projectName      = projectName;
    this.config.projectNameLower = projectName.toLowerCase();

    this.gitClone( name , projectType );//git clone
  } ,

  gitClone : function ( name , projectType ) {
    var self = this;
    var root = path.resolve( name );

    var kitPath = projectInfo[ projectType ].uri;
    var needNpm = projectInfo[ projectType ].needNpm;

    loading.start( '从git下载' );
    exec( 'git clone ' + kitPath + ' ' + root , function ( e , stdout , stderr ) {
      if ( e ) {
        console.log( stdout );
        console.error( stderr );
        console.error( 'git clone 获取失败！' );
        process.exit( 1 );
      } else {
        loading.stop();
        if ( needNpm ) {
          loading.start( '开始替换文件与内容' );
          self.scanFileAndDirectory( path.resolve( name ) );
          self.replaceContent();
          self.renameFile();
          self.renameFolder();
          self.updatePackageJson();
          loading.stop();

          self.runNpmInstall();
        } else {
          self.delGit( root );
        }
      }
    } );

  } ,

  scanFileAndDirectory : function ( dir ) {
    //读取文件目录
    var files = fs.readdirSync( dir );
    for ( var index in files ) {
      if ( !files.hasOwnProperty( index ) ) {
        continue;
      }
      var filename = files[ index ];
      var stat     = fs.lstatSync( path.join( dir , filename ) );
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
    for ( var i = 0 ; i < this.config.fileContentReplaceArr.length ; i++ ) {
      var data    = fs.readFileSync( this.config.fileContentReplaceArr[ i ] , "utf-8" );
      var newData = data.replace( new RegExp( this.config.searchUpper , "gm" ) , this.config.projectName )
                        .replace( new RegExp( this.config.searchLower , "gm" ) , this.config.projectNameLower );

      fs.writeFileSync( this.config.fileContentReplaceArr[ i ] , newData );
    }
  } ,

  renameFile : function () {
    for ( var j = 0 ; j < this.config.needChangeNameFileUpper.length ; j++ ) {
      //var newData2 = this.config.needChangeNameFileUpper[ j ].replace( this.config.searchUpper , projectName );

      var filePath = this.config.needChangeNameFileUpper[ j ];
      var newData2 = filePath.substr( 0 , filePath.lastIndexOf( this.config.searchUpper ) ) + this.config.projectName +
                     filePath.substr( filePath.lastIndexOf( this.config.searchUpper ) + this.config.searchUpper.length );

      fs.renameSync( this.config.needChangeNameFileUpper[ j ] , newData2 );
    }
  } ,

  renameFolder : function () {
    for ( var i = this.config.needChangeNameDirLower.length - 1 ; i >= 0 ; i-- ) {
      var newData = this.config.needChangeNameDirLower[ i ].replace( new RegExp( this.config.searchLower , "gm" ) , this.config.projectNameLower );
      fs.renameSync( this.config.needChangeNameDirLower[ i ] , newData );
    }

    for ( var j = this.config.needChangeNameDirUpper.length - 1 ; j >= 0 ; j-- ) {
      var newData2 = this.config.needChangeNameDirUpper[ j ].replace( new RegExp( this.config.searchUpper , "gm" ) , this.config.projectName );
      fs.renameSync( this.config.needChangeNameDirUpper[ j ] , newData2 );
    }
  } ,
  runNpmInstall : function () {
    var self = this;
    process.chdir( this.config.baseRoot );
    loading.start( '执行npm install,请耐心等待' );
    //console.log( '\n 执行npm install,请耐心等待.....' );
    exec( 'rm -rf .git && npm install ' , function ( e , stdout , stderr ) {
      if ( e ) {
        console.log( stdout );
        console.error( stderr );
        console.error( 'npm执行失败!' );
        process.exit( 1 );
      } else {
        loading.stop();
        console.log( chalk.yellow( stdout ) );
        //console.log( '\n npm执行成功!' );
        self.tips();
      }
    } );
  } ,
  updatePackageJson : function () {
    var paJson      = require( this.config.baseRoot + '/package.json' );
    var packageJson = {
      name : paJson.name ,
      version : paJson.version ,
      scripts : {
        start : paJson.scripts[ 'start' ] ,
        test : paJson.scripts[ 'test' ]
      } ,
      dependencies : {
        react : paJson.dependencies[ 'react' ] ,
        'react-native' : paJson.dependencies[ 'react-native' ] ,
        'react-native-router-flux' : paJson.dependencies[ 'react-native-router-flux' ] ,
        'react-native-swiper' : paJson.dependencies[ 'react-native-swiper' ] ,
        'react-native-vector-icons' : paJson.dependencies[ 'react-native-vector-icons' ] ,
        'react-redux' : paJson.dependencies[ 'react-redux' ] ,
        redux : paJson.dependencies[ 'redux' ] ,
        'redux-persist' : paJson.dependencies[ 'redux-persist' ] ,
        'redux-thunk' : paJson.dependencies[ 'redux-thunk' ]
      } ,
      jest : {
        preset : paJson.jest[ 'preset' ]
      } ,
      devDependencies : {
        'babel-jest' : paJson.devDependencies[ 'babel-jest' ] ,
        'babel-preset-react-native' : paJson.devDependencies[ 'babel-preset-react-native' ] ,
        jest : paJson.devDependencies[ 'jest' ] ,
        'jest-react-native' : paJson.devDependencies[ 'jest-react-native' ] ,
        'react-test-renderer' : paJson.devDependencies[ 'react-test-renderer' ]
      } ,
      license : paJson.license
    };
    fs.writeFileSync( path.join( this.config.baseRoot , '/package.json' ) , JSON.stringify( packageJson ) );
  } ,

  test : function () {
    var filename = this.config.baseRoot + '/package.json';
    var content  = fs.readFileSync( filename , 'utf-8' );
    var p1       = new RegExp( this.config.searchUpper , 'gm' );
    var p2       = new RegExp( this.config.searchLower , "gm" );

    console.log( content , this.config.searchUpper , this.config.searchLower );
    if ( p1.test( content ) ) {
      console.log( 'find' , this.config.searchUpper );
    }

    if ( p2.test( content ) ) {
      console.log( 'find' , this.config.searchLower );
    }
  } ,
  delGit : function ( root ) {
    var self = this;
    exec( 'rm -rf ' + root + '/.git ' , function ( e , stdout , stderr ) {
      if ( e ) {
        console.log( stdout );
        console.error( stderr );
        console.error( 'git 文件夹删除失败!' );
        process.exit( 1 );
      } else {
        loading.start( '开始替换文件与内容' );
        self.scanFileAndDirectory( root );
        self.replaceContent();
        self.renameFile();
        self.renameFolder();
        loading.stop();
      }
    } );
  } ,
  tips : function () {
    console.log( '\n 在IOS上运行你的应用程序: ' );
    console.log( '  cd ' + this.config.baseRoot );
    console.log( '  react-native run-ios' );
    console.log( '  - or -' );
    console.log( '  Open ' + this.config.baseRoot + '/ios/' + this.config.projectName + '.xcodeproj in Xcode' );
    console.log( '  点击运行按钮' );
    console.log( '在安卓上运行你的应用程序:' );
    console.log( '  有一个安卓模拟器运行（最快的方式开始），或一个设备连接' );
    console.log( '  cd ' + this.config.baseRoot );
    console.log( '  react-native run-android' );
  }
};

module.exports = Install;