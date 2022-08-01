---
lang: zh-CN
title: SpringSecurity
description: SpringSecurity
---

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


  
  image.png


  SpringSecurity 国际化
https://www.bilibili.com/video/BV19A411K7FW?p=11&spm_id_from=pageDriver&vd_source=010173c6f35c758e74dd6593e5722af0  

08:56

## 手机认证方式

![tes](/images/system/SpringSecurity/Snipaste_2022-08-01_14-31-00.png)

实体类 未加入容器。如果需要用其他的已注入service ,需要set进入
https://www.bilibili.com/video/BV19A411K7FW?p=14&spm_id_from=pageDriver&vd_source=010173c6f35c758e74dd6593e5722af0
 06:11   不可以用autowired  



 fdsa 

