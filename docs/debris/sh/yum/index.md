---
lang: zh-CN
title: yum源更改
description: yum源更改
---

环境：CentOS-Stream-8-x86_64-20220423-boot  

```sh
cp /etc/yum.repos.d/CentOS-Stream-BaseOS.repo /etc/yum.repos.d/CentOS-Stream-BaseOS.repo.back && rm -rf  /etc/yum.repos.d/CentOS-Stream-BaseOS.repo && vim  /etc/yum.repos.d/CentOS-Stream-BaseOS.repo


[base]
name=CentOS-8-stream - Base - mirrors.aliyun.com
baseurl=https://mirrors.aliyun.com/centos/8-stream/BaseOS/$basearch/os/
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
#additional packages that may be useful
[extras]
name=CentOS-8-stream - Extras - mirrors.aliyun.com
baseurl=https://mirrors.aliyun.com/centos/8-stream/extras/$basearch/os/
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-8-stream - Plus - mirrors.aliyun.com
baseurl=https://mirrors.aliyun.com/centos/8-stream/centosplus/$basearch/os/
gpgcheck=1
enabled=0
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
[PowerTools]
name=CentOS-8-stream - PowerTools - mirrors.aliyun.com
baseurl=https://mirrors.aliyun.com/centos/8-stream/PowerTools/$basearch/os/
gpgcheck=1
enabled=0
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
[AppStream]
name=CentOS-8-stream - AppStream - mirrors.aliyun.com
baseurl=https://mirrors.aliyun.com/centos/8-stream/AppStream/$basearch/os/
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official

:wq!

# 安装常用的软件，包括docker 

yum clean all && yum update && yum makecache &&  sudo yum install -y yum-utils device-mapper-persistent-data lvm2  git make  gcc gcc-c++ kernel-devel  zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel   xz-devel mysql-devel    &&  yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo && sudo yum -y  install  make  docker-ce docker-ce-cli containerd.io --allowerasing && systemctl start docker && systemctl enable docker && curl -L https://get.daocloud.io/docker/compose/releases/download/v2.2.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose && docker-compose --version

```