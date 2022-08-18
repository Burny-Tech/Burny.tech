---
lang: zh-CN
title: freeSSL 配置
description:  freeSSL 配置
---
[[toc]]

[FreeSSL官网]( https://freessl.cn/)
###  下载manager客户端
[keyManager官网,下载客户端](https://keymanager.org/)


### 填写域名
![](/images/system/freeSSL/0001.png)
### 在客户端里离线生成
![](/images/system/freeSSL/0002.png)
### 生成完回浏览器
![](/images/system/freeSSL/0003.png)
### 往下滑动，将以下值填入域名解析中填完回到freessl页面点击检测一下代表，解析是否成功，但证书还未颁发需要 点击验证
![](/images/system/freeSSL/0004.png)  
![](/images/system/freeSSL/0010.png)    
### 颁发如下
![](/images/system/freeSSL/0005.png)  
### 查看证书
![](/images/system/freeSSL/0006.png)  
### 导出证书
![](/images/system/freeSSL/0007.png)  
### 将证书导出并重命名，上传到服务器上
![](/images/system/freeSSL/0008.png)  
![](/images/system/freeSSL/0009.png)  

### nginx 配置如下

```sh
server {
listen  80;
server_name  burny.tech;
rewrite ^(.*)$ https://burny.tech$1 permanent; 
}
server {
listen 443 ssl;
server_name burny.tech;
ssl_certificate /usr/local/nginx/conf/confs/burny.crt;                          
ssl_certificate_key /usr/local/nginx/conf/confs/burny.key;
ssl_session_cache shared:SSL:1m;
ssl_session_timeout 5m;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
location / {
      root  静态代码路径；
      index  index.html index.htm;
      try_files $uri $uri/ /index.html;

}
}
```


### 遇到的问题
1. nginx没有安装ssl模块

```sh
[root@root]# /usr/local/nginx/sbin/nginx -V
nginx version: nginx/1.21.4
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC)
built with OpenSSL 1.0.2k-fips  26 Jan 2017
TLS SNI support enabled
configure arguments: --with-http_ssl_module

# 到nginx安装包目录
./configure --prefix=/usr/local/nginx --with-http_ssl_module && make
# 不能make install,否则就把已经安装的给覆盖掉


# 备份一下nginx
cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.bak

cp objs/nginx /usr/local/nginx/sbin/nginx


nginx -s reload


```

2. ``nginx -s reload`` 命令找不到 nginx.pid

```sh
# 到nginx的安装目录下，注意不是安装包目录
# /usr/local/nginx/sbin/nginx
# 执行以下命令即可重新reload 
# 指定配置文件的全路径，不可以用相对路径
./nginx -c /usr/local/nginx/conf/nginx.conf

```