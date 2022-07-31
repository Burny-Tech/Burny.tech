---
lang: zh-CN
title: docker mysql
description: docker mysql
---
```sh
yum install -y yum-utils device-mapper-persistent-data lvm2

sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

sudo yum makecache fast

sudo yum -y install docker-ce

docker pull mysql:5.7

docker run -d -p 3306:3306 --privileged=true -v /docker/mysql/conf/my.cnf:/etc/my.cnf -v /docker/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql mysql:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci

docker exec -it mysql bash

mysql -uroot -p

GRANT ALL PRIVILEGES ON *.* TO 'test'@'%' IDENTIFIED BY 'test123' WITH GRANT OPTION;
```