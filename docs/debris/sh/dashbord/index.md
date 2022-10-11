# 数据库监控



```yaml

prometheus:9090  收集数据  # /pro mi sies
grafana:3000  大屏展示  #
mysqld_exporter:9104  收集mysql数据提供给Prometheus

```



## 下载地址

[mysqld_exporter](https://github.com/prometheus/mysqld_exporter/releases)

[prometheus](https://prometheus.io/download/)

[grafana](https://repo.huaweicloud.com/grafana/8.2.0/)

![](/images/debris/dashbord/001.png)
![](/images/debris/dashbord/017.png)
![](/images/debris/dashbord/018.png)

笔者私人OSS

```java
https://burny.oss-cn-guangzhou.aliyuncs.com/grafana-enterprise-8.2.0.linux-amd64%20%281%29.tar.gz
https://burny.oss-cn-guangzhou.aliyuncs.com/mysqld_exporter-0.13.0.linux-amd64%20%281%29.tar.gz
https://burny.oss-cn-guangzhou.aliyuncs.com/prometheus-2.37.1.linux-amd64.tar.gz

```



## 运行环境

```sh
192.168.1.62   # 数据库所在地址，并且要和mysqld_exporter在一起
192.168.1.148  # prometheus  和 grafana 地址
# 需在数据库机器开放 9104端口号
#  prometheus 9090  grafana 3000

firewall-cmd  --zone=public --permanent --add-port=9104/tcp
firewall-cmd --reload

firewall-cmd  --zone=public --permanent --add-port=3000/tcp
firewall-cmd  --zone=public --permanent --add-port=9090/tcp
firewall-cmd --reload


```



## mysqld_exporter

```sh
# 上传到数据库服务器
mkdir -p /home/dashbord
tar -zxvf  mysqld_exporter-0.13.0.linux-amd64.tar.gz 
mv mysqld_exporter-0.13.0.linux-amd64 export
cd export/

nohub ./mysqld_exporter &
vim /root/.my.cnf
[client]
user=mysql_monitor
password=Mysql@123

#验证地址
http://192.168.1.62:9104/metrics

```

![](/images/debris/dashbord/019.png)