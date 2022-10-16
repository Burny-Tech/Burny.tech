# Docker

##  资源

* [中文网](https://dockerdocs.cn/index.html)

* [官网](https://www.docker.com/)
* [仓库官网，但是访问不了（2022年10月14日）](https://hub.docker.com/)
*  [阿里云镜像 仓库地址](https://mirrors.aliyun.com/centos-stream/9-stream/BaseOS/x86_64/iso/?spm=a2c6h.25603864.0.0.5211460d5Ti1PB)
* [CentOS-Stream-9-latest-x86_64-boot.iso  2022-10-04 03:55  ](https://mirrors.aliyun.com/centos-stream/9-stream/BaseOS/x86_64/iso/CentOS-Stream-9-latest-x86_64-boot.iso?spm=a2c6h.25603864.0.0.59cb408cQFamLy)



## 基础篇  `Docker Engine` 概述

* 作用
  * 运行基础命令，即可运行服务，解决不同机器之间导致的不同环境的配置。
  * 如安装`mysql`等。不需要通过下载源码包，安装，配置，启动等繁琐步骤
  * 环境配置相当麻烦，可减少时间
* 基本概念
  *  镜像：有点类似于`java`中的类， 一个镜像可以创建多个容器，仅包含服务运行的最小环境。可分为远程仓库的镜像 和本地仓库的镜像，有点类似于maven.
  *  容器： 有点类似于`java`中的对象，容器通过本地镜像运行，正在运行的容器不可删除本地镜像
  * 仓库 ： 存放镜像的地方。一个仓库有多个镜像。可有多个仓库，类似于maven仓库。分为公开仓库和私有仓库。最大的共有仓库（https://hub.docker.com/）
  * 版本：一个镜像文件可有多个版本。例如mysql镜像，有多个版本

* 守护线程和客户端
  * 运行一个docker 服务，即守护线程，准确来说是`Docker Engine` 可基于docker 服务上安装tomcat ,mysql rabbitmq等其他服务

* 常说的`Docker`准确来说是`Docker Engine`

### 底层技术

Docker用[Go编程语言](https://golang.org/)编写，并利用**Linux内核（即依赖于Linux内核）**的多种功能来交付其功能。Docker使用一种称为的技术`namespaces`来提供称为*容器*的隔离工作区。运行容器时，Docker会为该容器创建一组 *名称空间*。

这些名称空间提供了一层隔离。容器的每个方面都在单独的名称空间中运行，并且对其的访问仅限于该名称空间。



### docker和虚拟机的不同

VM(VMware)在宿主机器、宿主机器操作系统的基础上创建虚拟层、虚拟化的操作系统、虚拟化的仓库，然后再安装应用；，在宿主机OS上运行虚拟机OS

Container(Docker容器)，在宿主机器、宿主机器操作系统上创建Docker引擎，在引擎的基础上再安装应用。 与宿主主机共享OS

Docker容器提供了基于进程的隔离，而VM虚拟机提供了资源的完全隔离。容器使用宿主操作系统的内核，而虚拟机使用独立的内核。

VM 占用空间大 Docker 占用空间少



## 基础篇 Docker安装与卸载

[官网安装说明](https://docs.docker.com/engine/install/centos/)

[阿里云安装说明，但是有点旧](https://developer.aliyun.com/article/110806)

> 注意：此次实验采用全新的系统  安装虚拟机系统时需要注意，默认是安装带GUI的Server。我选择的是没有带GUI的Server
>
> 虚拟机 ip 192.168.1.157  root/root

  [阿里云镜像 仓库地址](https://mirrors.aliyun.com/centos-stream/9-stream/BaseOS/x86_64/iso/?spm=a2c6h.25603864.0.0.5211460d5Ti1PB)

| [CentOS-Stream-9-latest-x86_64-boot.iso](https://mirrors.aliyun.com/centos-stream/9-stream/BaseOS/x86_64/iso/CentOS-Stream-9-latest-x86_64-boot.iso?spm=a2c6h.25603864.0.0.59cb408cQFamLy) | 806.0 MB | 2022-10-04 03:55 |
| ------------------------------------------------------------ | -------- | ---------------- |  

###  安装过程
```sh

# 1. Docker要求CentOS系统的内核版本高于3.10 
[root@localhost ~]# uname -r
5.14.0-171.el9.x86_64

#2. yum 操作  ：删除系统自带的依赖包
  yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate  docker-engine &&  yum update -y  &&  yum install -y yum-utils &&  yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
  
 #2.2 替代掉原来的仓库 
sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo

#3. 
#3.1 centos8 之前是 yum makecache fast
#3.2 podman 容器与docker 冲突 ,删除podman(这个后续再了解有关系) 
#问题: 安装的软件包的问题 buildah-1:1.27.0-2.el9.x86_64
#  - 软件包 buildah-1:1.27.0-2.el9.x86_64 需要 runc >= 1.0.0-26，但没有提供者可以被安装
# - 软件包 containerd.io-1.6.6-3.1.el9.x86_64 与 runc（由 runc-4:1.1.3-2.el9.x86_64 提供）冲突
#  - 软件包 containerd.io-1.6.6-3.1.el9.x86_64 淘汰了 runc 提供的 runc-4:1.1.3-2.el9.x86_64

 rpm -q podman &&  yum erase podman buildah

yum makecache  && yum -y install docker-ce  &&  systemctl enable docker && systemctl start docker
 
#4 验证是否安装完成
 docker version
 
 
[root@localhost ~]# docker version
Client: Docker Engine - Community
 Version:           20.10.18
 API version:       1.41
 Go version:        go1.18.6
 Git commit:        b40c2f6
 Built:             Thu Sep  8 23:12:02 2022
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.18
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.18.6
  Git commit:       e42327a
  Built:            Thu Sep  8 23:09:37 2022
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.8
  GitCommit:        9cd3357b7fd7218e4aec3eae239db1f68a5a6ec6
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
  
  # 镜像加速 ,阿里云搜索镜像,进入控制台,个人版, 右边镜像加速器，查看个人的加速地址
  # 修改系统的加速地址
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://nx698r4f.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### docker 入门的  Hello-world

```sh
docker  run hello-world

# 结果
[root@localhost ~]# docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:2498fce14358aa50ead0cc6c19990fc6ff866ce72aeb5546e1d59caac3d0d60f
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/



```

`Docker` 在本地中寻找镜像，如果有直接用本地镜像，如果没有则从仓库拉下载下来，，并且以镜像为模板生成一个容器示例运行





## 基础篇 Docker常用命令

### 帮助命令

```sh
# 一览表
systemctl start docker 			#启动
 systemctl restart docker			#重启
  systemctl stop docker				# 停止
  systemctl status docker			# 状态
  systemctl enable docker   		# 自启动
 docker info    #docker信息
 docker --help  # 查看所有命令帮助
docker cp --help # 查看单独命令帮助
```

:::: code-group
::: code-group-item  docker info
```sh
[root@localhost ~]# docker info
Client:
 Context:    default
 Debug Mode: false
 Plugins:
  app: Docker App (Docker Inc., v0.9.1-beta3)
  buildx: Docker Buildx (Docker Inc., v0.9.1-docker)
  scan: Docker Scan (Docker Inc., v0.17.0)

Server:
 Containers: 0
  Running: 0
  Paused: 0
  Stopped: 0
 Images: 0
 Server Version: 20.10.18
 Storage Driver: overlay2
  Backing Filesystem: xfs
  Supports d_type: true
  Native Overlay Diff: true
  userxattr: false
 Logging Driver: json-file
 Cgroup Driver: systemd
 Cgroup Version: 2
 Plugins:
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
 Swarm: inactive
 Runtimes: io.containerd.runtime.v1.linux runc io.containerd.runc.v2
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: 9cd3357b7fd7218e4aec3eae239db1f68a5a6ec6
 runc version: v1.1.4-0-g5fd4c4d
 init version: de40ad0
 Security Options:
  seccomp
   Profile: default
  cgroupns
 Kernel Version: 5.14.0-171.el9.x86_64
 Operating System: CentOS Stream 9
 OSType: linux
 Architecture: x86_64
 CPUs: 1
 Total Memory: 1.732GiB
 Name: localhost.localdomain
 ID: ORWJ:FOLO:VBAA:OBU4:DXPV:EWZ4:JYOC:6ZBC:3VHO:WMHJ:S5NN:XD3Y
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 Registry: https://index.docker.io/v1/
 Labels:
 Experimental: false
 Insecure Registries:
  127.0.0.0/8
 Registry Mirrors:
  https://nx698r4f.mirror.aliyuncs.com/
 Live Restore Enabled: false



```


::: 
::: code-group-item  docker --help 
```sh
# 查看所有帮助
[root@localhost ~]# docker --help 

Usage:  docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
      --config string      Location of client config files (default "/root/.docker")
  -c, --context string     Name of the context to use to connect to the daemon (overrides DOCKER_HOST env var and default context set with "docker context use")
  -D, --debug              Enable debug mode
  -H, --host list          Daemon socket(s) to connect to
  -l, --log-level string   Set the logging level ("debug"|"info"|"warn"|"error"|"fatal") (default "info")
      --tls                Use TLS; implied by --tlsverify
      --tlscacert string   Trust certs signed only by this CA (default "/root/.docker/ca.pem")
      --tlscert string     Path to TLS certificate file (default "/root/.docker/cert.pem")
      --tlskey string      Path to TLS key file (default "/root/.docker/key.pem")
      --tlsverify          Use TLS and verify the remote
  -v, --version            Print version information and quit

Management Commands:
  app*        Docker App (Docker Inc., v0.9.1-beta3)
  builder     Manage builds
  buildx*     Docker Buildx (Docker Inc., v0.9.1-docker)
  config      Manage Docker configs
  container   Manage containers
  context     Manage contexts
  image       Manage images
  manifest    Manage Docker image manifests and manifest lists
  network     Manage networks
  node        Manage Swarm nodes
  plugin      Manage plugins
  scan*       Docker Scan (Docker Inc., v0.17.0)
  secret      Manage Docker secrets
  service     Manage services
  stack       Manage Docker stacks
  swarm       Manage Swarm
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  build       Build an image from a Dockerfile
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  images      List images
  import      Import the contents from a tarball to create a filesystem image
  info        Display system-wide information
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  login       Log in to a Docker registry
  logout      Log out from a Docker registry
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  ps          List containers
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  run         Run a command in a new container
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  search      Search the Docker Hub for images
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  version     Show the Docker version information
  wait        Block until one or more containers stop, then print their exit codes

Run 'docker COMMAND --help' for more information on a command.

To get more help with docker, check out our guides at https://docs.docker.com/go/guides/
[root@localhost ~]# 

```


::: 
::: code-group-item docker cp --help
```sh
# 查看单个命令帮助
[root@localhost ~]# docker cp --help

Usage:  docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
        docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH

Copy files/folders between a container and the local filesystem

Use '-' as the source to read a tar archive from stdin
and extract it to a directory destination in a container.
Use '-' as the destination to stream a tar archive of a
container source to stdout.

Options:
  -a, --archive       Archive mode (copy all uid/gid information)
  -L, --follow-link   Always follow symbol link in SRC_PATH

```


:::

::::







### 镜像命令

#### 常用命令一览表

```sh
docker iamges # 列出本地主机上的镜像
docker images -a   # 列出本地所有的镜像（含历史镜像层）   # 实验得到与上面的命令相同。待补充
docker images -q # 只显示镜像id
docker search redis # 查找仓库里面包含redis镜像名称
docker search redis --limit 5  # 只列出5个镜像，默认是25个
docker pull redis # 下载最新镜像，没有带上tag就是最新版的
docker pull redis:6.0  # 下载版本为6.0 的redis 如果美哟则报错
docker system df # 查看镜像，容器，数据卷所占用的空间
docker rmi 镜像id  # 删除指定单个镜像（id可取前4位即可）
docker rmi -f  镜像id # 删除指定单个镜像  
docker rmi -f 镜像名1：tag 镜像名2：tag  # 删除多个镜像
docker rmi -f $(docker images  -qa) #删除所哟镜像
```

#### 实验

:::: code-group
::: code-group-item  docker images

```sh
# 实验概述
列出本地主机上的镜像
# 实验过程
[root@localhost ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
hello-world   latest    feb5d9fea6a5   12 months ago   13.3kB
# 实验结果说明
1. 各个字段说明
REPOSITORY：表示镜像的仓库源, 理解为镜像名
TAG：镜像的标签版本号
IMAGE ID：镜像ID
CREATED：镜像创建时间
SIZE：镜像大小
2.同一仓库源可以有多个 TAG版本，代表这个仓库源的不同个版本，使用  REPOSITORY:TAG 来定义不同的镜像。
```
::: 
::: code-group-item docker images -a

```sh
# 实验概述
 列出本地所有的镜像（含历史镜像层）   
#实验过程
[root@localhost ~]# docker images -a
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
hello-world   latest    feb5d9fea6a5   12 months ago   13.3kB


#实验结果说明
 实验得到与上面的命令相同。待补充
```
::: code-group-item docker images -q

```sh
# 实验概述
只显示所有镜像id
#实验过程
[root@localhost ~]# docker images -q
feb5d9fea6a5



```
:::
::: code-group-item docker search redis

```sh
# 实验概述
查找仓库里面包含redis镜像名称
#实验过程
[root@localhost ~]# docker search redis
NAME                                        DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
redis                                       Redis is an open source key-value store that…   11397     [OK]       
bitnami/redis                               Bitnami Redis Docker Image                      229                  [OK]
bitnami/redis-sentinel                      Bitnami Docker Image for Redis Sentinel         39                   [OK]
bitnami/redis-cluster                                                                       34                   
redis/redis-stack                           redis-stack installs a Redis server with add…   15                   
rapidfort/redis                             RapidFort optimized, hardened image for Redi…   15                   
rapidfort/redis-cluster                     RapidFort optimized, hardened image for Redi…   15                   
circleci/redis                              CircleCI images for Redis                       14                   [OK]
ubuntu/redis                                Redis, an open source key-value store. Long-…   11                   
redis/redis-stack-server                    redis-stack-server installs a Redis server w…   10                   
bitnami/redis-exporter                                                                      9                    
clearlinux/redis                            Redis key-value data structure server with t…   4                    
ibmcom/redis-ha                                                                             1                    
bitnami/redis-sentinel-exporter                                                             1                    
ibmcom/ibm-cloud-databases-redis-operator   Container image for the IBM Operator for Red…   1                    
rapidfort/redis6-ib                         RapidFort optimized, hardened image for Redi…   0                    
vmware/redis-photon                                                                         0                    
cimg/redis                                                                                  0                    
ibmcom/redis-ppc64le                                                                        0                    
rancher/redislabs-ssl                                                                       0                    
drud/redis                                  redis                                           0                    [OK]
corpusops/redis                             https://github.com/corpusops/docker-images/     0                    
blackflysolutions/redis                     Redis container for Drupal and CiviCRM          0                    
ibmcom/redisearch-ppc64le                                                                   0                    
greenbone/redis-server                      A redis service container image for the Gree…   0               

#实验结果说明
 默认返回结果是25条
```
:::

::: code-group-item docker search redis --limit 5

```sh
# 实验概述
 查询仓库镜像指定返回条数
#实验过程
[root@localhost ~]# docker search redis --limit 5
NAME                       DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
redis                      Redis is an open source key-value store that…   11397     [OK]       
bitnami/redis              Bitnami Redis Docker Image                      229                  [OK]
redis/redis-stack          redis-stack installs a Redis server with add…   15                   
circleci/redis             CircleCI images for Redis                       14                   [OK]
redis/redis-stack-server   redis-stack-server installs a Redis server w…   10           
#实验结果说明

```

:::
::: code-group-item docker pull redis

```sh
# 实验概述
拉取redis最新镜像
#实验过程
[root@localhost ~]# docker pull redis 
Using default tag: latest
latest: Pulling from library/redis
a2abf6c4d29d: Pull complete 
c7a4e4382001: Pull complete 
4044b9ba67c9: Pull complete 
c8388a79482f: Pull complete 
413c8bb60be2: Pull complete 
1abfd3011519: Pull complete 
Digest: sha256:db485f2e245b5b3329fdc7eff4eb00f913e09d8feb9ca720788059fdc2ed8339
Status: Downloaded newer image for redis:latest
docker.io/library/redis:latest
[root@localhost ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
redis         latest    7614ae9453d1   9 months ago    113MB
hello-world   latest    feb5d9fea6a5   12 months ago   13.3kB


#实验结果说明
如果不加上版本号拉取最新镜像
```

:::

::: code-group-item docker pull redis:6.0

```sh
# 实验概述
拉取redis 指定版本镜像
#实验过程
[root@localhost ~]# docker pull redis:6.0
6.0: Pulling from library/redis
a2abf6c4d29d: Already exists 
c7a4e4382001: Already exists 
4044b9ba67c9: Already exists 
2b1fc7c1d01d: Pull complete 
956e458715d7: Pull complete 
cd2a61b616a9: Pull complete 
Digest: sha256:20756751c3382cf4867bef796eeda760e93022ec3decdd9803dea7a4f33f3b4b
Status: Downloaded newer image for redis:6.0
docker.io/library/redis:6.0
[root@localhost ~]# 

#实验结果说明
[root@localhost ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
redis         6.0       5e9f874f2d50   9 months ago    112MB
redis         latest    7614ae9453d1   9 months ago    113MB
hello-world   latest    feb5d9fea6a5   12 months ago   13.3kB


```

:::

::: code-group-item docker system df

```sh
# 实验概述
查看镜像，容器，数据卷所占用的空间
#实验过程
[root@localhost ~]# docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          3         1         139.5MB   139.5MB (99%)
Containers      1         0         0B        0B
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B

#实验结果说明

```

:::

::: code-group-item docker rmi -f 

```sh
# 实验概述
-f 代表--force，强制删除
#实验过程
# 通过镜像id删除
[root@localhost ~]# docker rmi  5e9f
Untagged: redis:6.0
Untagged: redis@sha256:20756751c3382cf4867bef796eeda760e93022ec3decdd9803dea7a4f33f3b4b
Deleted: sha256:5e9f874f2d504888de2e3f9e8ed15091532788f2079fd19d6c1d3b568eb16dc4
Deleted: sha256:b6bda3e6e5be376c3a8b2ce033cfafd19f8bb5917cfbbacc6daeaae92d856eef
Deleted: sha256:faaa193ad1d2e1e27a4618000bdffcfe42e96b0aa35a6f543a4f1204c10bbea3
Deleted: sha256:c5ca47d4f045673305fc0023f8bf9021dca70aed6e59c233c4cabd2e1488e673
# 通过repository:tag 删除
[root@localhost ~]# docker pull redis:6.0
6.0: Pulling from library/redis
a2abf6c4d29d: Already exists 
c7a4e4382001: Already exists 
4044b9ba67c9: Already exists 
2b1fc7c1d01d: Pull complete 
956e458715d7: Pull complete 
cd2a61b616a9: Pull complete 
Digest: sha256:20756751c3382cf4867bef796eeda760e93022ec3decdd9803dea7a4f33f3b4b
Status: Downloaded newer image for redis:6.0
docker.io/library/redis:6.0
# 删除多个
[root@localhost ~]# docker rmi -f redis:latest redis:6.0
Untagged: redis:latest
Untagged: redis@sha256:db485f2e245b5b3329fdc7eff4eb00f913e09d8feb9ca720788059fdc2ed8339
Deleted: sha256:7614ae9453d1d87e740a2056257a6de7135c84037c367e1fffa92ae922784631
Deleted: sha256:49c70179bc923a7d48583d58e2b6c21bde1787edf42ed1f8de9e9b96e2e88e65
Deleted: sha256:396e06df5d1120368a7a8a4fd1e5467cdc2dd4083660890df078c654596ddc1c
Deleted: sha256:434d118df2e9edb51238f6ba46e9efdfa21be68e88f54787531aa39a720a0740
Untagged: redis:6.0
Untagged: redis@sha256:20756751c3382cf4867bef796eeda760e93022ec3decdd9803dea7a4f33f3b4b
Deleted: sha256:5e9f874f2d504888de2e3f9e8ed15091532788f2079fd19d6c1d3b568eb16dc4
Deleted: sha256:b6bda3e6e5be376c3a8b2ce033cfafd19f8bb5917cfbbacc6daeaae92d856eef
Deleted: sha256:faaa193ad1d2e1e27a4618000bdffcfe42e96b0aa35a6f543a4f1204c10bbea3
Deleted: sha256:c5ca47d4f045673305fc0023f8bf9021dca70aed6e59c233c4cabd2e1488e673
Deleted: sha256:2047f09c412ff06f4e2ee8a25d105055e714d99000711e27a55072e640796294
Deleted: sha256:13d71c9ccb39b206211dd1900d06aa1984b0f5ab8abaa628c70b3eb733303a65
Deleted: sha256:2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f
# 删除所有  注意是（）而不是{}
[root@localhost ~]# docker rmi -f  $( docker images  -qa)
Untagged: hello-world:latest
Untagged: hello-world@sha256:2498fce14358aa50ead0cc6c19990fc6ff866ce72aeb5546e1d59caac3d0d60f
Deleted: sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412
[root@localhost ~
#实验结果说明
1. 
特别说明：
1. 指定id删除，可取前4位即可
2. 如果没有添加-f 的话，如果本地存在由该镜像生成的容器，则会报错

# 针对第二点实验
[root@localhost ~]# docker rmi hello-world
Error response from daemon: conflict: unable to remove repository reference "hello-world" (must force) - container ae963740b84e is using its referenced image feb5d9fea6a5

```
:::

::::

#### 虚悬镜像 

> 构建和删除镜像时出现错误,造成 仓库 和 标签都是``none``   

生成虚悬镜像,笔者已经事先写好文件`Dockerfile` .见下文 ,具体`Dockerfile` 怎么写后面有详细介绍

```sh

[root@localhost ~]# cd /data
[root@localhost data]# ll -a
总用量 4
drwxr-xr-x.  2 root root  24 10月 15 21:46 .
dr-xr-xr-x. 19 root root 247 10月 15 21:44 ..
-rw-r--r--.  1 root root  26 10月 15 21:46 Dockerfile
[root@localhost data]# cat Dockerfile 
from ubuntu
CMD echo 'ee'
[root@localhost data]# docker build .
Sending build context to Docker daemon  2.048kB
Step 1/2 : from ubuntu
latest: Pulling from library/ubuntu
7b1a6ab2e44d: Pull complete 
Digest: sha256:626ffe58f6e7566e00254b638eb7e0f3b11d4da9675088f4781a50ae288f3322
Status: Downloaded newer image for ubuntu:latest
 ---> ba6acccedd29
Step 2/2 : CMD echo 'ee'
 ---> Running in 5a80053fe61c
Removing intermediate container 5a80053fe61c
 ---> 4c14c1745c26
Successfully built 4c14c1745c26
## 虚悬镜像
[root@localhost data]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
<none>        <none>    4c14c1745c26   3 minutes ago   72.8MB
ubuntu        latest    ba6acccedd29   12 months ago   72.8MB
hello-world   latest    feb5d9fea6a5   12 months ago   13.3kB
#只查看虚悬镜像
[root@localhost data]# docker images  -f dangling=true
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
<none>       <none>    4c14c1745c26   8 minutes ago   72.8MB
# 删除虚悬镜像
# 注意这里是 image 而不是 images 
[root@localhost data]# docker images prune
REPOSITORY   TAG       IMAGE ID   CREATED   SIZE
[root@localhost data]# docker image prune
WARNING! This will remove all dangling images.
Are you sure you want to continue? [y/N] y
Deleted Images:
deleted: sha256:4c14c1745c268d9c085627bc73a701118d431bf9a38969e6e560b2bb4253ee84

Total reclaimed space: 0B
```





### 容器命令

#### 常用命令一览表

```sh
docker run [OPTIONS] IMAGE [COMMAND] [ARG...] # 新建 并 启动 一个容器 ,并指定环境,参数等
docker ps  [Options]  # 列出单签所有正在运行的容器
exit  # 退出容器,run进入容器,exit退出,容器停止 ,说法不是很对,见下文:关于启动和关闭主要解说  
ctrl+p+q # 退出容器,run 进去容器,ctrl+p+q 退出,容器不停止 说法不是很对,见下文:关于启动和关闭主要解说  
docker start 容器id或者容器名 # 启动已停止运行的容器
docker restart 容器id或者容器名 #重启已停止运行的容器
docker stop  容器id或者容器名 # 停止容器
docker kill  容器id或者容器名 # 强制停止容器
docker rm   容器id # 删除容器
docker rm -f $(docker ps -aq) # 删除所有容器
docker logs 容器id # 查看容器日志
docker top 容器id  # 查看容器内运行的进程
docker inspect 容器id # 查看容器内部细节
docker exec -it 容器id  /bin/bash #  进入正在运行的容器内部并以新的命令终端交互
docker attach 容器id  # 直接进入容器启动时的命令的终端,不会启动新的终端进程
docker cp 容器id:容器内路径 目的主机路径 # 复制 容器 复制到 主机上
docker export 容器id  > 文件名.tar   # 导出容器的内容留作为一个tar归档文件
docker impoart   -镜像用户/镜像名:镜像版本号  # 从tar 包中的内容创建一个新的文件系统再导入为镜像
```



#### 实验

* 有镜像才能创建容器,如果本地没有的话,会自动从远程仓库中下载  

::::  code-group
::: code-group-item docker run

```sh
# 实验概述
docker run [OPTIONS] IMAGE [COMMAND] [ARG...] 
 OPTIONS 有些是一个减号,有些是两个减号

 --name = "为容器指定一个名称" 如果不指定的话会随机生成一个名字



# 运行相关
 -d 后台运行容器并返回容器id ,也即启动守护式容器(后台运行)
 -i  以交互模式运行容器,通常与-t 同事使用
 -t 为容器重新分配一个伪输入终端,通常与 -i 同时使用 ,也即启动交互式容器(前台有伪终端,等待交互)

# 端口号相关
 -P 随机端口映射,大写
 -p hostPort: containerPort  # 指定端口映射,小写 ,将容器内的端口映射到主机的端口上
 -p ip:hostPort:contaerPort   #配置监听地址
 -p ip::containerPort  # 随机分配端口号
 -p hostPort:containerPort:udp   #指定协议 如 -p 8080:80:tcp
 -p 81:80 -p 443:443  #指定多个

 # 挂载(将容器内生成的数据 映射到宿主主机的目录上 ,或者 将容器内需要的数据,读取宿主主机的目录上的文件,一般是挂载数据文件到宿主主机上,例如mysql 则将数据文件挂载到宿主主机上)
 # 具体见数据卷章节

-v  主机目录1:容器内目录1  -v 主机目录2:容器内目录2



#实验过程

# 如果不指定名字则随机生成一个名字

[root@localhost ~]# docker run -itd redis:6.0 /bin/bash
090db27506b1255de24277a3a0273ed8c9262bfb31f9838c3f4616d586f29a3b

[root@localhost ~]# docker ps 
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                                       NAMES
090db27506b1   redis:6.0   "docker-entrypoint.s…"   8 seconds ago   Up 6 seconds   6379/tcp                                    kind_buck


# it 启动并直接进入容器内终端
[root@localhost data]# docker run  -it  -p 6388:6379 --name="myRedis"     redis:6.0   /bin/bash 
Unable to find image 'redis:6.0' locally
6.0: Pulling from library/redis
a2abf6c4d29d: Pull complete 
c7a4e4382001: Pull complete 
4044b9ba67c9: Pull complete 
2b1fc7c1d01d: Pull complete 
956e458715d7: Pull complete 
cd2a61b616a9: Pull complete 
Digest: sha256:20756751c3382cf4867bef796eeda760e93022ec3decdd9803dea7a4f33f3b4b
Status: Downloaded newer image for redis:6.0


root@0c1926e81c3b:/data# ls
root@0c1926e81c3b:/data# pwd
/data
# 退出后容器就不再运行了
root@0c1926e81c3b:/data# exit
exit
[root@localhost ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@localhost ~]# 

# -itd 启动不会进入容器内 ,注意此处端口号,由于已经将第一个6388 停止,这里才可以运行第二个容器, 6388 端口号
[root@localhost data]# docker run  -itd  -p 6388:6379 --name="myRedis2"     redis:6.0   /bin/bash 
b61a51f10125d1e9e684dfd88ac4c15ab98b4f10ab5a5ff97edc7bc046e84810
[root@localhost data]# 

# 如果只加d 的话  ,启动不了
[root@localhost data]# docker run  -d  -p 6516:6379 --name="myRedis4"     redis:6.0   /bin/bash 
e4ac4014d34b5a7737f9aac265f26ba7d49a0ccfe31f443c7a5bebc08dd71a4e

查看到的只有redis2 能成功运行
[root@localhost data]# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                                       NAMES
b61a51f10125   redis:6.0   "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:6388->6379/tcp, :::6388->6379/tcp   myRedis2

历史容器存在myRedis4
[root@localhost data]# docker ps -a
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                      PORTS                                       NAMES
e4ac4014d34b   redis:6.0     "docker-entrypoint.s…"   41 seconds ago   Exited (0) 40 seconds ago                                               myRedis4
a6512c5ad6a8   redis:6.0     "docker-entrypoint.s…"   2 minutes ago    Created                                                                 myRedis3
b61a51f10125   redis:6.0     "docker-entrypoint.s…"   4 minutes ago    Up 4 minutes                0.0.0.0:6388->6379/tcp, :::6388->6379/tcp   myRedis2
0c1926e81c3b   redis:6.0     "docker-entrypoint.s…"   9 minutes ago    Exited (0) 6 minutes ago                                                myRedis
ae963740b84e   hello-world   "/hello"                 13 hours ago     Exited (0) 13 hours ago                                                 upbeat_tu


启动myRedis4
[root@localhost data]# docker start e4a
e4a

还是没能启动
[root@localhost data]# docker ps 
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                                       NAMES
b61a51f10125   redis:6.0   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:6388->6379/tcp, :::6388->6379/tcp   myRedis2
[root@localhost data]# 

想查看日志但是没有返回日志
[root@localhost data]# docker ps -a
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                     PORTS                                       NAMES
e4ac4014d34b   redis:6.0     "docker-entrypoint.s…"   4 minutes ago    Exited (0) 3 minutes ago                                               myRedis4
a6512c5ad6a8   redis:6.0     "docker-entrypoint.s…"   6 minutes ago    Created                                                                myRedis3
b61a51f10125   redis:6.0     "docker-entrypoint.s…"   7 minutes ago    Up 7 minutes               0.0.0.0:6388->6379/tcp, :::6388->6379/tcp   myRedis2
0c1926e81c3b   redis:6.0     "docker-entrypoint.s…"   13 minutes ago   Exited (0) 9 minutes ago                                               myRedis
ae963740b84e   hello-world   "/hello"                 13 hours ago     Exited (0) 13 hours ago                                                upbeat_tu
[root@localhost data]# docker logs e4a
[root@localhost data]# 

# 后续说明后启动守护式容器

# 进入容器内部
[root@localhost ~]# docker exec -it  myRedis2  /bin/bash
root@b61a51f10125:/data# 


#实验结果

```
:::
::: code-group-item docker top
```sh
[root@localhost ~]# docker top myRedis2 
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                2446270             2446243             0                   11:42               pts/0               00:00:00            /bin/bash
root                3918639             2446243             0                   14:12               pts/1               00:00:00            /bin/bash
```
:::

::: code-group-item docker top
```sh
# 实验说明

# 实验过程
[root@localhost ~]# docker top myRedis2 
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                2446270             2446243             0                   11:42               pts/0               00:00:00            /bin/bash
root                3918639             2446243             0                   14:12               pts/1               00:00:00            /bin/bash

# 实验结果说明
以上有两个线程,是由于进入容器后,通过ctrl+p+q 退出,不会结束掉该进程,
如果是通过exit 退出容器,会结束掉该进程.但是不会结束掉容器,是因为进入是通过  ``docker  -it myRedis2 /bin/bash``  新建了一个终端
```
:::
::: code-group-item docker inspect
```sh
[root@localhost ~]# docker inspect  dazzling_lewin 


[
    {
        "Id": "9ff292ea60742c1a25f2baba34383411dbc258f33b677c2d871d90fbb18f9084",
        "Created": "2022-10-16T06:42:36.103228222Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "/bin/bash"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 738772,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2022-10-16T08:04:12.713691559Z",
            "FinishedAt": "2022-10-16T07:47:25.014795726Z"
        },
        "Image": "sha256:7614ae9453d1d87e740a2056257a6de7135c84037c367e1fffa92ae922784631",
        "ResolvConfPath": "/var/lib/docker/containers/9ff292ea60742c1a25f2baba34383411dbc258f33b677c2d871d90fbb18f9084/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/9ff292ea60742c1a25f2baba34383411dbc258f33b677c2d871d90fbb18f9084/hostname",
        "HostsPath": "/var/lib/docker/containers/9ff292ea60742c1a25f2baba34383411dbc258f33b677c2d871d90fbb18f9084/hosts",
        "LogPath": "/var/lib/docker/containers/9ff292ea60742c1a25f2baba34383411dbc258f33b677c2d871d90fbb18f9084/9ff292ea60742c1a25f2baba34383411dbc258f33b677c2d871d90fbb18f9084-json.log",
        "Name": "/dazzling_lewin",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "private",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "KernelMemory": 0,
            "KernelMemoryTCP": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": null,
            "PidsLimit": null,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/01cee46e9a3c63c92da3f894cb5979038d90dae802452c5554c7e08deef658e3-init/diff:/var/lib/docker/overlay2/521692b0df1349d688ee214c4ead6f194297e4e3bab813d91ae6a800aedab0eb/diff:/var/lib/docker/overlay2/61d329f4cc13e3bc2b07ef0f6157b7aecbc370c64064a23e1cb4831194f488b6/diff:/var/lib/docker/overlay2/256319e0f0b0b8c95a1731bb335cd108b14f3938df5f30ce701957880309e8b9/diff:/var/lib/docker/overlay2/9ddfd80a83118a852c7e3545cd14da011dbc6dd5aa122d20651502998f56591c/diff:/var/lib/docker/overlay2/36529dc49442e3c110e93d72247ee37a33526e7623b1c9049f5c799affae9907/diff:/var/lib/docker/overlay2/cc51ed071a716476f46f504e8b11496cea78a240c021071656688c489c8b3451/diff",
                "MergedDir": "/var/lib/docker/overlay2/01cee46e9a3c63c92da3f894cb5979038d90dae802452c5554c7e08deef658e3/merged",
                "UpperDir": "/var/lib/docker/overlay2/01cee46e9a3c63c92da3f894cb5979038d90dae802452c5554c7e08deef658e3/diff",
                "WorkDir": "/var/lib/docker/overlay2/01cee46e9a3c63c92da3f894cb5979038d90dae802452c5554c7e08deef658e3/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [
            {
                "Type": "volume",
                "Name": "4b7a80e3a69d3e3dd71ccfd7e1a3ae2f4b9e86770b7d47e0d81a8150d9d1f4fb",
                "Source": "/var/lib/docker/volumes/4b7a80e3a69d3e3dd71ccfd7e1a3ae2f4b9e86770b7d47e0d81a8150d9d1f4fb/_data",
                "Destination": "/data",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
        "Config": {
            "Hostname": "9ff292ea6074",
            "Domainname": "",
            "User": "",
            "AttachStdin": true,
            "AttachStdout": true,
            "AttachStderr": true,
            "ExposedPorts": {
                "6379/tcp": {}
            },
            "Tty": true,
            "OpenStdin": true,
            "StdinOnce": true,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "GOSU_VERSION=1.12",
                "REDIS_VERSION=6.2.6",
                "REDIS_DOWNLOAD_URL=http://download.redis.io/releases/redis-6.2.6.tar.gz",
                "REDIS_DOWNLOAD_SHA=5b2b8b7a50111ef395bf1c1d5be11e6e167ac018125055daa8b5c2317ae131ab"
            ],
            "Cmd": [
                "/bin/bash"
            ],
            "Image": "redis",
            "Volumes": {
                "/data": {}
            },
            "WorkingDir": "/data",
            "Entrypoint": [
                "docker-entrypoint.sh"
            ],
            "OnBuild": null,
            "Labels": {}
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "58e8b1ff26fcf4c16c2c4631b1fd737df90853131d386915237464b996b192dc",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {
                "6379/tcp": null
            },
            "SandboxKey": "/var/run/docker/netns/58e8b1ff26fc",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "7b44ea2cd96c7f3b16e07103e708b9b083bfec370f682b70adaefcf10c9796c4",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "514a276230535bd43cabb84a095ce3efd02413d65d426a457dc2a8359d8f5571",
                    "EndpointID": "7b44ea2cd96c7f3b16e07103e708b9b083bfec370f682b70adaefcf10c9796c4",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]

```
:::

::: code-group-item docker import && export

```sh
[root@localhost data]# docker export 9ff > /data/a.tar

[root@localhost data]# docker import a.tar  burny/burny2:0.0.1
sha256:f3f8aec4f3f42c704cf81b6272d9c32dbf43f0ee2324449ed01ba62e1ca47b92
[root@localhost data]# docker images
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
burny/burny2   0.0.1     f3f8aec4f3f4   5 seconds ago   109MB


```



::::

#### 关于启动和退出主要解说
**启动**

关键概念  

前台交互式    不会进入容器内  

后台守护式   会进入容器内

```sh
-d: 后台运行容器并返回容器ID，也即启动后台守护式容器(后台运行),不会进入容器内； 上面实验可以看到myRedis4

-i：以交互模式运行容器，通常与 -t 同时使用；
-t：为容器重新分配一个伪输入终端，通常与 -i 同时使用；

-it 合在一起即启动前台交互式容器(前台有伪终端，并进入容器内,等待交互)；
```
1. 前台交互式命令  
    ``docker run -it ....      ``
2. 后台守护式命令  
``​	docker run -d ...   ``
后台守护式命令存在的问题:  
只采用后台守护式容器 启动, ``docker ps -a ``进行查看, 会发现有些容器已经退出      
很重要的要说明的一点: ``Docker``容器后台运行,就必须有一个前台进程.       
​	容器运行的命令如果不是那些一直挂起的命令（比如运行top，tail），就是会自动退出的。      
​	这个是``docker``的机制问题,比如``web``容器,以``nginx``为例，正常情况下,      
​	配置启动服务只需要启动响应的``service``即可。例如``service nginx start      ``
​	但是,这样做,``nginx``为后台进程模式运行,就导致``docker``前台没有运行的应用,
​	这样的容器后台启动后,会立即自杀因为他觉得他没事可做了.      
​	所以，最佳的解决方案是,将要运行的程序**以前台交互式和后台守护式的形式新建并运行**，      
​	**docker run  -itd  ...**       
3. 如果启动的时候没有带上 /bin/bash 则会直接打开服务窗口   

**退出**

1. 如果采用`` docker -it `` 启动的时候  
    ``  exit `` 会退出容器内部  ,并且容器停止,    
   `` ctrl+p+q`` 只会退出容器内部,容器不会停止 
2. 如果采用 `` docker exec -it  /bin/bash`` 进入容器内部  
 ``  exit 会退出容器内部,并且容器内部会结束掉 `` /bin/bash ``进程  容器不会停止  
    ``  ctrl+p+q   ``会退出容器内部,并且容器内部 不会结束掉 `` /bin/bash ``进程  容器不会停止  

::::code-group
::: code-group-item 实验
```sh
如果没有带上/bin/bash 则会直接打开服务的端口
[root@localhost data]# docker run -it  redis 
Unable to find image 'redis:latest' locally
latest: Pulling from library/redis
a2abf6c4d29d: Already exists 
c7a4e4382001: Already exists 
4044b9ba67c9: Already exists 
c8388a79482f: Pull complete 
413c8bb60be2: Pull complete 
1abfd3011519: Pull complete 
Digest: sha256:db485f2e245b5b3329fdc7eff4eb00f913e09d8feb9ca720788059fdc2ed8339
Status: Downloaded newer image for redis:latest
1:C 16 Oct 2022 06:41:20.634 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 16 Oct 2022 06:41:20.635 # Redis version=6.2.6, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 16 Oct 2022 06:41:20.635 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
1:M 16 Oct 2022 06:41:20.636 * monotonic clock: POSIX clock_gettime
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 6.2.6 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                  
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 1
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           https://redis.io       
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

1:M 16 Oct 2022 06:41:20.645 # Server initialized  
1:M 16 Oct 2022 06:41:20.646 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 16 Oct 2022 06:41:20.647 * Ready to accept connections
^C1:signal-handler (1665902493) Received SIGINT scheduling shutdown...
1:M 16 Oct 2022 06:41:33.553 # User requested shutdown...
1:M 16 Oct 2022 06:41:33.553 * Saving the final RDB snapshot before exiting.
1:M 16 Oct 2022 06:41:33.558 * DB saved on disk
1:M 16 Oct 2022 06:41:33.558 # Redis is now ready to exit, bye bye...
[root@localhost data]# ^C

 按住ctrl+c 则结束容器
[root@localhost data]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@localhost data]# docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                     PORTS     NAMES
16c15cb3407d   redis     "docker-entrypoint.s…"   22 seconds ago   Exited (0) 8 seconds ago             gallant_mayer

如果带上/bin/bash ,则会进入容器内部
[root@localhost data]# docker run -it redis /bin/bash
root@6652a7187736:/data# exit
exit

 退出后容器则会停止了
[root@localhost data]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@localhost data]# docker run -it /bin/bsh
docker: invalid reference format.
See 'docker run --help'.
[root@localhost data]# docker run -it redis  /bin/bsh
/usr/local/bin/docker-entrypoint.sh: 16: exec: /bin/bsh: not found


通过 -it  /bin/bash 进入容器,如果输入 ctrl+p+q 则不会退出容器
[root@localhost data]# docker run -it redis  /bin/bash
root@9ff292ea6074:/data# [root@localhost data]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS      NAMES
9ff292ea6074   redis     "docker-entrypoint.s…"   5 seconds ago   Up 4 seconds   6379/tcp   dazzling_lewin


```
::: 
::::


  **重新进入**

``docker attach 容器id ``

该命令 是 粘附到 已建立的容器 ,新建容器的时候 的 ``/bin/bash ``  
同理:  
如果是exit 的话,则会结束掉新建容器的时候的    ``/bin/bash `` 进程 导致容器结束  
所以这个命令一般不需要用到 ,一般是用docker  exec -it 进入容器 

**总结**  
如果有带上`` /bin/bash ``或者 ``-it`` ,则会新建一个终端并且进入终端, 相当于运行了``/bin/bash``进程


如果启动的时候 什么都没有带上 ,则直接运行到服务的页面  ,``redis ``开启服务的页面

通过``exit ``则是 结束掉  当前的/bin/bash 进程,如果当前线程为启动线程,则会退出容器并且容器会结束  
通过``ctrl+p+q`` 则相当于将当前的``/bin/bash ``最小化并退出容器,当前``/bin/bash ``线程还存在  

这个可通过  ``docker top`` 命令得到验证

一般进入容器内通过   ``docker exec -it    ``  
然后退出用 ``ctrl+p+q  ``或者  ``exit   ``

## 基础篇Docker镜像

#### 是什么

1. 是一种轻量级、可执行的独立软件包，它包含运行某个软件所需的所有内容，我们把应用程序和配置依赖打包好形成一个可交付的运行环境(包括代码、运行时需要的库、环境变量和配置文件等)，这个打包好的运行环境就是image镜像文件。

   只有通过这个镜像文件才能生成Docker容器实例(类似Java中new出来一个对象)。

2. 分层镜像

   以pull为例，在下载的过程中我们可以看到docker的镜像好像是在一层一层的在下载

   ::: details

   ```sh
   [root@localhost data]# docker pull tomcat 
   Using default tag: latest
   latest: Pulling from library/tomcat
   0e29546d541c: Pull complete 
   9b829c73b52b: Pull complete 
   cb5b7ae36172: Pull complete 
   6494e4811622: Pull complete 
   668f6fcc5fa5: Extracting [=============>                                     ]  1.507MB/5.42MB
   dc120c3e0290: Download complete 
   8f7c0eebb7b1: Downloading [============================>                      ]  114.4MB/203.1MB
   77b694f83996: Download complete 
   0f611256ec3a: Download complete 
   4f25def12f23: Download complete 
   
   ```

   

   :::

3. `UnioFS`(联合文件系统)

   `UnionFS`（联合文件系统）：`Union`文件系统（`UnionFS`）是一种分层、轻量级并且高性能的文件系统，它支持对文件系统的修改作为一次提交来一层层的叠加，同时可以将不同目录挂载到同一个虚拟文件系统下(unite several directories into a single virtual filesystem)。`Union` 文件系统是 `Docker` 镜像的基础。镜像可以通过分层来进行继承，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像。

   **特性：一次同时加载多个文件系统，但从外面看起来，只能看到一个文件系统，联合加载会把各层文件系统叠加起来，这样最终的文件系统会包含所有底层的文件和目录**

4. 镜像加载原理,分层镜像

    `docker`的镜像实际上由一层一层的文件系统组成，这种层级的文件系统`UnionFS`。

   `bootfs`(`boot file system`)主要包含`bootloader`和`kernel, bootloader`主要是引导加载`kernel`, `Linux`刚启动时会加载`bootfs`文件系统，在`Docker`镜像的最底层是引导文件系统`bootfs`。这一层与我们典型的`Linux/Unix`系统是一样的，包含`boot`加载器和内核。当`boot`加载完成之后整个内核就都在内存中了，此时内存的使用权已由`bootfs`转交给内核，此时系统也会卸载`bootfs`。

   `rootfs (root file system)` ，在`bootfs`之上。包含的就是典型 `Linux` 系统中的 `/dev, /proc, /bin, /etc` 等标准目录和文件。`rootfs`就是各种不同的操作系统发行版，比如`Ubuntu，Centos`等等。 

5. Docker镜像采用理由

   镜像分层最大的一个好处就是共享资源，方便复制迁移，就是为了复用。

   比如说有多个镜像都从相同的 base 镜像构建而来，那么 Docker Host 只需在磁盘上保存一份 base 镜像；

   同时内存中也只需加载一份 base 镜像，就可以为所有容器服务了。而且镜像的每一层都可以被共享。

#### 总结

当容器启动时，一个新的可写层被加载到镜像的顶部。这一层通常被称作“容器层”**，“容器层”之下的都叫“镜像层”。**

所有对**容器的改动 - 无论添加、删除、还是修改文件都只会发生在容器层中。只有容器层是可写的**，容器层下面的**所有镜像层都是只读的**。

#### 常用命令

:::: code-group 

::: code-group-item docker commit 

```sh
# 实验概述
提交容器副本使之成为一个新的镜像
# 语法
docker commit -m =" 提交的描述信息" -a="作者" 容器id  要创建的目标镜像名:[标签名] 
##
# 实验过程

[root@localhost data]# docker commit  -m="测试" -a="burny" fb44 burny:0.0.1
sha256:0da8b284a254bcf57fdfb7810d8055ac722625461cacb6f1228b1fe2c9f6a4c5
[root@localhost data]# docker images
REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
burny          0.0.1     0da8b284a254   4 seconds ago    113MB
#### 经测试,如果采用相同的命令执行多次,则前一个镜像则会成为虚悬镜像

[root@localhost data]# docker commit  -m="测试" -a="burny" fb44 burny:0.0.1
sha256:fb5d3f8ba80a4d147f578c6a3e9a9f089fd56336f08bebdff62f123718729295
[root@localhost data]# docker images
REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
burny          0.0.1     fb5d3f8ba80a   3 seconds ago    113MB
<none>         <none>    b84f74671101   25 seconds ago   113MB
<none>         <none>    0da8b284a254   57 seconds ago   113MB

```



::::

## 基础篇 本地镜像发布到阿里云

![](/images/system/docker/001.png)

![](/images/system/docker/002.png)



#### 实验过程

```sh

[root@localhost data]# docker pull redis:6.0
6.0: Pulling from library/redis
a2abf6c4d29d: Pull complete 
c7a4e4382001: Pull complete 
4044b9ba67c9: Pull complete 
2b1fc7c1d01d: Pull complete 
956e458715d7: Pull complete 
cd2a61b616a9: Pull complete 
Digest: sha256:20756751c3382cf4867bef796eeda760e93022ec3decdd9803dea7a4f33f3b4b
Status: Downloaded newer image for redis:6.0
docker.io/library/redis:6.0
[root@localhost data]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
redis        6.0       5e9f874f2d50   9 months ago   112MB
[root@localhost data]# docker tag 5e registry.cn-shenzhen.aliyuncs.com/burny/burny_repository:0.0.1
[root@localhost data]# docker images
REPOSITORY                                                 TAG       IMAGE ID       CREATED        SIZE
redis                                                      6.0       5e9f874f2d50   9 months ago   112MB
registry.cn-shenzhen.aliyuncs.com/burny/burny_repository   0.0.1     5e9f874f2d50   9 months ago   112MB
[root@localhost data]# docker login --username=159*****@139.com registry.cn-shenzhen.aliyuncs.com
Password: 
Error response from daemon: Get "https://registry.cn-shenzhen.aliyuncs.com/v2/": unauthorized: authentication required
[root@localhost data]# docker login --username=159*****@139.com registry.cn-shenzhen.aliyuncs.com
Password: 
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
[root@localhost data]# docker push registry.cn-shenzhen.aliyuncs.com/burny/burny_repository:0.0.1
The push refers to repository [registry.cn-shenzhen.aliyuncs.com/burny/burny_repository]
a7ac00a4ba1c: Pushed 
5b117df093f2: Pushed 
42654c95dbc5: Pushed 
4b8e2801e0f9: Pushed 
9b24afeb7c2f: Pushed 
2edcec3590a4: Pushed 
0.0.1: digest: sha256:f7e09e24712bd2d944032fedf94e3a8f9ef44d7b63ea70c149396afc0a9c1abd size: 1573
[root@localhost data]# 

```


![](/images/system/docker/004.png)


#### 官网说明
##### 1. 登录阿里云Docker Registry

```
$ docker login --username=15992******@139.com registry.cn-shenzhen.aliyuncs.com
```

用于登录的用户名为阿里云账号全名，密码为开通服务时设置的密码。

您可以在访问凭证页面修改凭证密码。

##### 2. 从Registry中拉取镜像

```
$ docker pull registry.cn-shenzhen.aliyuncs.com/burny/burny_repository:[镜像版本号]
```

##### 3. 将镜像推送到Registry

```
$ docker login --username=15992******@139.com registry.cn-shenzhen.aliyuncs.com$ docker tag [ImageId] registry.cn-shenzhen.aliyuncs.com/burny/burny_repository:[镜像版本号]
$ docker push registry.cn-shenzhen.aliyuncs.com/burny/burny_repository:[镜像版本号]
```

请根据实际镜像信息替换示例中的[ImageId]和[镜像版本号]参数。

##### 4. 选择合适的镜像仓库地址

从ECS推送镜像时，可以选择使用镜像仓库内网地址。推送速度将得到提升并且将不会损耗您的公网流量。

如果您使用的机器位于VPC网络，请使用 registry-vpc.cn-shenzhen.aliyuncs.com 作为Registry的域名登录。

##### 5. 示例

使用"docker tag"命令重命名镜像，并将它通过专有网络地址推送至Registry。

```
$ docker imagesREPOSITORY                                                         TAG                 IMAGE ID            CREATED             VIRTUAL SIZEregistry.aliyuncs.com/acs/agent                                    0.7-dfb6816         37bb9c63c8b2        7 days ago          37.89 MB$ docker tag 37bb9c63c8b2 registry-vpc.cn-shenzhen.aliyuncs.com/acs/agent:0.7-dfb6816
```

使用 "docker push" 命令将该镜像推送至远程。

```
$ docker push registry-vpc.cn-shenzhen.aliyuncs.com/acs/agent:0.7-dfb6816
```



## 基础篇 本地镜像发布到私有库( Docker Registry)

```sh
1. 部署过程
[root@localhost data]# docker pull registry
[root@localhost data]# docker images
REPOSITORY                                                 TAG       IMAGE ID       CREATED         SIZE
redis                                                      6.0       5e9f874f2d50   9 months ago    112MB
registry.cn-shenzhen.aliyuncs.com/burny/burny_repository   0.0.1     5e9f874f2d50   9 months ago    112MB
registry                                                   latest    b8604a3fe854   11 months ago   26.2MB
# 挂载 目录不存在会自动创建
 [root@localhost data]# docker run -itd -p 5000:5000 -v  /data/docker/repository:/tmp/registry --privileged=true registry
 [root@localhost data]# firewall-cmd  --zone=public --permanent --add-port=5000/tcp
success
[root@localhost data]# firewall-cmd --reload
success

2. 查看私服仓库
http://192.168.1.157:5000/v2/_catalog
3. 将现有容器 制作成镜像并按规范进行重命名   或者将现有 的镜像进行重命名

[root@localhost data]# docker ps 
CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS          PORTS                                       NAMES
29d54c4fdf21   registry   "/entrypoint.sh /etc…"   12 minutes ago   Up 12 minutes   0.0.0.0:5000->5000/tcp, :::5000->5000/tcp   flamboyant_einstein
[root@localhost data]# docker commit -m="描述信息"   -a="作者"   29d  192.168.1.157:5000/burnyRepository:0.12
invalid reference format: repository name must be lowercase
[root@localhost data]# docker commit -m="描述信息"   -a="作者"   29d  192.168.1.157:5000/burny_repository:0.12
sha256:b9fc87f2937a70f7019ac6dc253cb629c3388dd8cc1f2ac1ad13526058a05b00
[root@localhost data]# docker images
REPOSITORY                                                 TAG       IMAGE ID       CREATED         SIZE
192.168.1.157:5000/burny_repository                        0.12      b9fc87f2937a   6 seconds ago   26.2MB
redis                                                      6.0       5e9f874f2d50   9 months ago    112MB
registry.cn-shenzhen.aliyuncs.com/burny/burny_repository   0.0.1     5e9f874f2d50   9 months ago    112MB
registry                                                   latest    b8604a3fe854   11 months ago   26.2MB
[root@localhost data]# docker tag registry:latest 192.168.1.157:5000/burny_repository:0.13
[root@localhost data]# docker images
REPOSITORY                                                 TAG       IMAGE ID       CREATED          SIZE
192.168.1.157:5000/burny_repository                        0.12      b9fc87f2937a   58 seconds ago   26.2MB
redis                                                      6.0       5e9f874f2d50   9 months ago     112MB
registry.cn-shenzhen.aliyuncs.com/burny/burny_repository   0.0.1     5e9f874f2d50   9 months ago     112MB
192.168.1.157:5000/burny_repository                        0.13      b8604a3fe854   11 months ago    26.2MB
registry                                                   latest    b8604a3fe854   11 months ago    26.2MB


4. 修改为可http访问
/etc/docker/daemon.json 
{
  "registry-mirrors": ["https://nx698r4f.mirror.aliyuncs.com"],
  "insecure-registries":["192.168.1.157:5000"]
}
systemctl restart docker
docker start registry


5.上传
[root@localhost data]# docker push 192.168.1.157:5000/burny_repository:0.12
The push refers to repository [192.168.1.157:5000/burny_repository]
dfdd3e82086d: Pushed 
aeccf26589a7: Pushed 
f640be0d5aad: Pushed 
aa4330046b37: Pushed 
ad10b481abe7: Pushed 
69715584ec78: Pushed 
0.12: digest: sha256:0351715f539b661b56f52b78ed23e9ae875d9b689cb03a0511573fe2ff721873 size: 1570

6. 下载
先删除本地仓库   burny_repository
[root@localhost data]# docker rmi 192.168.1.157:5000/burny_repository:0.12
Untagged: 192.168.1.157:5000/burny_repository:0.12
Untagged: 192.168.1.157:5000/burny_repository@sha256:0351715f539b661b56f52b78ed23e9ae875d9b689cb03a0511573fe2ff721873
Deleted: sha256:b9fc87f2937a70f7019ac6dc253cb629c3388dd8cc1f2ac1ad13526058a05b00
Deleted: sha256:c5455b661bb304fcebd80a6b7e5c5aba714bfc716e97d8e1d5a39fa2be3135c5


[root@localhost data]# docker pull 192.168.1.157:5000/burny_repository:0.12
0.12: Pulling from burny_repository
79e9f2f55bf5: Already exists 
0d96da54f60b: Already exists 
5b27040df4a2: Already exists 
e2ead8259a04: Already exists 
3790aef225b9: Already exists 
d40ebb39b429: Pull complete 
Digest: sha256:0351715f539b661b56f52b78ed23e9ae875d9b689cb03a0511573fe2ff721873
Status: Downloaded newer image for 192.168.1.157:5000/burny_repository:0.12
192.168.1.157:5000/burny_repository:0.12

验证


```

![](/images/system/docker/012.png)



## 基础篇 Docker 容器数据卷



容器内的文件挂载到宿主主机上,容器删除挂载到宿主主机上的文件不会删除

一旦要挂载需要加上  --privileged=true

>Docker挂载主机目录访问如果出现cannot open directory .: Permission denied
>
>解决办法：在挂载目录后多加一个--privileged=true参数即可
>
>如果是CentOS7安全模块会比之前系统版本加强，不安全的会先禁止，所以目录挂载的情况被默认为不安全的行为，
>
>在SELinux里面挂载目录被禁止掉了额，如果要开启，我们一般使用--privileged=true命令，扩大容器的权限解决挂载目录没有权限的问题，也即
>
>使用该参数，container内的root拥有真正的root权限，否则，container内的root只是外部的一个普通用户权限。



### 基础挂载

```sh
# 挂载 ,宿主主机上的文件 容器能读写
docker run -itd --privileged=true  -v 宿主主机绝对路径:容器内的路径 镜像名
# 默认就是rw,能读写
docker run -itd --privileged=true  -v 宿主主机绝对路径:容器内的路径:rw 镜像名
# 挂载 ,宿主主机上的文件 容器只能读
docker run -itd --privileged=true  -v 宿主主机绝对路径:容器内的路径:ro 镜像名


# 查看redis 工作目录

 "Volumes": {
                "/data": {}
            },
            "WorkingDir": "/data",

# 新建挂载
[root@localhost data]# docker run -itd --privileged -v /data/redis:/data redis:6.0
9ea8403356c575c4c4e9dc00a4eca5678307b8c59b2cd9f1feb9379748557e51

#查看挂载信息
 [root@localhost redis]# docker inspect 9ea


        "Mounts": [
            {
                "Type": "bind",
                "Source": "/data/redis",
                "Destination": "/data",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
```



### 挂载方式二 继承挂载规则

> 目的是容器之间的数据共享,拥有继承其他容器的卷规则



```sh
docker run -itd --privileged=true --volumes-from 要继承挂载规则的容器的id  --name redis redis 
```





## 基础篇 Docker 安装MySQL

### 单机

[命令查询来源](https://hub.docker.com/_/mysql)



```sh
[root@localhost redis]# docker run -itd -p 3306:3306 --privileged=true  -v /data/mysql/log:/var/log/mysql -v /data/mysql/data:/var/lib/mysql -v /data/mysql/conf:/etc/mysql/conf.d  -e MYSQL_ROOT_PASSWORD=123456 --name burny_mysql --restart=always    mysql

vim /data/mysql/conf/my.cnf
default_character_set = utf8
collation_server= utf8_general_ci
character_set_server = utf8

firewall-cmd  --zone=public --permanent --add-port=3306/tcp
firewall-cmd --reload

即可连接了
```

### 主从复制

```sh

[root@localhost conf]# docker stop $(docker ps -q) && docker rm $(docker ps -qa)

rm -rf /mydata/mysql*

# 前提准备
mkdir -p  /mydata/mysql-master/log

mkdir -p /mydata/mysql-master/data
mkdir -p /mydata/mysql-master/conf

vim /mydata/mysql-master/conf/my.cnf

[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=101 
## 指定不需要同步的数据库名称
binlog-ignore-db=mysql  
## 开启二进制日志功能
log-bin=mall-mysql-bin  
## 设置二进制日志使用内存大小（事务）
binlog_cache_size=1M  
## 设置使用的二进制日志格式（mixed,statement,row）
binlog_format=mixed  
## 二进制日志过期清理时间。默认值为0，表示不自动清理。
expire_logs_days=7  
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062
secure_file_priv=


# secure_file_priv 配置说明

secure_file_priv 为 NULL 时，表示限制mysqld不允许导入或导出。
secure_file_priv 为 /tmp 时，表示限制mysqld只能在/tmp目录中执行导入导出，其他目录不能执行。
secure_file_priv 没有值时，表示不限制mysqld在任意目录的导入导出。


mkdir -p   /mydata/mysql-slave/conf/
vim /mydata/mysql-slave/conf/my.cnf

[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=102
## 指定不需要同步的数据库名称
binlog-ignore-db=mysql  
## 开启二进制日志功能，以备Slave作为其它数据库实例的Master时使用
log-bin=mall-mysql-slave1-bin  
## 设置二进制日志使用内存大小（事务）
binlog_cache_size=1M  
## 设置使用的二进制日志格式（mixed,statement,row）
binlog_format=mixed  
## 二进制日志过期清理时间。默认值为0，表示不自动清理。
expire_logs_days=7  
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062  
## relay_log配置中继日志
relay_log=mall-mysql-relay-bin  
## log_slave_updates表示slave将复制事件写进自己的二进制日志
log_slave_updates=1  
## slave设置为只读（具有super权限的用户除外）
read_only=1
secure_file_priv=

# 开放端口号
firewall-cmd  --zone=public --permanent --add-port=3307/tcp
firewall-cmd  --zone=public --permanent --add-port=3308/tcp
firewall-cmd --reload


# 步骤一
docker run -p 3307:3306 --name mysql-master --privileged=true -v /mydata/mysql-master/log:/var/log/mysql -v /mydata/mysql-master/data:/var/lib/mysql -v /mydata/mysql-master/conf:/etc/mysql --restart=always  -e MYSQL_ROOT_PASSWORD=123456 -d  -itd mysql:8

# 步骤二
docker exec -it mysql-master /bin/bash
mysql -u root  -p123456

create user 'slave'@'%' IDENTIFIED BY 'slave';
grant replication slave,replication client on *.* to 'slave'@'%';
flush privileges;

show  master  status\G;
# 查询主数据库 的状态
mysql> show  master  status\G;
*************************** 1. row ***************************
# 这个很重要 file 和positoion都很重要
             File: mall-mysql-bin.000003
         Position: 878
     Binlog_Do_DB: 
 Binlog_Ignore_DB: mysql
Executed_Gtid_Set: 
1 row in set (0.00 sec)



# 步骤三
docker run -p 3308:3306 --name mysql-slave -v /mydata/mysql-slave/log:/var/log/mysql -v /mydata/mysql-slave/data:/var/lib/mysql  -v /mydata/mysql-slave/conf:/etc/mysql  --restart always  -e MYSQL_ROOT_PASSWORD=123456  -d mysql:8

# 步骤四 从数据库配置主从复制
master_host：主数据库的IP地址；
master_port：主数据库的运行端口；
master_user：在主数据库创建的用于同步数据的用户账号；
master_password：在主数据库创建的用于同步数据的用户密码；
master_log_file：指定从数据库要复制数据的日志文件，通过查看主数据的状态，获取File参数；
master_log_pos：指定从数据库从哪个位置开始复制数据，通过查看主数据的状态，获取Position参数；
master_connect_retry：连接失败重试的时间间隔，单位为秒。


docker exec -it mysql-slave  /bin/bash
mysql -u root -p123456


#查看从数据库状态
show slave  status \G; 
# 查看结果------
mysql> show slave status \G;
Empty set, 1 warning (0.01 sec)

ERROR: 
No query specified


# 从数据库上配置  主从复制 master_log_file master_log_pos以下两个参数来自于 上面主数据库中的show master status;
change master to master_host='192.168.1.157' , master_user= 'slave',master_password= 'slave',master_port=3307,master_log_file='mall-mysql-bin.000003' , master_log_pos=878  , master_connect_retry=30 ;

show  slave  status \G;  # 发现slave_io_running  和 slave_SQL_Running 都为no 还没开启,需要开启下 
start slave;
show  slave  status \G;  #再次查看
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes

# 步骤四
```

![](/images/system/docker/013.png)

## 基础篇 集群Redis

### 分区算法

#### 哈希取余分区

缺点:原来规划好的节点，进行扩容或者缩容就比较麻烦了，不管扩缩，每次数据变动导致节点有变动，映射关系需要重新进行计算，在服务器个数固定不变时没有问题，如果需要弹性扩容或故障停机的情况下，原来的取模公式就会发生变化：Hash(key)/3会变成Hash(key) /?。此时地址经过取余运算的结果将发生很大变化，根据公式获取的服务器也会变得不可控。

某个redis机器宕机了，由于台数数量变化，会导致hash取余全部数据重新洗牌。

#### 一致性哈希算法分区

>为了解决 分布式缓存数据变动和映射问题，某个机器宕机了，分母数量改变了，自然取余数不OK了。

>提出一致性hash 解决方案.
>
>目的是当服务器个数发生变动时
>
>尽量减少影响客户端到服务器的映射关系

##### 过程



1.

一致性Hash算法是对2^32取模，简单来说，一致性Hash算法将整个哈希值空间组织成一个虚拟的圆环，如假设某哈希函数H的值空间为0-2^32-1（即哈希值是一个32位无符号整形），整个哈希环如下图：整个空间按顺时针方向组织，圆环的正上方的点代表0，0点右侧的第一个点代表1，以此类推，2、3、4、……直到2^32-1，也就是说0点左侧的第一个点代表2^32-1， 0和2^32-1在零点中方向重合，我们把这个由2^32个点组成的圆环称为Hash环。

![](/images/system/docker/014.png)

2.

将集群中各个IP节点映射到环上的某一个位置。

  将各个服务器使用Hash进行一个哈希，具体可以选择服务器的IP或主机名作为关键字进行哈希，这样每台机器就能确定其在哈希环上的位置。假如4个节点NodeA、B、C、D，经过IP地址的哈希函数计算(hash(ip))，使用IP地址哈希后在环空间的位置如下：

![](/system/images/docker/015.png)

3.

​	当我们需要存储一个kv键值对时，首先计算key的hash值，hash(key)，将这个key使用相同的函数Hash计算出哈希值并确定此数据在环上的位置，**从此位置沿环顺时针“行走”**，第一台遇到的服务器就是其应该定位到的服务器，并将该键值对存储在该节点上。

​	如我们有Object A、Object B、Object C、Object D四个数据对象，经过哈希计算后，在环空间上的位置如下：根据一致性Hash算法，数据A会被定为到Node A上，B被定为到Node B上，C被定为到Node C上，D被定为到Node D上。

##### 优点

容错性: 当C挂了，受到影响的只是B、C之间的数据，并且这些数据会转移到D进行存储。

扩展性:  数据量增加了，需要增加一台节点NodeX，X的位置在A和B之间，那收到影响的也就是A到X之间的数据，重新把A到X的数据录入到X上即可，不会导致hash取余全部数据重新洗牌。

##### 缺点

一致性Hash算法在服务**节点太少时**，容易因为节点分布不均匀而造成**数据倾斜**（被缓存的对象大部分集中缓存在某一台服务器上）问题，

#### 哈希槽分区

##### 是什么

解决数据倾斜问题  哈希槽实质就是一个数组，数组[0,2^14 -1]形成hash slot空间。



为了解决均匀分配的问题，在数据和节点之间又加入了一层，把这层称为哈希槽（slot），用于管理数据和节点之间的关系，现在就相当于节点上放的是槽，槽里放的是数据。

![](/system/images/docker/016.png)

槽解决的是粒度问题，相当于把粒度变大了，这样便于数据移动。

哈希解决的是映射问题，使用key的哈希值来计算所在的槽，便于数据分配。



一个集群只能有16384个槽，编号0-16383（0-2^14-1）。这些槽会分配给集群中的所有主节点，分配策略没有要求。可以指定哪些编号的槽分配给哪个主节点。集群会记录节点和槽的对应关系。解决了节点和槽的关系后，接下来就需要对key求哈希值，然后对16384取余，余数是几key就落入对应的槽里。slot = CRC16(key) % 16384。以槽为单位移动数据，因为槽的数目是固定的，处理起来比较容易，这样数据移动问题就解决了。



##### 怎么计算

Redis 集群中内置了 16384 个哈希槽，redis 会根据节点数量大致均等的将哈希槽映射到不同的节点。当需要在 Redis 集群中放置一个 key-value时，redis 先对 key 使用 crc16 算法算出一个结果，然后把结果对 16384 求余数，这样每个 key 都会对应一个编号在 0-16383 之间的哈希槽，也就是映射到某个节点上。如下代码，key之A 、B在Node2， key之C落在Node3上

### 部署

```sh

[root@localhost ~]# yum -y install python3-pip
[root@localhost ~]# pip3 install docker-compose


[root@localhost ~]# mkdir -p /usr/local/etc/redis/sentinel/data
[root@localhost ~]# mkdir -p /usr/local/etc/redis/sentinel/sentinel
[root@localhost ~]# mkdir -p /usr/local/etc/redis/sentinel/server

 310  yum -y install python3-pip
  311  pip3 install docker-compose
  312  mkdir -p /usr/local/etc/redis/sentinel/
  313  mkdir -p /usr/local/etc/redis/sentinel/data
  314  mkdir -p /usr/local/etc/redis/sentinel/sentinel
  315  mkdir -p /usr/local/etc/redis/sentinel/server
  316  vim  /usr/local/etc/redis/sentinel/redis-sentinel-1.conf
  317  vim  /usr/local/etc/redis/sentinel/redis-sentinel-2.conf
  318  vim  /usr/local/etc/redis/sentinel/redis-sentinel-3.conf
  319  mkdir -p /usr/local/etc/redis/sentinel/server
  320  vim /usr/local/etc/redis/sentinel/server
  321  vim /usr/local/etc/redis/sentinel/server/redis-master.conf
  322  vim /usr/local/etc/redis/sentinel/server/redis-slave1.conf
  324  vim  /usr/local/etc/redis/sentinel/docker-compose.yml
  325  cp /usr/local/etc/redis/sentinel/redis-* /usr/local/etc/redis/sentinel/sentinel/
  326  vim  /usr/local/etc/redis/sentinel/sentinel/docker-compose.yml
  327  vim  /usr/local/etc/redis/sentinel/server/docker-compose.yml
  328  cd /usr/local/etc/redis/sentinel/server
  329  docker-compose up
  330  sysctl |grep  net.core.somaxconn
  331  sysctl -a |grep  net.core.somaxconn
  332  cd /usr/local/etc/redis/sentinel/server/
  333  docker up
  334  docker-compose up
  335  docker ps -a
  336  docker stop $(docker ps -q) && docker rm $(docker ps -qa)
  337  docker-compose up
  338  docker ps
  339  docker-compose up
```



::::code-group

:::code-group-item redis-sentinel-1.conf

```sh
# /usr/local/etc/redis/sentinel/sentinel/
# bind 127.0.0.1

# 哨兵的端口号
# 因为各个哨兵节点会运行在单独的Docker容器中
# 所以无需担心端口重复使用
# 如果需要在单机
port 26379

# 设定密码认证
requirepass 123456

# 配置哨兵的监控参数
# 格式：sentinel monitor <master-name> <ip> <redis-port> <quorum>
# master-name是为这个被监控的master起的名字
# ip是被监控的master的IP或主机名。因为Docker容器之间可以使用容器名访问，所以这里写master节点的容器名
# redis-port是被监控节点所监听的端口号
# quorom设定了当几个哨兵判定这个节点失效后，才认为这个节点真的失效了
sentinel monitor local-master 127.0.0.1 6379 2

# 连接主节点的密码
# 格式：sentinel auth-pass <master-name> <password>
sentinel auth-pass local-master 123456

# master在连续多长时间无法响应PING指令后，就会主观判定节点下线，默认是30秒
# 格式：sentinel down-after-milliseconds <master-name> <milliseconds>
sentinel down-after-milliseconds local-master 30000
```



:::

:::code-group-item redis-sentinel-2.conf

```sh
# /usr/local/etc/redis/sentinel/sentinel/
# bind 127.0.0.1

# 哨兵的端口号
# 因为各个哨兵节点会运行在单独的Docker容器中
# 所以无需担心端口重复使用
# 如果需要在单机
port 26380

# 设定密码认证
requirepass 123456

# 配置哨兵的监控参数
# 格式：sentinel monitor <master-name> <ip> <redis-port> <quorum>
# master-name是为这个被监控的master起的名字
# ip是被监控的master的IP或主机名。因为Docker容器之间可以使用容器名访问，所以这里写master节点的容器名
# redis-port是被监控节点所监听的端口号
# quorom设定了当几个哨兵判定这个节点失效后，才认为这个节点真的失效了
sentinel monitor local-master 127.0.0.1 6379 2

# 连接主节点的密码
# 格式：sentinel auth-pass <master-name> <password>
sentinel auth-pass local-master 123456

# master在连续多长时间无法响应PING指令后，就会主观判定节点下线，默认是30秒
# 格式：sentinel down-after-milliseconds <master-name> <milliseconds>
sentinel down-after-milliseconds local-master 30000
```



:::

:::code-group-item redis-sentinel-3.conf

```sh
# /usr/local/etc/redis/sentinel/sentinel/
# bind 127.0.0.1

# 哨兵的端口号
# 因为各个哨兵节点会运行在单独的Docker容器中
# 所以无需担心端口重复使用
# 如果需要在单机
port 26381

# 设定密码认证
requirepass 123456

# 配置哨兵的监控参数
# 格式：sentinel monitor <master-name> <ip> <redis-port> <quorum>
# master-name是为这个被监控的master起的名字
# ip是被监控的master的IP或主机名。因为Docker容器之间可以使用容器名访问，所以这里写master节点的容器名
# redis-port是被监控节点所监听的端口号
# quorom设定了当几个哨兵判定这个节点失效后，才认为这个节点真的失效了
sentinel monitor local-master 127.0.0.1 6379 2

# 连接主节点的密码
# 格式：sentinel auth-pass <master-name> <password>
sentinel auth-pass local-master 123456

# master在连续多长时间无法响应PING指令后，就会主观判定节点下线，默认是30秒
# 格式：sentinel down-after-milliseconds <master-name> <milliseconds>
sentinel down-after-milliseconds local-master 30000
```



:::

:::code-group-item redis-master.conf

```sh

#/usr/local/etc/redis/sentinel/server
# bind 127.0.0.1

# 启用保护模式
# 即在没有使用bind指令绑定具体地址时
# 或在没有设定密码时
# Redis将拒绝来自外部的连接
# protected-mode yes

# 监听端口
port 6379

# 启动时不打印logo
# 这个不重要，想看logo就打开它
always-show-logo no

# 设定密码认证
requirepass 123456

# 禁用KEYS命令
# 一方面 KEYS * 命令可以列出所有的键，会影响数据安全
# 另一方面 KEYS 命令会阻塞数据库，在数据库中存储了大量数据时，该命令会消耗很长时间
# 期间对Redis的访问也会被阻塞，而当锁释放的一瞬间，大量请求涌入Redis，会造成Redis直接崩溃
rename-command KEYS ""

# 此外还应禁止 FLUSHALL 和 FLUSHDB 命令
# 这两个命令会清空数据，并且不会失败
```



:::

:::code-group-item  redis-slave1.conf

```sh
#/usr/local/etc/redis/sentinel/server
# bind 127.0.0.1 redis-slave1.conf

# 启用保护模式
# 即在没有使用bind指令绑定具体地址时
# 或在没有设定密码时
# Redis将拒绝来自外部的连接
# protected-mode yes

# 监听端口
port 6380

# 启动时不打印logo
# 这个不重要，想看logo就打开它
always-show-logo no

# 设定密码认证
requirepass 123456

# 禁用KEYS命令
# 一方面 KEYS * 命令可以列出所有的键，会影响数据安全
# 另一方面 KEYS 命令会阻塞数据库，在数据库中存储了大量数据时，该命令会消耗很长时间
# 期间对Redis的访问也会被阻塞，而当锁释放的一瞬间，大量请求涌入Redis，会造成Redis直接崩溃
rename-command KEYS ""

# 此外还应禁止 FLUSHALL 和 FLUSHDB 命令
# 这两个命令会清空数据，并且不会失败

# 配置master节点信息
# 格式：
#slaveof <masterip> <masterport>
# 此处masterip所指定的redis-server-master是运行master节点的容器名
# Docker容器间可以使用容器名代替实际的IP地址来通信
slaveof 127.0.0.1 6379

# 设定连接主节点所使用的密码
masterauth "123456"
```

:::

:::code-group-item  redis-slave1.conf

```sh
#/usr/local/etc/redis/sentinel/server
# bind 127.0.0.1 redis-slave1.conf

# 启用保护模式
# 即在没有使用bind指令绑定具体地址时
# 或在没有设定密码时
# Redis将拒绝来自外部的连接
# protected-mode yes

# 监听端口
port 6381

# 启动时不打印logo
# 这个不重要，想看logo就打开它
always-show-logo no

# 设定密码认证
requirepass 123456

# 禁用KEYS命令
# 一方面 KEYS * 命令可以列出所有的键，会影响数据安全
# 另一方面 KEYS 命令会阻塞数据库，在数据库中存储了大量数据时，该命令会消耗很长时间
# 期间对Redis的访问也会被阻塞，而当锁释放的一瞬间，大量请求涌入Redis，会造成Redis直接崩溃
rename-command KEYS ""

# 此外还应禁止 FLUSHALL 和 FLUSHDB 命令
# 这两个命令会清空数据，并且不会失败

# 配置master节点信息
# 格式：
#slaveof <masterip> <masterport>
# 此处masterip所指定的redis-server-master是运行master节点的容器名
# Docker容器间可以使用容器名代替实际的IP地址来通信
slaveof 127.0.0.1 6379

# 设定连接主节点所使用的密码
masterauth "123456"
```

:::

:::code-group-item docker-compose.yml

```yaml
#  /usr/local/etc/redis/sentinel/sentinel

---

version: '3'

services:
  redis-sentinel-1:
    image: redis
    container_name: redis-sentinel-1
    restart: always
    # 为了规避Docker中端口映射可能带来的问题
    # 这里选择使用host网络
    network_mode: host
    volumes:
      - ./redis-sentinel-1.conf:/usr/local/etc/redis/redis-sentinel.conf
    # 指定时区，保证容器内时间正确
    environment:
      TZ: "Asia/Shanghai"
    command: ["redis-sentinel", "/usr/local/etc/redis/redis-sentinel.conf"]
  redis-sentinel-2:
    image: redis
    container_name: redis-sentinel-2
    restart: always
    network_mode: host
    volumes:
      - ./redis-sentinel-2.conf:/usr/local/etc/redis/redis-sentinel.conf
    environment:
      TZ: "Asia/Shanghai"
    command: ["redis-sentinel", "/usr/local/etc/redis/redis-sentinel.conf"]
  redis-sentinel-3:
    image: redis
    container_name: redis-sentinel-3
    restart: always
    network_mode: host
    volumes:
      - ./redis-sentinel-3.conf:/usr/local/etc/redis/redis-sentinel.conf
    environment:
      TZ: "Asia/Shanghai"
    command: ["redis-sentinel", "/usr/local/etc/redis/redis-sentinel.conf"]\
```

:::

:::code-group-item docker-compose.yaml

```yaml
# /usr/local/etc/redis/sentinel/server

---

version: '3'

services:
  # 主节点的容器
  redis-server-master:
    image: redis
    container_name: redis-server-master
    restart: always
    # 为了规避Docker中端口映射可能带来的问题
    # 这里选择使用host网络
    network_mode: host
    # 指定时区，保证容器内时间正确
    environment:
      TZ: "Asia/Shanghai"
    volumes:
      # 映射配置文件和数据目录
      - ./redis-master.conf:/usr/local/etc/redis/redis.conf
      - ./data/redis-master:/data

    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
  # 从节点1的容器
  redis-server-slave-1:
    image: redis
    container_name: redis-server-slave-1
    restart: always
    network_mode: host
    depends_on:
      - redis-server-master
    environment:
      TZ: "Asia/Shanghai"
    volumes:
      - ./redis-slave1.conf:/usr/local/etc/redis/redis.conf
      - ./data/redis-slave-1:/data
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
  # 从节点2的容器
  redis-server-slave-2:
    image: redis
    container_name: redis-server-slave-2
    restart: always
    network_mode: host
    depends_on:
      - redis-server-master
    environment:
      TZ: "Asia/Shanghai"
    volumes:
      - ./redis-slave2.conf:/usr/local/etc/redis/redis.conf
      - ./data/redis-slave-2:/data
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
```





::::

![](/system/images/docker/017.png)



```sh
    public void testww(){
        //  org.springframework.data.redis.connection
        ClusterSlotHashUtil.calculateSlot("A");
        ClusterSlotHashUtil.calculateSlot("B");
        ClusterSlotHashUtil.calculateSlot("C");
    }
```





## 进阶篇

### Docker 复杂安装详说

### DockerFile解析

### Docker 微服务实战

### Docker网络

### Docker-compose 容器安排

### Docker 轻量化级可视化工具 Portainer

### Docker 容器监控 CAdvisor+InfluxDB+Granfana

### 终结