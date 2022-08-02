---
lang: zh-CN
title: SpringSecurity
description: SpringSecurity
---
[[toc]]


新建项目  
引入starter-web
引入springsecurity
引入compile plugin


SpringSecurity实际上是
一系列过滤器链

UserNamepasswordAuthenticationFilter 认证 
ExceptionTranslationFilter 统一异常处理

FilterSecurityInterceptor 授权
可以从
defaultSecurityFilterChain 获得15个filter

authenticating和authorization 认证 和 授权

密码前加{noop} 原文加密

可能需要加jjwt-core

原生的filter可能会调用多次
extend onceperrequestfilter

httpbasic 认证方式  
![httpbasic认证方式](/images/system/SpringSecurity/httpBasic.jpg)


SpringSecurity 暂未实现动态权限校验
https://www.bilibili.com/video/BV1mm4y1X7Hc?spm_id_from=333.337.search-card.all.click

SpringSecurityOauth2 
https://www.bilibili.com/video/BV19A411K7FW?spm_id_from=333.999.0.0&vd_source=010173c6f35c758e74dd6593e5722af0

SpringSecurityOauth2 cloud
https://www.bilibili.com/video/BV1VE411h7aL?spm_id_from=333.337.search-card.all.click&vd_source=010173c6f35c758e74dd6593e5722af0

```java
bCryptPasswordEncoder.upgradeEncoding() ;
//表示对加密的密码是否再加密
```


  SpringSecurity 国际化  
https://www.bilibili.com/video/BV19A411K7FW?p=11&spm_id_from=pageDriver&vd_source=010173c6f35c758e74dd6593e5722af0  

08:56

## 手机认证方式

![tes](/images/system/SpringSecurity/Snipaste_2022-08-01_14-31-00.png)

实体类 未加入容器。如果需要用其他的已注入service ,需要set进入
https://www.bilibili.com/video/BV19A411K7FW?p=14&spm_id_from=pageDriver&vd_source=010173c6f35c758e74dd6593e5722af0
 06:11   不可以用autowired  


## Spring Session 共享
session 复制   
session 黏贴  
session 共享 


## SpringSecurity Oauth2
 
 授权给第三方，自己的网站通过微信登录
微信授权给第三方


官网

 自己的网站称为第三方
 
 
 授权模式 微信认证服务器经过认证之后给第三方服务端    微信的响应授权码给服务器端 uri，服务器端带上授权码去微信认证服务器，申请令牌，再拿令牌去微信资源服务器获取资源  

 简化模式 微信认证服务器经过认证之后直接给了浏览器   同意授权响应令牌，，令牌附在客户端服务器事先指定的重定向uri 后面，客户端直接拿着令牌去资源服务器获取信息  

 密码模式 直接提供用户名密码给第三方服务器登录，其登录需要通过第三方服务端，例如：在自己的系统上输入微信的账号和密码，再自己系统上将用户名密码发给微信的授权服务器。 
 
 
 客户端证书模式  微服务之间获取资源信息  用户已经认证的服务之间  

 刷新令牌  

 黑马程序员  
 
 OAuth2.0 包括以下角色  
1. 客户端 本身不存储资源，比如android客户端 web客户端
2. 资源拥有着：用户
3. 授权服务器 认证服务器 认证成功后发方令牌access_token , 还会对clientid  clientsecrect 校验 
4. 资源服务器 

## SpringCloudSecurityOauth2

授权服务

TokenEndpoint 服务用于访问临牌的请求  /oaouth/token  
如果认证不成功  
AuthorizationEndPoint 服务用于认证请求，默认URL /oauth/authorize


资源服务   
Oauth2AuthenticationProcessingFilter  对身份令牌进行解析鉴权   

**** 

授权服务器配置   三项内容  

@enableAuthorizationServer 注解并继承  oAuthorizationServerConfigureAdapter

ClientDetailsServiceConfigure 用来配置 client id secret  支持哪些客户端

AuthorizationServerEndPointsConfigure  用来配置令牌的端点电和令牌服务 /oauth/token   ，针对url安全约束 

AuthorzationServierSecurityConfigure 用来配置令牌断电的安全约束 哪个ip可以访该接口之类的。 


好多个默认的url  17:50 p7 黑马程序员

20：16 密码模式 授权码模式

令牌访问端点策略 表单认证，允许通过表单进行 申请令牌。
**** 

配置客户端详细信息

**p09** 和之前07 08 有误


clentid
secret
scope
authorities 一般选择scope 即可
authorizedGrantType  :springsecurityoauth2 5种授权类型是一致的

oAuthorizationServerConfigureAdapter 

继承上面的类需要重写3个方法。
入参：client   

Oauth2  

<a href="https://mp.weixin.qq.com/s?__biz=MzU3MDAzNDg1MA==&mid=2247502801&idx=1&sn=56b1af09bfa25d5e44193a7d75dfa623&chksm=fcf7141ccb809d0a1b0b2d7f6d9893c7d3e560dd8996296276f0274d2578236ee87e9124810d&token=278610351&lang=zh_CN&mode=light#rd">https://mp.weixin.qq.com/s?__biz=MzU3MDAzNDg1MA==&mid=2247502801&idx=1&sn=56b1af09bfa25d5e44193a7d75dfa623&chksm=fcf7141ccb809d0a1b0b2d7f6d9893c7d3e560dd8996296276f0274d2578236ee87e9124810d&token=278610351&lang=zh_CN&mode=light#rd</a>









 
 
 

