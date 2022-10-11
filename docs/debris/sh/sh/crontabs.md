# 定时任务



```sh

# 安装并设置开机自启
yum install crontabs 
systemctl enable crond
systemctl start crond
systemctl status crond 

# 配置定时任务
vi /etc/crontab 
    
    
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
 
# For details see man 4 crontabs
 
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
 
#每60分种执行
# */60 * * * * root /root/java/test1.sh
#每天1点20分 执行
# 20 1 * * * root /root/java/test2.sh
#文件最后一定要留一个空行，不然命名：crontab /etc/crontab会报错
 
 #修改执行权限
chmod 777 /usr/local/mycommand.sh
#重启生效
sudo systemctl restart crond.service 

#注意得地方 和路径
mycommand.sh 顶行要加上#! /bin/sh

# 保存生效，加载任务
crontab /etc/crontab


# 查看任务，首次使用需使用 crontab -e  生成环境
crontab -l
crontab -u 用户名 -l #列出用户的定时任务列表



tailf /var/log/cron
```

