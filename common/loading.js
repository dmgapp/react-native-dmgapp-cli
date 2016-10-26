'use strict';

/**
 * dmgapp 命令行 loading
 *
 * 使用：
 * loading.start('开始下载');
 *   开始下载...
 *
 * loading.end();
 *   开始下载...完成
 *
 * @author DMG ( Zix )
 * @version 1.0.0 , 2016-10-21
 */


var Loading = {
  animate : [ '/' , '-' , '\\' , '|' ] ,
  currentIndex : 0 ,
  timeOut : 200 ,
  handle : null ,
  preString : '' ,
  start : function ( preString ) {
    this.currentIndex = 0;
    this.handle       = null;
    this.stream       = process.stderr;
    this.preString    = preString;
    this.run();
  } ,

  run : function () {
    var self    = this;
    this.handle = setInterval( function () {
      var str = self.animate[ self.currentIndex ];
      //显示对应值
      self.stream.clearLine();
      self.stream.cursorTo( 0 );
      self.stream.write( self.preString + '...' + str );
      //console.log('str1111',str);

      var totalCount = self.animate.length;
      self.currentIndex++;
      if ( self.currentIndex >= totalCount ) {
        self.currentIndex = 0;
      }
    } , this.timeOut );
  } ,

  stop : function () {
    var self = this;
    if ( this.handle ) {
      clearInterval( this.handle );
    }
    this.handle = null;
    //self.stream.write( self.preString + '...完成' );
    self.stream.clearLine();
    self.stream.cursorTo( 0 );
    console.log( self.preString + '...完成' );
  }
};

module.exports = Loading;