---
lang: zh-CN
title: gogs迁移仓库至gitlab
description: git碎片化笔记
---

[[toc]]


# 流程

1、从gogs上下载裸仓库到本地 用的是http协议下载

2、运用curl创建gitlab远程仓库 

3、将本地仓库上传到远程。用的是git ssh 协议上传

## 环境 版本 前提

CentOS-Stream-8-x86_64-20220423-boot  
gitlab 15.0.2  
<a href="https://docs.gitlab.com/ee/api/projects.html#create-project" target="_blank">  gitlab 15.0.2    说明文档</a>

gogs仓库地址：http://192.168.1.54:8081/  
gitlab仓库地址： http://192.168.1.189:10018  



## 获取gogs仓库路径

```sh

# 进入gogs服务器，获取用户名下所有的git仓库名称 可以获得用户名+仓库前缀

find gogs目录下 -name --manxdeep 3 -type d 

##示例
##szgw/szgw-pc.git
##szgw/szgw-portal.git
##szgw/szgw-app.git
##szgw/szgw-server.git

#在编辑器里拼接上前缀，后面需要将gogs上所有仓库下载到本地，http://gogsip:port/

#示例

#http://192.168.1.54:8081/szgw/szgw-pc.git
#http://192.168.1.54:8081/szgw/szgw-portal.git

#将以上示例存为c.txt.最下面需要用到
```
## 安装gitlab

```sh

yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm &&  yum install -y curl policycoreutils-python3     openssh-server   postfix  && systemctl enable sshd  && systemctl start sshd  && systemctl enable postfix && systemctl start postfix && mkdir -p /opt/soft/gitlab && cd  /opt/soft/gitlab  && wget --content-disposition https://packages.gitlab.com/gitlab/gitlab-ce/packages/el/8/gitlab-ce-15.0.2-ce.0.el8.x86_64.rpm/download.rpm && rpm -Uvh gitlab-ce-15.0.2-ce.0.el8.x86_64.rpm

#需要先备份一下 gitlab.rb 配置文件

vim /etc/gitlab/gitlab.rb



#当前服务器的ip+访问端口号
external_url 'http://192.168.1.189:10018'
#与上面不同的端口号
puma['port'] = 10019
puma['worker_processes'] = 3
puma['worker_timeout'] = 60
#当前服务器的地址
gitlab_rails['gitlab_ssh_host'] = '192.168.1.189'
gitlab_rails['time_zone'] = 'Asia/Shanghai'
gitlab_rails['smtp_enable'] = true
#配置163邮箱
gitlab_rails['smtp_address'] = "smtp.163.com"
gitlab_rails['smtp_port'] = 25
#账户名称，邮箱***@163.com
gitlab_rails['smtp_user_name'] = "********"
#配置163smtp密码 
gitlab_rails['smtp_password'] = "smtp密码"
# 固定
gitlab_rails['smtp_domain'] = "163.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = false
gitlab_rails['smtp_tls'] = false
gitlab_rails['smtp_pool'] = false
gitlab_rails['smtp_openssl_verify_mode'] = 'none'
gitlab_rails['gitlab_email_enabled'] = true
#配置163邮箱，用于服务提示吧。例如发送激活账号激活邮件等 ***@163.com
gitlab_rails['gitlab_email_from'] = '****'
gitlab_rails['gitlab_email_display_name'] = '管理员'
#***@163.com,同个账号即可
gitlab_rails['gitlab_email_reply_to'] = '***@163.com'
gitlab_rails['manage_backup_path'] = true
# 备份文件，指定即可，不需要手动创建
gitlab_rails['backup_path'] = "/var/opt/gitlab/backups"
gitlab_rails['backup_gitaly_backup_path'] = "/opt/gitlab/embedded/bin/gitaly-backup"
gitlab_rails['backup_archive_permissions'] = 0644
gitlab_rails['backup_keep_time'] = 604800
gitlab_rails['gitlab_shell_ssh_port'] = 22
# ***@163.com
user['git_user_email'] = "***@163.com"
```


## 基本命令 
```sh
# 首次运行 reconfigure需要花费点时间，这可能是跟笔者在虚拟机上操作的原因
# 笔者在虚拟机上start后，可以访问到，但是页面502，过了5分钟左右之后才正常访问

#加载配置
gitlab-ctl reconfigure
gitlab-ctl restart
gitlab-ctl start
gitlab-ctl stop
```


::: tip
1、下载到本地是裸仓库的概念，而不是普通本地仓库

2、本地push到gitlab 远程前，要求远程仓库必须存在，所以需要搬出gitlab强大的说明文档
<a href="https://docs.gitlab.com/ee/api/projects.html#create-project" target="_blank"> https://docs.gitlab.com/ee/api/projects.html#create-project</a>
:::



## 批量下载并上传脚本

```sh
for line  in `cat c.txt`
do
  qianzhui='http://可以访问所有gogs仓库的用户名:密码@192.168.1.54:8090/'
  gitlabcangku='git@192.168.1.189:root/'
  # 裸仓库概念 可以保存所有的提交记录等
  git clone --bare $qianzhui$line
  dirt=${line##*/}      # 截取最后一段.git  目的是创建目录
  echo '当前ttt'$dirt
  dirt=${dirt//$'\r'} #/r是因为window复制进去，line 会生成/r结尾
  echo $dirt
  cd $dirt
  #以下就是强大gitlab ，运用curl可以创建仓库
  #token 在settings里面获取，具体百度
  curl --request POST --header "PRIVATE-TOKEN: Fs7DHipJHwviBKsYiTPL"  --header "Content-Type: application/json" --data '{"name":$dirt, "description": $dirt, "path": $dirt}' --url 'http://192.168.1.189:10018/api/v4/projects/'
  git push --mirror  $gitlabcangku$dirt
  echo $line'已完成' >> a.txt
  cd ..
done
```

至此迁移到gitlab完成

## 中间遇到无法上传的问题。
### git clone  命令有问题。

解决办法
<a href="https://www.jianshu.com/p/75c7367af460" target="_blank"> https://www.jianshu.com/p/75c7367af460</a>






