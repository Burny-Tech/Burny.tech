---
lang: zh-CN
title: git碎片化笔记
description: git碎片化笔记
---
# git

[[toc]]



## 回退远程仓库到上一个提交

#### gitt

```sh
# 查看是否还有哪些没提交或者修改
git status  
# 查看提交历史,找到回退到的那一个版本的commit号 前5位
git log  
# xxxxx 前5位
git reset --hard xxxx

# 检查分支情况
git branch

# 推送
git push origin  分支名称 --force

# 本操作是提交删除操作，会把reset前的文件删除掉。而不会有生成新的提交记录
```

