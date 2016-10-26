# dmgapp 命令行工具

## 安装
    
    npm install dmgapp-cli -g

## 用法 
    
    dmgapp init 项目名称 [--模板类型] [--平台语言]

   模板类型：
   
        --news       资讯类(默认)
        --mall       商城类
     
   平台语言：
   
         --rn         react-native(默认)
         --ios        iOS OC语言
         --ios-swift  iOS Swift语言
         --android    android平台
         --web        网页

   例如:
   
       dmgapp init ProjectName                      #生成 react-native 开发框架 资讯类(默认)
       dmgapp init ProjectName --news               #生成 react-native 开发框架 资讯类
       dmgapp init ProjectName —-mall               #生成 react-native 开发框架 商城类
       dmgapp init ProjectName --ios                #生成 原生ios 资讯类(默认) 开发框架 oc语言(默认)
       dmgapp init ProjectName --ios-swift --mall   #生成 原生ios 商城类 开发框架 swift语言
       dmgapp init ProjectName —-android            #生成 原生android 资讯类(默认) 开发框架