```java
yum install httpd-tools

ab -help
ab [options] [hosts:port/path]
ab 
-n  requests:表示当前请求次数
-c  current :表示当前并发次数
-n 1000 -c 100 有100个是并发的
-t 如果适用POST或者PUT 提交 ，Content-type:application/x-www-form-urlencoded;
-p 如果是post请求则是请求体    postifile 请求体  以文件形式存在 
    
    #举例子
    ab -n 1000 -c 100 -p ~/postfile  -T application/x-www-form-urlencoded   http://localhost:8080/path
```





