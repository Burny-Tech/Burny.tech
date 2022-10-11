---
lang: zh-CN
title: Arthas
description: Arthas
---

# Arthas

[官网](https://arthas.aliyun.com/doc/)

[[toc]]

## 可解决问题

1. 类从哪个jar包中加载，为什么会报各种Exception
2. 改的代码有没有执行到？
3. 无需增加日志在重新发布生jar包到身缠环境
4. 可以线上debug
5. 是否有一个全局视角来查看系统的运行情况
6. 监控JVM实时运行的状态
7. 快速定位应用的热点，生成火焰图

![](/images/system/Arthas/001.png)

## 前提概要

* 支持Linux /win/mac
* 命令行交互模式
* tab自动补全

## 在线安装

需要保证安装的虚拟机上有java进程



已经提供的简答 模拟的java进程  math-game

```bash
curl -O https://arthas.aliyun.com/math-game.jar
java -jar math-game.jar
```

`math-game`是一个简单的程序，每隔一秒生成一个随机数，再执行质因数分解，并打印出分解结果。

[源码](https://github.com/alibaba/arthas/blob/master/math-game/src/main/java/demo/MathGame.java)

安装arthas

```sh

curl -O https://arthas.aliyun.com/arthas-boot.jar
java -jar arthas-boot.jar
```

- 执行该程序的用户需要和目标进程具有相同的权限。比如以`admin`用户来执行：`sudo su admin && java -jar arthas-boot.jar` 或 `sudo -u admin -EH java -jar arthas-boot.jar`。
- 如果 attach 不上目标进程，可以查看root 下的 `~/logs/arthas/` 目录下的日志。
- 如果下载速度比较慢，可以使用 aliyun 的镜像：`java -jar arthas-boot.jar --repo-mirror aliyun --use-http`
- `java -jar arthas-boot.jar -h` 打印更多参数信息。
- 安装目录 `/root/.arthas`

选择应用 java 进程：

```sh

$ $ java -jar arthas-boot.jar
* [1]: 35542
  [2]: 71560 math-game.jar
```

`math-game`进程是第 2 个，则输入 2，再输入`回车/enter`。Arthas 会 attach 到目标进程上，并输出日志：

##  退出 arthas

如果只是退出当前的连接，可以用`quit`或者`exit`命令。Attach 到目标进程上的 arthas 还会继续运行，端口会保持开放，下次连接时可以直接连接上。

如果想完全退出 arthas，可以执行`stop`命令。

重新连接上arthas

```sh
java -jar arthas-boot.jar
```

选择这个带星号的】



```sh
[INFO] arthas-boot version: 3.6.6
[INFO] Process 11373 already using port 3658
[INFO] Process 11373 already using port 8563
[INFO] Found existing java process, please choose one and input the serial number of the process, eg : 1. Then hit ENTER.
* [1]: 11373 math-game.jar
  [2]: 7728 ./work-order-1.0.0-RELEASE.jar
  [3]: 5078 ./szgw-1.0.0-RELEASE.jar
  [4]: 2200 ./auction.jar
  [5]: 2285 ./invest.jar
  [6]: 2318 ./custom-table.jar
1
[INFO] arthas home: /data/arthas
[INFO] The target process already listen port 3658, skip attach.
[INFO] arthas-client connect 127.0.0.1 3658
  ,---.  ,------. ,--------.,--.  ,--.  ,---.   ,---.                           
 /  O  \ |  .--. ''--.  .--'|  '--'  | /  O  \ '   .-'                          
|  .-.  ||  '--'.'   |  |   |  .--.  ||  .-.  |`.  `-.                          
|  | |  ||  |\  \    |  |   |  |  |  ||  | |  |.-'    |                         
`--' `--'`--' '--'   `--'   `--'  `--'`--' `--'`-----'                          

wiki       https://arthas.aliyun.com/doc                                        
tutorials  https://arthas.aliyun.com/doc/arthas-tutorials.html                  
version    3.6.6                                                                
main_class                                                                      
pid        11373                                                                
time       2022-10-07 15:50:24                                                  

[arthas@11373]$ 
```





## 离线安装

1. 下载最新版本

2. 解压到`arthasdir`目录

   ```sh
   unzip -d  arthasdir ***.zip
   ```

3. 启动

   ```sh
   java -jar arthas-boot.jar 
   或者运行
   ./as.sh 
   ```

## 卸载

安装目录

```sh
 查看隐藏文件夹
 ll -a /root

 # 默认安装目录
 /root/.arthas/
 # 日志文件目录
 /root/.logs/arthas
 # 将上述文件夹删除以及上传的文件地址删除即为卸载
 
```

## 流程步骤入门



1. 启动java进程

   ```sh
   curl -O https://arthas.aliyun.com/math-game.jar
   java -jar math-game.jar
   ```

   

2. 将arthas 黏附到java进程

   ```sh
   java -jar arthas-boot.jar
   
   
   [INFO] arthas-boot version: 3.6.6
   [INFO] Process 10097 already using port 3658
   [INFO] Process 10097 already using port 8563
   [INFO] Found existing java process, please choose one and input the serial number of the process, eg : 1. Then hit ENTER.
   * [1]: 10097 ./estore.jar
     [2]: 7728 ./work-order-1.0.0-RELEASE.jar
     [3]: 5078 ./szgw-1.0.0-RELEASE.jar
     [4]: 2200 ./auction.jar
     [5]: 2285 ./invest.jar
     [6]: 2318 ./custom-table.jar
     
    选择前缀
    6
    
    
   ```

   如果端口号被占用

   ```sh
   java -jar arthas-boot.jar --telnet-port 9998 --http-port -1
   ```

3. 执行基础命令 

   

## 基础命令一

—[命令一览表](https://arthas.aliyun.com/doc/dashboard.html)

### dashboard 仪表盘

```sh
# 运行的所有线程情况
ID   NAME                          GROUP          PRIORITY  STATE     %CPU      DELTA_TIM TIME      INTERRUPT DAEMON    
-1   C1 CompilerThread1            -              -1        -         0.0       0.000     0:0.398   false     true      
-1   C2 CompilerThread0            -              -1        -         0.0       0.000     0:0.341   false     true      
1    main                          main           5         TIMED_WAI 0.0       0.000     0:0.256   false     false     
-1   VM Periodic Task Thread       -              -1        -         0.0       0.000     0:0.205   false     true      
20   arthas-NettyHttpTelnetBootstr system         5         RUNNABLE  0.0       0.000     0:0.076   false     true      
-1   GC task thread#1 (ParallelGC) -              -1        -         0.0       0.000     0:0.037   false     true      
-1   VM Thread                     -              -1        -         0.0       0.000     0:0.037   false     true      
-1   GC task thread#0 (ParallelGC) -              -1        -         0.0       0.000     0:0.037   false     true      
8    Attach Listener               system         9         RUNNABLE  0.0       0.000     0:0.026   false     true      
13   arthas-NettyHttpTelnetBootstr system         5         RUNNABLE  0.0       0.000     0:0.018   false     true      
21   arthas-command-execute        system         5         TIMED_WAI 0.0       0.000     0:0.005   false     true      
#内存使用情况
Memory                    used    total    max     usage    GC                                                          
heap                      21M     127M     2635M   0.82%    gc.ps_scavenge.count          2                             
ps_eden_space             6M      47M      973M    0.62%    gc.ps_scavenge.time(ms)       17                            
ps_survivor_space         0K      7680K    7680K   0.00%    gc.ps_marksweep.count         1                             
ps_old_gen                15M     72M      1976M   0.78%    gc.ps_marksweep.time(ms)      35                            
nonheap                   27M     28M      -1      97.36%                                                               
code_cache                4M      4M       240M    1.81%                                                                
metaspace                 21M     21M      -1      97.27%                                 # 运行的环境                              
Runtime                                                                                                                 
os.name                                                     Linux                                                       
os.version                                                  3.10.0-1062.el7.x86_64                                      
java.version                                                1.8.0_345                                                   
java.home                                                   /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.345.b01-1.el7_9.x86_6 
                                                            4/jre                                                       
                                                     
                                                                                      

```

### cls 清屏

清屏 相当于linux中的clear

### thread 线程情况

查看线程情况

语法：

`thread + id dashborad中的id号`

示例

```sh
[arthas@11373]$ thread 1
"main" Id=1 TIMED_WAITING
    at java.lang.Thread.sleep(Native Method)
    at java.lang.Thread.sleep(Thread.java:342)
    at java.util.concurrent.TimeUnit.sleep(TimeUnit.java:386)
    at demo.MathGame.main(MathGame.java:17)
```

### jad 反编译文件

#### 语法

```sh
jad 包名.文件名
```

#### 示例

```sh
[arthas@11373]$ jad demo.MathGame

ClassLoader:                                                                                                            
+-sun.misc.Launcher$AppClassLoader@70dea4e                                                                              
  +-sun.misc.Launcher$ExtClassLoader@567157ef                                                                           

Location:                                                                                                               
/data/arthas/math-game.jar                                                                                              

       /*
        * Decompiled with CFR.
        */
       package demo;
       
       import java.util.ArrayList;
       import java.util.List;
       import java.util.Random;
       import java.util.concurrent.TimeUnit;
       
       public class MathGame {
           private static Random random = new Random();
           private int illegalArgumentCount = 0;
       
           public List<Integer> primeFactors(int number) {
/*44*/         if (number < 2) {
/*45*/             ++this.illegalArgumentCount;
                   throw new IllegalArgumentException("number is: " + number + ", need >= 2");
               }
               ArrayList<Integer> result = new ArrayList<Integer>();
/*50*/         int i = 2;
/*51*/         while (i <= number) {
/*52*/             if (number % i == 0) {
/*53*/                 result.add(i);
/*54*/                 number /= i;
/*55*/                 i = 2;
                       continue;
                   }
/*57*/             ++i;
               }
/*61*/         return result;
           }
       
           public static void main(String[] args) throws InterruptedException {
               MathGame game = new MathGame();
               while (true) {
/*16*/             game.run();
/*17*/             TimeUnit.SECONDS.sleep(1L);
               }
           }
       
           public void run() throws InterruptedException {
               try {
/*23*/             int number = random.nextInt() / 10000;
/*24*/             List<Integer> primeFactors = this.primeFactors(number);
/*25*/             MathGame.print(number, primeFactors);
               }
               catch (Exception e) {
/*28*/             System.out.println(String.format("illegalArgumentCount:%3d, ", this.illegalArgumentCount) + e.getMessage());
               }
           }
       
           public static void print(int number, List<Integer> primeFactors) {
               StringBuffer sb = new StringBuffer(number + "=");
/*34*/         for (int factor : primeFactors) {
/*35*/             sb.append(factor).append('*');
               }
/*37*/         if (sb.charAt(sb.length() - 1) == '*') {
/*38*/             sb.deleteCharAt(sb.length() - 1);
               }
/*40*/         System.out.println(sb);
           }
       }

Affect(row-cnt:1) cost in 552 ms.
[arthas@11373]$ 
[arthas@11373]$ 
```

### watch 实时查看方法

通过watch  命令查看  函数的返回值

#### 语法

```sh
watch demo.MathGame primeFactors returnObj
# returnObj ognl表达式

```

#### 示例

```sh
watch demo.MathGame primeFactors returnObj

method=demo.MathGame.primeFactors location=AtExceptionExit
ts=2022-10-07 16:01:57; [cost=0.057481ms] result=null
method=demo.MathGame.primeFactors location=AtExit
ts=2022-10-07 16:01:58; [cost=0.191944ms] result=@ArrayList[
    @Integer[2],
    @Integer[29],
    @Integer[3529],
]
method=demo.MathGame.primeFactors location=AtExit
ts=2022-10-07 16:01
```

### help 查看帮助

### cat  展示文件内容

### grep管道过滤符

```sh
sysprop  |grep java -n   -i 
-n 显示行号
-i忽略大小小写
-m 行数 [最多显示多少行]
-e 正则表达式  [匹配正则表达式]

```



### pwd 当前文件目录

## 基础命令二

### sesssion 查看当前会话的信息

### reset 重置增强类，

将被Arthas 增强的类全部还原，Arthas 服务端关闭会重置增强过的类

```sh
reset # 重置所有类
reset Test # 重置Test 类
reset *Controller

跟踪指定类的方法
trace  Test print
```

### version Arthas 版本

### history 命令历史

### quit 退出

```sh
退出当前Arthas 的客户端，其他Arthas 刻划断不受影响
```

### stop 关闭Arthas服务端

```sh
如果有两个Arthas黏附再同一个java客户端，则会退出将所有的Arthas 服务端都退出
```

### keymap 查看快捷键

下表来自于Arthas 官网

| 快捷键        | 快捷键说明       | 命令名称             | 命令说明                             |
| ------------- | ---------------- | -------------------- | ------------------------------------ |
| `"\C-a"`      | ctrl + a         | beginning-of-line    | 跳到行首                             |
| `"\C-e"`      | ctrl + e         | end-of-line          | 跳到行尾                             |
| `"\C-f"`      | **ctrl + f**     | **forward-word**     | **向前移动一个单词**                 |
| `"\C-b"`      | **ctrl + b**     | **backward-word**    | **向后移动一个单词**                 |
| `"\e[D"`      | 键盘左方向键     | backward-char        | 光标向前移动一个字符                 |
| `"\e[C"`      | 键盘右方向键     | forward-char         | 光标向后移动一个字符                 |
| `"\e[B"`      | 键盘下方向键     | next-history         | 下翻显示下一个命令                   |
| `"\e[A"`      | 键盘上方向键     | previous-history     | 上翻显示上一个命令                   |
| `"\C-h"`      | ctrl + h         | backward-delete-char | 向后删除一个字符                     |
| `"\C-?"`      | ctrl + shift + / | backward-delete-char | 向后删除一个字符                     |
| **`"\C-u"`**  | **ctrl + u**     | **undo**             | **撤销上一个命令，相当于清空当前行** |
| `"\C-d"`      | ctrl + d         | delete-char          | 删除当前光标所在字符                 |
| `"\C-k"`      | ctrl + k         | kill-line            | 删除当前光标到行尾的所有字符         |
| `"\C-i"`      | ctrl + i         | complete             | 自动补全，相当于敲`TAB`              |
| `"\C-j"`      | ctrl + j         | accept-line          | 结束当前行，相当于敲回车             |
| `"\C-m"`      | ctrl + m         | accept-line          | 结束当前行，相当于敲回车             |
| `"\C-w"`      |                  | backward-delete-word |                                      |
| `"\C-x\e[3~"` |                  | backward-kill-line   |                                      |
| `"\e\C-?"`    |                  | backward-kill-word   |                                      |

- 任何时候 `tab` 键，会根据当前的输入给出提示
- 命令后敲 `-` 或 `--` ，然后按 `tab` 键，可以展示出此命令具体的选项

##  JVM 相关命令

###  dashbord 系统实时数据面板

```sh
按q 或者ctrl+c 退出
```



```sh
$ dashboard
ID   NAME                           GROUP           PRIORITY   STATE     %CPU      DELTA_TIME TIME      INTERRUPTE DAEMON
-1   C2 CompilerThread0             -               -1         -         1.55      0.077      0:8.684   false      true
53   Timer-for-arthas-dashboard-07b system          5          RUNNABLE  0.08      0.004      0:0.004   false      true
22   scheduling-1                   main            5          TIMED_WAI 0.06      0.003      0:0.287   false      false
-1   C1 CompilerThread0             -               -1         -         0.06      0.003      0:2.171   false      true
-1   VM Periodic Task Thread        -               -1         -         0.03      0.001      0:0.092   false      true
49   arthas-NettyHttpTelnetBootstra system          5          RUNNABLE  0.02      0.001      0:0.156   false      true
16   Catalina-utility-1             main            1          TIMED_WAI 0.0       0.000      0:0.029   false      false
-1   G1 Young RemSet Sampling       -               -1         -         0.0       0.000      0:0.019   false      true
17   Catalina-utility-2             main            1          WAITING   0.0       0.000      0:0.025   false      false
34   http-nio-8080-ClientPoller     main            5          RUNNABLE  0.0       0.000      0:0.016   false      true
23   http-nio-8080-BlockPoller      main            5          RUNNABLE  0.0       0.000      0:0.011   false      true
-1   VM Thread                      -               -1         -         0.0       0.000      0:0.032   false      true
-1   Service Thread                 -               -1         -         0.0       0.000      0:0.006   false      true
-1   GC Thread#5                    -               -1         -         0.0       0.000      0:0.043   false      true
Memory                     used     total    max      usage    GC
heap                       36M      70M      4096M    0.90%    gc.g1_young_generation.count   12
g1_eden_space              6M       18M      -1       33.33%                                  86
g1_old_gen                 30M      50M      4096M    0.74%    gc.g1_old_generation.count     0
g1_survivor_space          491K     2048K    -1       24.01%   gc.g1_old_generation.time(ms)  0
nonheap                    66M      69M      -1       96.56%
codeheap_'non-nmethods'    1M       2M       5M       22.39%
metaspace                  46M      47M      -1       98.01%
Runtime
os.name                                                        Mac OS X
os.version                                                     10.15.4
java.version               
```

#### 各个属性列的说明

- ID: Java 级别的线程 ID，注意这个 ID 不能跟 jstack 中的 nativeID 一一对应。
- NAME: 线程名
- GROUP: 线程组名
- PRIORITY: 线程优先级, 1~10 之间的数字，越大表示优先级越高
- STATE: 线程的状态
- CPU%: 线程的 cpu 使用率。比如采样间隔 1000ms，某个线程的增量 cpu 时间为 100ms，则 cpu 使用率=100/1000=10%
- DELTA_TIME: 上次采样之后线程运行增量 CPU 时间，数据格式为`秒`
- TIME: 线程运行总 CPU 时间，数据格式为`分:秒`
- INTERRUPTED: 线程当前的中断位状态
- DAEMON: 是否是 daemon 线程



### thread 重要

```sh
thread # 不带参数 显示所有的线程。与dashbord 差不多
thread threadId # 查看线程详情
thread  -n  5 # 查找当前醉坊的5个线程
thread  -b # 查看死锁
thread  --state=WAITING #查看是WAITING的线程


```



####  参数说明

|      参数名称 | 参数说明                                                |
| ------------: | :------------------------------------------------------ |
|          *id* | 线程 id                                                 |
|          [n:] | 指定最忙的前 N 个线程并打印堆栈                         |
|           [b] | **找出当前阻塞其他线程的线程**                          |
| [i `<value>`] | 指定 cpu 使用率统计的采样间隔，单位为毫秒，默认值为 200 |
|       [--all] | 显示所有匹配的线程                                      |

### JVM 查看JVM环境信息-不是很重要，基础命令

### sysprop 查看系统环境信息-不是很重要，基础命令

### JVM相关命令之二

### sysenv 查看当前JVM的环境属性 查看系统环境信息-不是很重要，基础命令

### vmoption

```java
vmoption  // 查看， VM 诊断相关的参数
vmoption PrintGC // 查看指定的 option
vmoption PrintGC true  //更新指定的 option
```



### getstatic 查看静态属性

```sh
getstatic demo.MathGame random   # 查看全路径类名  静态属性
```

### OGNL语法 重要

```sh
express 执行的表达式
[c:] 执行表达式的class loader 默认值是systemclasssloader
[x] 结果对象的展开层次，默认值是1
```

```sh
# 调用静态函数
ognl  '@java.lang.System@out.println("hello")'
# 获取静态类的静态字段
ognl  '@demo.MathGame@random'
# 执行多行表达式，赋值给一个临时变量，返回一个list
ognl '#value1=@System@getProperty("java.home"),#value2=@System@getProperty("java.runtime.name"),{#value1,@value2}'
```

## Class 和Classloader 相关命令之一

### SC (Search Class) 查看JVM已加载的类信息

“Search-Class” 的简写，这个命令能搜索出所有已经加载到 JVM 中的 Class 信息，这个命令支持的参数有 `[d]`、`[E]`、`[f]` 和 `[x:]`。

#### 参数说明

|         参数名称 | 参数说明                                                     |
| ---------------: | :----------------------------------------------------------- |
|  *class-pattern* | 类名表达式匹配                                               |
| *method-pattern* | 方法名表达式匹配                                             |
|              [d] | 输出当前类的详细信息，包括这个类所加载的原始文件来源、类的声明、加载的 ClassLoader 等详细信息。 如果一个类被多个 ClassLoader 所加载，则会出现多次 |
|              [E] | 开启正则表达式匹配，默认为通配符匹配                         |
|              [f] | 输出当前类的成员变量信息（需要配合参数-d 一起使用）          |
|                  |                                                              |
|                  |                                                              |
|                  |                                                              |
|                  |                                                              |

提示

class-pattern 支持全限定名，如 com.taobao.test.AAA，也支持 com/taobao/test/AAA 这样的格式，这样，我们从异常堆栈里面把类名拷贝过来的时候，不需要在手动把`/`替换为`.`啦。

提示

sc 默认开启了子类匹配功能，也就是说所有当前类的子类也会被搜索出来，想要精确的匹配，请打开`options disable-sub-class true`开关

#### 使用参考

- 模糊搜索

  

  ```bash
  $ sc demo.*
  demo.MathGame
  Affect(row-cnt:1) cost in 55 ms.
  ```

- 打印类的详细信息

  

  ```bash
  $ sc -d demo.MathGame  # -d 详细信息
  class-info        demo.MathGame
  code-source       /private/tmp/math-game.jar
  name              demo.MathGame
  isInterface       false
  isAnnotation      false
  isEnum            false
  isAnonymousClass  false
  isArray           false
  isLocalClass      false
  isMemberClass     false
  isPrimitive       false
  isSynthetic       false
  simple-name       MathGame
  modifier          public
  annotation
  interfaces
  super-class       +-java.lang.Object
  class-loader      +-sun.misc.Launcher$AppClassLoader@3d4eac69
                      +-sun.misc.Launcher$ExtClassLoader@66350f69
  classLoaderHash   3d4eac69
  
  Affect(row-cnt:1) cost in 875 ms.
  ```

- 打印出类的 Field 信息

  

  ```bash
  $ sc -d -f demo.MathGame  #-f 成员变量信息
  class-info        demo.MathGame
  code-source       /private/tmp/math-game.jar
  name              demo.MathGame
  isInterface       false
  isAnnotation      false
  isEnum            false
  isAnonymousClass  false
  isArray           false
  isLocalClass      false
  isMemberClass     false
  isPrimitive       false
  isSynthetic       false
  simple-name       MathGame
  modifier          public
  annotation
  interfaces
  super-class       +-java.lang.Object
  class-loader      +-sun.misc.Launcher$AppClassLoader@3d4eac69
                      +-sun.misc.Launcher$ExtClassLoader@66350f69
  classLoaderHash   3d4eac69
  fields            modifierprivate,static
                    type    java.util.Random
                    name    random
                    value   java.util.Random@522b4
                            08a
  
                    modifierprivate
                    type    int
                    name    illegalArgumentCount
  
  
  Affect(row-cnt:1) cost in 19 ms.
  ```



### SM(Search Method)

Search-Method” 的简写，这个命令能搜索出所有已经加载了 Class 信息的方法信息。

`sm` 命令只能看到由当前类所声明 (declaring) 的方法，父类则无法看到。

#### 参数说明

|         参数名称 | 参数说明                                     |
| ---------------: | :------------------------------------------- |
|  *class-pattern* | 类名表达式匹配                               |
| *method-pattern* | 方法名表达式匹配                             |
|              [d] | 展示每个方法的详细信息                       |
|              [E] | 开启正则表达式匹配，默认为通配符匹配         |
|           `[n:]` | 具有详细信息的匹配类的最大数量（默认为 100） |

#### 使用参考



```bash
$ sm java.lang.String
java.lang.String-><init>
java.lang.String->equals
java.lang.String->toString
java.lang.String->hashCode
java.lang.String->compareTo
java.lang.String->indexOf
java.lang.String->valueOf
java.lang.String->checkBounds
java.lang.String->length
java.lang.String->isEmpty
java.lang.String->charAt
java.lang.String->codePointAt
java.lang.String->codePointBefore
java.lang.String->codePointCount
java.lang.String->offsetByCodePoints
java.lang.String->getChars
java.lang.String->getBytes
java.lang.String->contentEquals
java.lang.String->nonSyncContentEquals
java.lang.String->equalsIgnoreCase
java.lang.String->compareToIgnoreCase
java.lang.String->regionMatches
java.lang.String->startsWith
java.lang.String->endsWith
java.lang.String->indexOfSupplementary
java.lang.String->lastIndexOf
java.lang.String->lastIndexOfSupplementary
java.lang.String->substring
java.lang.String->subSequence
java.lang.String->concat
java.lang.String->replace
java.lang.String->matches
java.lang.String->contains
java.lang.String->replaceFirst
java.lang.String->replaceAll
java.lang.String->split
java.lang.String->join
java.lang.String->toLowerCase
java.lang.String->toUpperCase
java.lang.String->trim
java.lang.String->toCharArray
java.lang.String->format
java.lang.String->copyValueOf
java.lang.String->intern
Affect(row-cnt:44) cost in 1342 ms.
```



```bash
$ sm -d java.lang.String toString
 declaring-class  java.lang.String
 method-name      toString
 modifier         public
 annotation
 parameters
 return           java.lang.String
 exceptions

Affect(row-cnt:1) cost in 3 ms.
```

## Class 和Classloader 相关命令之二 非常重要

* jad 把字节码文件反编译成为源代码
* mc 在内存中把源码编译成字节码
* redefine 把新生成的字节码文件再内存中执行

### jad 反编译

```sh
jad demo.SpringBootMain # 全类名路径    显示带有ClassLoader信息
jad demo.SpringBootMain  --source-only 
jad demo.SrpingBootMain functionName # 只反编译某个方法

```



### mc 编译



```sh


mc   /root/Hello.java
# 显示class 文件路径
mc /root/Hello.java  -d /root
# 指定路径
```



### redefine  加载外部的.class文件，redefine 到JVM里

>- edefine 的 class 不能修改、添加、删除类的 field 和 method，包括方法参数、方法名称及返回值
>- 如果 mc 失败，可以在本地开发环境编译好 class 文件，上传到目标系统，使用 redefine 热加载 class
>- 正在跑的函数，没有退出不能生效。
>- 目前 redefine 和 watch/trace/jad/tt 等命令冲突，以后重新实现 redefine 功能会解决此问题



>
>
>提示
>
>`reset`命令对`redefine`的类无效。如果想重置，需要`redefine`原始的字节码。
>
>提示
>
>`redefine`命令和`jad`/`watch`/`trace`/`monitor`/`tt`等命令会冲突。执行完`redefine`之后，如果再执行上面提到的命令，则会把`redefine`的字节码重置。 原因是 jdk 本身 redefine 和 Retransform 是不同的机制，同时使用两种机制来更新字节码，只有最后修改的会生效。

```sh
# 步骤
  jad --source-only demo.MathGame > /root/MathGame.java
  mc /root/MathGame.java -d  /root
  redefine /root/demo/MathGame.class
```

## 其他命令

* 类和类加载器的相关命令
* monitor/watch/trace/stack 等核心命令的使用
* 火焰图的生成



### dump --get不到重要点

####  将已经加载类的字节码文件保存到定的目录

```sh
# 默认路径
~/logs/arthas/classdump/
dump java.lang.String 
dump java.lang.*Math #使用通配符

```

### classloader --get不到重要点

`classloader` 命令将 JVM 中所有的 classloader 的信息统计出来，并可以展示继承树，urls 等。

可以让指定的 classloader 去 getResources，打印出所有查找到的 resources 的 url。对于`ResourceNotFoundException`比较有用。

#### 参数说明

|              参数名称 | 参数说明                                   |
| --------------------: | :----------------------------------------- |
|                   [l] | 按类加载实例进行统计                       |
|                   [t] | 打印所有 ClassLoader 的继承树              |
|                   [a] | 列出所有 ClassLoader 加载的类，请谨慎使用  |
|                `[c:]` | ClassLoader 的 hashcode                    |
| `[classLoaderClass:]` | 指定执行表达式的 ClassLoader 的 class name |
|             `[c: r:]` | 用 ClassLoader 去查找 resource             |
|          `[c: load:]` | 用 ClassLoader 去加载指定的类              |

#### 使用参考

#### 按类加载类型查看统计信息



```bash
$ classloader
 name                                       numberOfInstances  loadedCountTotal
 com.taobao.arthas.agent.ArthasClassloader  1                  2115
 BootstrapClassLoader                       1                  1861
 sun.reflect.DelegatingClassLoader          5                  5
 sun.misc.Launcher$AppClassLoader           1                  4
 sun.misc.Launcher$ExtClassLoader           1                  1
Affect(row-cnt:5) cost in 3 ms.
```

#### 按类加载实例查看统计信息



```bash
$ classloader -l
 name                                                loadedCount  hash      parent
 BootstrapClassLoader                                1861         null      null
 com.taobao.arthas.agent.ArthasClassloader@68b31f0a  2115         68b31f0a  sun.misc.Launcher$ExtClassLoader@66350f69
 sun.misc.Launcher$AppClassLoader@3d4eac69           4            3d4eac69  sun.misc.Launcher$ExtClassLoader@66350f69
 sun.misc.Launcher$ExtClassLoader@66350f69           1            66350f69  null
Affect(row-cnt:4) cost in 2 ms.
```

#### 查看 ClassLoader 的继承树



```bash
$ classloader -t
+-BootstrapClassLoader
+-sun.misc.Launcher$ExtClassLoader@66350f69
  +-com.taobao.arthas.agent.ArthasClassloader@68b31f0a
  +-sun.misc.Launcher$AppClassLoader@3d4eac69
Affect(row-cnt:4) cost in 3 ms.
```

#### 查看 URLClassLoader 实际的 urls



```bash
$ classloader -c 3d4eac69
file:/private/tmp/math-game.jar
file:/Users/hengyunabc/.arthas/lib/3.0.5/arthas/arthas-agent.jar

Affect(row-cnt:9) cost in 3 ms.
```

*注意* hashcode 是变化的，需要先查看当前的 ClassLoader 信息，提取对应 ClassLoader 的 hashcode。

对于只有唯一实例的 ClassLoader 可以通过 class name 指定，使用起来更加方便：



```bash
$ classloader --classLoaderClass sun.misc.Launcher$AppClassLoader
file:/private/tmp/math-game.jar
file:/Users/hengyunabc/.arthas/lib/3.0.5/arthas/arthas-agent.jar

Affect(row-cnt:9) cost in 3 ms.
```

#### 使用 ClassLoader 去查找 resource



```bash
$ classloader -c 3d4eac69  -r META-INF/MANIFEST.MF
 jar:file:/System/Library/Java/Extensions/MRJToolkit.jar!/META-INF/MANIFEST.MF
 jar:file:/private/tmp/math-game.jar!/META-INF/MANIFEST.MF
 jar:file:/Users/hengyunabc/.arthas/lib/3.0.5/arthas/arthas-agent.jar!/META-INF/MANIFEST.MF
```

也可以尝试查找类的 class 文件：



```bash
$ classloader -c 1b6d3586 -r java/lang/String.class
 jar:file:/Library/Java/JavaVirtualMachines/jdk1.8.0_60.jdk/Contents/Home/jre/lib/rt.jar!/java/lang/String.class
```

#### 使用 ClassLoader 去加载类



```bash
$ classloader -c 3d4eac69 --load demo.MathGame
load class success.
 class-info        demo.MathGame
 code-source       /private/tmp/math-game.jar
 name              demo.MathGame
 isInterface       false
 isAnnotation      false
 isEnum            false
 isAnonymousClass  false
 isArray           false
 isLocalClass      false
 isMemberClass     false
 isPrimitive       false
 isSynthetic       false
 simple-name       MathGame
 modifier          public
 annotation
 interfaces
 super-class       +-java.lang.Object
 class-loader      +-sun.misc.Launcher$AppClassLoader@3d4eac69
                     +-sun.misc.Launcher$ExtClassLoader@66350f69
 classLoaderHash   3d4eac69
```

#### 统计 ClassLoader 实际使用 URL 和未使用的 URL

注意

注意，基于 JVM 目前已加载的所有类统计，不代表`Unused URLs`可以从应用中删掉。因为可能将来需要从`Unused URLs`里加载类，或者需要加载`resources`。



```text
$ classloader --url-stat
 com.taobao.arthas.agent.ArthasClassloader@3c41660, hash:3c41660
 Used URLs:
 file:/Users/admin/.arthas/lib/3.5.6/arthas/arthas-core.jar
 Unused URLs:

 sun.misc.Launcher$AppClassLoader@75b84c92, hash:75b84c92
 Used URLs:
 file:/Users/admin/code/java/arthas/math-game/target/math-game.jar
 file:/Users/admin/.arthas/lib/3.5.6/arthas/arthas-agent.jar
 Unused URLs:

 sun.misc.Launcher$ExtClassLoader@7f31245a, hash:7f31245a
 Used URLs:
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/sunec.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/sunjce_provider.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/localedata.jar
 Unused URLs:
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/nashorn.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/cldrdata.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/legacy8ujsse.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/jfxrt.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/dnsns.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/openjsse.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/sunpkcs11.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/jaccess.jar
 file:/tmp/jdk1.8/Contents/Home/jre/lib/ext/zipfs.jar
```



### monitor

#### 监控统计指定类中方法的成功 失败 耗时次数  非实时

```sh
monitor -c 5 demo.MathGame print 每5秒监视一次  类名 方法
# 默认-c 为120s 

```

### watch 非常重要

####  能观察到函数的范围为：`返回值`、`抛出异常`、`入参`，通过编写 OGNL 表达式进行对应变量的查看。



#### 参数说明

watch 的参数比较多，主要是因为它能在 4 个不同的场景观察对象

|            参数名称 | 参数说明                                          |
| ------------------: | :------------------------------------------------ |
|     *class-pattern* | 类名表达式匹配                                    |
|    *method-pattern* | 函数名表达式匹配                                  |
|           *express* | 观察表达式，默认值：`{params, target, returnObj}` |
| *condition-express* | 条件表达式                                        |
|                 [b] | 在**函数调用之前**观察 类似于AOP                  |
|                 [e] | 在**函数异常之后**观察                            |
|                 [s] | 在**函数返回之后**观察                            |
|                 [f] | 在**函数结束之后**(正常返回和异常返回)观察        |
|                 [E] | 开启正则表达式匹配，默认为通配符匹配              |
|                [x:] | 指定输出结果的属性遍历深度，默认为 1，最大值是 4  |

这里重点要说明的是观察表达式，观察表达式的构成主要由 ognl 表达式组成，所以你可以这样写`"{params,returnObj}"`，只要是一个合法的 ognl 表达式，都能被正常支持。

观察的维度也比较多，主要体现在参数 `advice` 的数据结构上。`Advice` 参数最主要是封装了通知节点的所有信息。请参考[表达式核心变量](https://arthas.aliyun.com/doc/advice-class.html)中关于该节点的描述。

- 特殊用法请参考：[https://github.com/alibaba/arthas/issues/71在新窗口打开](https://github.com/alibaba/arthas/issues/71)
- OGNL 表达式官网：[https://commons.apache.org/proper/commons-ognl/language-guide.html在新窗口打开](https://commons.apache.org/proper/commons-ognl/language-guide.html)

**特别说明**：

- watch 命令定义了 4 个观察事件点，即 `-b` 函数调用前，`-e` 函数异常后，`-s` 函数返回后，`-f` 函数结束后
- 4 个观察事件点 `-b`、`-e`、`-s` 默认关闭，`-f` 默认打开，当指定观察点被打开后，在相应事件点会对观察表达式进行求值并输出
- 这里要注意`函数入参`和`函数出参`的区别，有可能在中间被修改导致前后不一致，除了 `-b` 事件点 `params` 代表函数入参外，其余事件都代表函数出参
- 当使用 `-b` 时，由于观察事件点是在函数调用前，此时返回值或异常均不存在
- 在 watch 命令的结果里，会打印出`location`信息。`location`有三种可能值：`AtEnter`，`AtExit`，`AtExceptionExit`。对应函数入口，函数正常 return，函数抛出异常。

#### 使用参考

#### 启动 Demo

启动[快速入门](https://arthas.aliyun.com/doc/quick-start.html)里的`math-game`。

#### 观察函数调用返回时的参数、this 对象和返回值

提示

观察表达式，默认值是`{params, target, returnObj}`



```bash
$ watch demo.MathGame[类名] primeFactors[方法名] -x 2  
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 1) cost in 32 ms, listenerId: 5
method=demo.MathGame.primeFactors location=AtExceptionExit
ts=2021-08-31 15:22:57; [cost=0.220625ms] result=@ArrayList[
    @Object[][
        @Integer[-179173],
    ],
    @MathGame[
        random=@Random[java.util.Random@31cefde0],
        illegalArgumentCount=@Integer[44],
    ],
    null,
]
method=demo.MathGame.primeFactors location=AtExit
ts=2021-08-31 15:22:58; [cost=1.020982ms] result=@ArrayList[
    @Object[][
        @Integer[1],
    ],
    @MathGame[
        random=@Random[java.util.Random@31cefde0],
        illegalArgumentCount=@Integer[44],
    ],
    @ArrayList[
        @Integer[2],
        @Integer[2],
        @Integer[26947],
    ],
]
```

- 上面的结果里，说明函数被执行了两次，第一次结果是`location=AtExceptionExit`，说明函数抛出异常了，因此`returnObj`是 null
- 在第二次结果里是`location=AtExit`，说明函数正常返回，因此可以看到`returnObj`结果是一个 ArrayList

#### 观察函数调用入口的参数和返回值



```bash
$ watch demo.MathGame primeFactors "{params,returnObj[ognl 的结果]}" -x 2 [如果有list嵌套list 或者map ,则深度为2] -b   [时间点为方法执行前，看因此获取不到返回值]
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 50 ms.
ts=2018-12-03 19:23:23; [cost=0.0353ms] result=@ArrayList[
    @Object[][
        @Integer[-1077465243],
    ],
    null,
]
```

- 对比前一个例子，返回值为空（事件点为函数执行前，因此获取不到返回值）

#### 同时观察函数调用前和函数返回后



```bash
$ watch demo.MathGame primeFactors "{params,target【方法对象本身】,returnObj}" -x 2 -b -s[成功返回]  -n 2
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 46 ms.
ts=2018-12-03 19:29:54; [cost=0.01696ms] result=@ArrayList[
    @Object[][
        @Integer[1],
    ],
    @MathGame[
        random=@Random[java.util.Random@522b408a],
        illegalArgumentCount=@Integer[13038],
    ],
    null,
]
ts=2018-12-03 19:29:54; [cost=4.277392ms] result=@ArrayList[
    @Object[][
        @Integer[1],
    ],
    @MathGame[
        random=@Random[java.util.Random@522b408a],
        illegalArgumentCount=@Integer[13038],
    ],
    @ArrayList[
        @Integer[2],
        @Integer[2],
        @Integer[2],
        @Integer[5],
        @Integer[5],
        @Integer[73],
        @Integer[241],
        @Integer[439],
    ],
]
```

- 参数里`-n 2`，表示只执行两次
- 这里输出结果中，第一次输出的是函数调用前的观察表达式的结果，第二次输出的是函数返回后的表达式的结果
- 结果的输出顺序和事件发生的先后顺序一致，和命令中 `-s -b` 的顺序无关

#### 调整`-x`的值，观察具体的函数参数值



```bash
$ watch demo.MathGame primeFactors "{params,target}" -x 3
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 58 ms.
ts=2018-12-03 19:34:19; [cost=0.587833ms] result=@ArrayList[
    @Object[][
        @Integer[1],
    ],
    @MathGame[
        random=@Random[
            serialVersionUID=@Long[3905348978240129619],
            seed=@AtomicLong[3133719055989],
            multiplier=@Long[25214903917],
            addend=@Long[11],
            mask=@Long[281474976710655],
            DOUBLE_UNIT=@Double[1.1102230246251565E-16],
            BadBound=@String[bound must be positive],
            BadRange=@String[bound must be greater than origin],
            BadSize=@String[size must be non-negative],
            seedUniquifier=@AtomicLong[-3282039941672302964],
            nextNextGaussian=@Double[0.0],
            haveNextNextGaussian=@Boolean[false],
            serialPersistentFields=@ObjectStreamField[][isEmpty=false;size=3],
            unsafe=@Unsafe[sun.misc.Unsafe@2eaa1027],
            seedOffset=@Long[24],
        ],
        illegalArgumentCount=@Integer[13159],
    ],
]
```

- `-x`表示遍历深度，可以调整来打印具体的参数和结果内容，默认值是 1。
- `-x`最大值是 4，防止展开结果占用太多内存。用户可以在`ognl`表达式里指定更具体的 field。

#### 条件表达式的例子



```bash
$ watch demo.MathGame primeFactors "{params[0],target}" "params[0]<0"
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 68 ms.
ts=2018-12-03 19:36:04; [cost=0.530255ms] result=@ArrayList[
    @Integer[-18178089],
    @MathGame[demo.MathGame@41cf53f9],
]
```

- 只有满足条件的调用，才会有响应。
- params[0] 第一个参数

#### 观察异常信息的例子



```bash
$ watch demo.MathGame primeFactors "{params[0],throwExp}" -e -x 2
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 62 ms.
ts=2018-12-03 19:38:00; [cost=1.414993ms] result=@ArrayList[
    @Integer[-1120397038],
    java.lang.IllegalArgumentException: number is: -1120397038, need >= 2
	at demo.MathGame.primeFactors(MathGame.java:46)
	at demo.MathGame.run(MathGame.java:24)
	at demo.MathGame.main(MathGame.java:16)
,
]
```

- `-e`表示抛出异常时才触发
- express 中，表示异常信息的变量是`throwExp`

####  按照耗时进行过滤



```bash
$ watch demo.MathGame primeFactors '{params, returnObj}' '#cost>200' -x 2
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 66 ms.
ts=2018-12-03 19:40:28; [cost=2112.168897ms] result=@ArrayList[
    @Object[][
        @Integer[1],
    ],
    @ArrayList[
        @Integer[5],
        @Integer[428379493],
    ],
]
```

- `#cost>200`(单位是`ms`)表示只有当耗时大于 200ms 时才会输出，过滤掉执行时间小于 200ms 的调用

#### 观察当前对象中的属性

如果想查看函数运行前后，当前对象中的属性，可以使用`target`关键字，代表当前对象



```bash
$ watch demo.MathGame primeFactors 'target'
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 52 ms.
ts=2018-12-03 19:41:52; [cost=0.477882ms] result=@MathGame[
    random=@Random[java.util.Random@522b408a],
    illegalArgumentCount=@Integer[13355],
]
```

然后使用`target.field_name`访问当前对象的某个属性



```bash
$ watch demo.MathGame primeFactors 'target.illegalArgumentCount'
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 67 ms.
ts=2018-12-03 20:04:34; [cost=131.303498ms] result=@Integer[8]
ts=2018-12-03 20:04:35; [cost=0.961441ms] result=@Integer[8]
```

#### 获取类的静态字段、调用类的静态函数的例子



```bash
watch demo.MathGame * '{params,@demo.MathGame@random.nextInt(100)}' -v -n 1 -x 2
[arthas@6527]$ watch demo.MathGame * '{params,@demo.MathGame@random.nextInt(100)}' -n 1 -x 2
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 5) cost in 34 ms, listenerId: 3
ts=2021-01-05 21:35:20; [cost=0.173966ms] result=@ArrayList[
    @Object[][
        @Integer[-138282],
    ],
    @Integer[89],
]
```

- 注意这里使用 `Thread.currentThread().getContextClassLoader()` 加载,使用精确`classloader` [ognl](https://arthas.aliyun.com/doc/ognl.html)更好。上面又说getstatic那里

#### 排除掉指定的类

提示

watch/trace/monitor/stack/tt 命令都支持 `--exclude-class-pattern` 参数

使用 `--exclude-class-pattern` 参数可以排除掉指定的类，比如：



```bash
watch javax.servlet.Filter * --exclude-class-pattern com.demo.TestFilter
```

#### 不匹配子类

默认情况下 watch/trace/monitor/stack/tt 命令都会匹配子类。如果想不匹配，可以通过全局参数关掉。



```bash
options disable-sub-class true
```

####  使用 -v 参数打印更多信息

提示

watch/trace/monitor/stack/tt 命令都支持 `-v` 参数

当命令执行之后，没有输出结果。有两种可能：

1. 匹配到的函数没有被执行
2. 条件表达式结果是 false

但用户区分不出是哪种情况。

使用 `-v`选项，则会打印`Condition express`的具体值和执行结果，方便确认。

比如：



```text
$ watch -v -x 2 demo.MathGame print 'params' 'params[0] > 100000'
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 1) cost in 29 ms, listenerId: 11
Condition express: params[0] > 100000 , result: false
Condition express: params[0] > 100000 , result: false
Condition express: params[0] > 100000 , result: true
ts=2020-12-02 22:38:56; [cost=0.060843ms] result=@Object[][
    @Integer[200033],
    @ArrayList[
        @Integer[200033],
    ],
]
Condition express: params[0] > 100000 , result: true
ts=2020-12-02 22:38:57; [cost=0.052877ms] result=@Object[][
    @Integer[123047],
    @ArrayList[
        @Integer[29],
        @Integer[4243],
    ],
]
```

###  trace断点调试 不能看数据，只能看耗时等

提示

方法内部调用路径，并输出方法路径上的每个节点上耗时

`trace` 命令能主动搜索 `class-pattern`／`method-pattern` 对应的方法调用路径，渲染和统计整个调用链路上的所有性能开销和追踪调用链路。

#### 参数说明

|            参数名称 | 参数说明                             |
| ------------------: | :----------------------------------- |
|     *class-pattern* | 类名表达式匹配                       |
|    *method-pattern* | 方法名表达式匹配                     |
| *condition-express* | 条件表达式                           |
|                 [E] | 开启正则表达式匹配，默认为通配符匹配 |
|              `[n:]` | 命令执行次数                         |
|             `#cost` | 方法执行耗时                         |

这里重点要说明的是观察表达式，观察表达式的构成主要由 ognl 表达式组成，所以你可以这样写`"{params,returnObj}"`，只要是一个合法的 ognl 表达式，都能被正常支持。

观察的维度也比较多，主要体现在参数 `advice` 的数据结构上。`Advice` 参数最主要是封装了通知节点的所有信息。

请参考[表达式核心变量](https://arthas.aliyun.com/doc/advice-class.html)中关于该节点的描述。

- 特殊用法请参考：[https://github.com/alibaba/arthas/issues/71在新窗口打开](https://github.com/alibaba/arthas/issues/71)
- OGNL 表达式官网：[https://commons.apache.org/proper/commons-ognl/language-guide.html在新窗口打开](https://commons.apache.org/proper/commons-ognl/language-guide.html)

很多时候我们只想看到某个方法的 rt 大于某个时间之后的 trace 结果，现在 Arthas 可以按照方法执行的耗时来进行过滤了，例如`trace *StringUtils isBlank '#cost>100'`表示当执行时间超过 100ms 的时候，才会输出 trace 的结果。

提示

watch/stack/trace 这个三个命令都支持`#cost`

#### 注意事项

- `trace` 能方便的帮助你定位和发现因 RT 高而导致的性能问题缺陷，但其每次只能跟踪一级方法的调用链路。

  参考：[Trace 命令的实现原理在新窗口打开](https://github.com/alibaba/arthas/issues/597)

- 3.3.0 版本后，可以使用动态 Trace 功能，不断增加新的匹配类，参考下面的示例。

- 目前不支持 `trace java.lang.Thread getName`，参考 issue: [#1610在新窗口打开](https://github.com/alibaba/arthas/issues/1610) ，考虑到不是非常必要场景，且修复有一定难度，因此当前暂不修复

#### 使用参考

##### 启动 Demo

启动[快速入门](https://arthas.aliyun.com/doc/quick-start.html)里的`math-game`。

#### trace 函数



```bash
$ trace demo.MathGame run
Press Q or Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 28 ms.
`---ts=2019-12-04 00:45:08;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[0.617465ms] demo.MathGame:run()
        `---[0.078946ms] demo.MathGame:primeFactors() #24 [throws Exception]

`---ts=2019-12-04 00:45:09;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[1.276874ms] demo.MathGame:run()
        `---[0.03752ms] demo.MathGame:primeFactors() #24 [throws Exception]
```

提示

结果里的 `#24`，表示在 run 函数里，在源文件的第`24`行调用了`primeFactors()`函数。

#### trace 次数限制

如果方法调用的次数很多，那么可以用`-n`参数指定捕捉结果的次数。比如下面的例子里，捕捉到一次调用就退出命令。



```bash
$ trace demo.MathGame run -n 1
Press Q or Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 20 ms.
`---ts=2019-12-04 00:45:53;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[0.549379ms] demo.MathGame:run()
        +---[0.059839ms] demo.MathGame:primeFactors() #24
        `---[0.232887ms] demo.MathGame:print() #25

Command execution times exceed limit: 1, so command will exit. You can set it with -n option.
```

#### 包含 jdk 的函数

- `--skipJDKMethod <value> `skip jdk method trace, default value true.

默认情况下，trace 不会包含 jdk 里的函数调用，如果希望 trace jdk 里的函数，需要显式设置`--skipJDKMethod false`。



```bash
$ trace --skipJDKMethod false demo.MathGame run
Press Q or Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 60 ms.
`---ts=2019-12-04 00:44:41;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[1.357742ms] demo.MathGame:run()
        +---[0.028624ms] java.util.Random:nextInt() #23
        +---[0.045534ms] demo.MathGame:primeFactors() #24 [throws Exception]
        +---[0.005372ms] java.lang.StringBuilder:<init>() #28
        +---[0.012257ms] java.lang.Integer:valueOf() #28
        +---[0.234537ms] java.lang.String:format() #28
        +---[min=0.004539ms,max=0.005778ms,total=0.010317ms,count=2] java.lang.StringBuilder:append() #28
        +---[0.013777ms] java.lang.Exception:getMessage() #28
        +---[0.004935ms] java.lang.StringBuilder:toString() #28
        `---[0.06941ms] java.io.PrintStream:println() #28

`---ts=2019-12-04 00:44:42;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[3.030432ms] demo.MathGame:run()
        +---[0.010473ms] java.util.Random:nextInt() #23
        +---[0.023715ms] demo.MathGame:primeFactors() #24 [throws Exception]
        +---[0.005198ms] java.lang.StringBuilder:<init>() #28
        +---[0.006405ms] java.lang.Integer:valueOf() #28
        +---[0.178583ms] java.lang.String:format() #28
        +---[min=0.011636ms,max=0.838077ms,total=0.849713ms,count=2] java.lang.StringBuilder:append() #28
        +---[0.008747ms] java.lang.Exception:getMessage() #28
        +---[0.019768ms] java.lang.StringBuilder:toString() #28
        `---[0.076457ms] java.io.PrintStream:println() #28
```

#### 根据调用耗时过滤



```bash
$ trace demo.MathGame run '#cost > 10'
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 41 ms.
`---ts=2018-12-04 01:12:02;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[12.033735ms] demo.MathGame:run()
        +---[0.006783ms] java.util.Random:nextInt()
        +---[11.852594ms] demo.MathGame:primeFactors()
        `---[0.05447ms] demo.MathGame:print()
```

提示

只会展示耗时大于 10ms 的调用路径，有助于在排查问题的时候，只关注异常情况

- 是不是很眼熟，没错，在 JProfiler 等收费软件中你曾经见识类似的功能，这里你将可以通过命令就能打印出指定调用路径。 友情提醒下，`trace` 在执行的过程中本身是会有一定的性能开销，在统计的报告中并未像 JProfiler 一样预先减去其自身的统计开销。所以这统计出来有些许的不准，渲染路径上调用的类、方法越多，性能偏差越大。但还是能让你看清一些事情的。
- [12.033735ms] 的含义，`12.033735` 的含义是：当前节点在当前步骤的耗时，单位为毫秒
- [0,0,0ms,11]xxx:yyy() [throws Exception]，对该方法中相同的方法调用进行了合并，`0,0,0ms,11` 表示方法调用耗时，`min,max,total,count`；`throws Exception` 表明该方法调用中存在异常返回
- 这里存在一个统计不准确的问题，就是所有方法耗时加起来可能会小于该监测方法的总耗时，这个是由于 Arthas 本身的逻辑会有一定的耗时

#### trace 多个类或者多个函数

trace 命令只会 trace 匹配到的函数里的子调用，并不会向下 trace 多层。因为 trace 是代价比较贵的，多层 trace 可能会导致最终要 trace 的类和函数非常多。

可以用正则表匹配路径上的多个类和函数，一定程度上达到多层 trace 的效果。



```bash
trace -E com.test.ClassA|org.test.ClassB method1|method2|method3
```

####   排除掉指定的类

使用 `--exclude-class-pattern` 参数可以排除掉指定的类，比如：



```bash
trace javax.servlet.Filter * --exclude-class-pattern com.demo.TestFilter
```

####  动态 trace

提示

3.3.0 版本后支持。

打开终端 1，trace 上面 demo 里的`run`函数，可以看到打印出 `listenerId: 1`：



```bash
[arthas@59161]$ trace demo.MathGame run
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 1) cost in 112 ms, listenerId: 1
`---ts=2020-07-09 16:48:11;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[1.389634ms] demo.MathGame:run()
        `---[0.123934ms] demo.MathGame:primeFactors() #24 [throws Exception]

`---ts=2020-07-09 16:48:12;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[3.716391ms] demo.MathGame:run()
        +---[3.182813ms] demo.MathGame:primeFactors() #24
        `---[0.167786ms] demo.MathGame:print() #25
```

现在想要深入子函数`primeFactors`，可以打开一个新终端 2，使用`telnet localhost 3658`连接上 arthas，再 trace `primeFactors`时，指定`listenerId`。



```bash
[arthas@59161]$ trace demo.MathGame primeFactors --listenerId 1
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 1) cost in 34 ms, listenerId: 1
```

这时终端 2 打印的结果，说明已经增强了一个函数：`Affect(class count: 1 , method count: 1)`，但不再打印更多的结果。

再查看终端 1，可以发现 trace 的结果增加了一层，打印了`primeFactors`函数里的内容：



```bash
`---ts=2020-07-09 16:49:29;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[0.492551ms] demo.MathGame:run()
        `---[0.113929ms] demo.MathGame:primeFactors() #24 [throws Exception]
            `---[0.061462ms] demo.MathGame:primeFactors()
                `---[0.001018ms] throw:java.lang.IllegalArgumentException() #46

`---ts=2020-07-09 16:49:30;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    `---[0.409446ms] demo.MathGame:run()
        +---[0.232606ms] demo.MathGame:primeFactors() #24
        |   `---[0.1294ms] demo.MathGame:primeFactors()
        `---[0.084025ms] demo.MathGame:print() #25
```

通过指定`listenerId`的方式动态 trace，可以不断深入。另外 `watch`/`tt`/`monitor`等命令也支持类似的功能。

#### trace 结果时间不准确问题

比如下面的结果里：`0.705196 > (0.152743 + 0.145825)`



```bash
$ trace demo.MathGame run -n 1
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 1) cost in 66 ms, listenerId: 1
`---ts=2021-02-08 11:27:36;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@232204a1
    `---[0.705196ms] demo.MathGame:run()
        +---[0.152743ms] demo.MathGame:primeFactors() #24
        `---[0.145825ms] demo.MathGame:print() #25
```

那么其它的时间消耗在哪些地方？

1. 没有被 trace 到的函数。比如`java.*` 下的函数调用默认会忽略掉。通过增加`--skipJDKMethod false`参数可以打印出来。

   

   ```bash
   $ trace demo.MathGame run --skipJDKMethod false
   Press Q or Ctrl+C to abort.
   Affect(class count: 1 , method count: 1) cost in 35 ms, listenerId: 2
   `---ts=2021-02-08 11:27:48;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@232204a1
       `---[0.810591ms] demo.MathGame:run()
           +---[0.034568ms] java.util.Random:nextInt() #23
           +---[0.119367ms] demo.MathGame:primeFactors() #24 [throws Exception]
           +---[0.017407ms] java.lang.StringBuilder:<init>() #28
           +---[0.127922ms] java.lang.String:format() #57
           +---[min=0.01419ms,max=0.020221ms,total=0.034411ms,count=2] java.lang.StringBuilder:append() #57
           +---[0.021911ms] java.lang.Exception:getMessage() #57
           +---[0.015643ms] java.lang.StringBuilder:toString() #57
           `---[0.086622ms] java.io.PrintStream:println() #57
   ```

2. 非函数调用的指令消耗。比如 `i++`, `getfield`等指令。

3. 在代码执行过程中，JVM 可能出现停顿，比如 GC，进入同步块等。

#### 使用 -v 参数打印更多信息

提示

watch/trace/monitor/stack/tt 命令都支持 `-v` 参数

当命令执行之后，没有输出结果。有两种可能：

1. 匹配到的函数没有被执行
2. 条件表达式结果是 false

但用户区分不出是哪种情况。

使用 `-v`选项，则会打印`Condition express`的具体值和执行结果，方便确认。 



### stack 

输出方法被调用路径



#### stack



```bash
$ stack demo.MathGame primeFactors
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 36 ms.
ts=2018-12-04 01:32:19;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    @demo.MathGame.run()
        at demo.MathGame.main(MathGame.java:16)
```

####  据条件表达式来过滤



```bash
$ stack demo.MathGame primeFactors 'params[0]<0' -n 2
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 30 ms.
ts=2018-12-04 01:34:27;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    @demo.MathGame.run()
        at demo.MathGame.main(MathGame.java:16)

ts=2018-12-04 01:34:30;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    @demo.MathGame.run()
        at demo.MathGame.main(MathGame.java:16)

Command execution times exceed limit: 2, so command will exit. You can set it with -n option.
```

#### 据执行时间来过滤



```bash
$ stack demo.MathGame primeFactors '#cost>5'
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 35 ms.
ts=2018-12-04 01:35:58;thread_name=main;id=1;is_daemon=false;priority=5;TCCL=sun.misc.Launcher$AppClassLoader@3d4eac69
    @demo.MathGame.run()
        at demo.MathGame.main(MathGame.java:16)
```

### tt (time-tunnel 时间隧道)



> 记录指定犯法每次调用的入参和返回值并重新调用

`watch` 虽然很方便和灵活，但需要提前想清楚观察表达式的拼写，这对排查问题而言要求太高，因为很多时候我们并不清楚问题出自于何方，只能靠蛛丝马迹进行猜测。

这个时候如果能记录下当时方法调用的所有入参和返回值、抛出的异常会对整个问题的思考与判断非常有帮助。

于是乎，TimeTunnel 命令就诞生了。

#### 记录调用

对于一个最基本的使用来说，就是记录下当前方法的每次调用环境现场。



```bash
$ tt -t demo.MathGame primeFactors
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 66 ms.
 INDEX   TIMESTAMP            COST(ms)  IS-RET  IS-EXP   OBJECT         CLASS                          METHOD
-------------------------------------------------------------------------------------------------------------------------------------
 1000    2018-12-04 11:15:38  1.096236  false   true     0x4b67cf4d     MathGame                       primeFactors
 1001    2018-12-04 11:15:39  0.191848  false   true     0x4b67cf4d     MathGame                       primeFactors
 1002    2018-12-04 11:15:40  0.069523  false   true     0x4b67cf4d     MathGame                       primeFactors
 1003    2018-12-04 11:15:41  0.186073  false   true     0x4b67cf4d     MathGame                       primeFactors
 1004    2018-12-04 11:15:42  17.76437  true    false    0x4b67cf4d     MathGame                       primeFactors
```

- 命令参数解析

  - `-t`

    tt 命令有很多个主参数，`-t` 就是其中之一。这个参数的表明希望记录下类 `*Test` 的 `print` 方法的每次执行情况。

  - `-n 3`

    当你执行一个调用量不高的方法时可能你还能有足够的时间用 `CTRL+C` 中断 tt 命令记录的过程，但如果遇到调用量非常大的方法，瞬间就能将你的 JVM 内存撑爆。

    此时你可以通过 `-n` 参数指定你需要记录的次数，当达到记录次数时 Arthas 会主动中断 tt 命令的记录过程，避免人工操作无法停止的情况。

- 表格字段说明

| 表格字段  | 字段解释                                                     |
| --------- | ------------------------------------------------------------ |
| INDEX     | 时间片段记录编号，每一个编号代表着一次调用，后续 tt 还有很多命令都是基于此编号指定记录操作，非常重要。 |
| TIMESTAMP | 方法执行的本机时间，记录了这个时间片段所发生的本机时间       |
| COST(ms)  | 方法执行的耗时                                               |
| IS-RET    | 方法是否以正常返回的形式结束                                 |
| IS-EXP    | 方法是否以抛异常的形式结束                                   |
| OBJECT    | 执行对象的`hashCode()`，注意，曾经有人误认为是对象在 JVM 中的内存地址，但很遗憾他不是。但他能帮助你简单的标记当前执行方法的类实体 |
| CLASS     | 执行的类名                                                   |
| METHOD    | 执行的方法名                                                 |

- 条件表达式

  不知道大家是否有在使用过程中遇到以下困惑

  - Arthas 似乎很难区分出重载的方法
  - 我只需要观察特定参数，但是 tt 却全部都给我记录了下来

  条件表达式也是用 `OGNL` 来编写，核心的判断对象依然是 `Advice` 对象。除了 `tt` 命令之外，`watch`、`trace`、`stack` 命令也都支持条件表达式。

- 解决方法重载

  `tt -t *Test print params.length==1`

  通过制定参数个数的形式解决不同的方法签名，如果参数个数一样，你还可以这样写

  `tt -t *Test print 'params[1] instanceof Integer'`

- 解决指定参数

  `tt -t *Test print params[0].mobile=="13989838402"`

- 构成条件表达式的 `Advice` 对象

  前边看到了很多条件表达式中，都使用了 `params[0]`，有关这个变量的介绍，请参考[表达式核心变量](https://arthas.aliyun.com/doc/advice-class.html)

#### 检索调用记录

当你用 `tt` 记录了一大片的时间片段之后，你希望能从中筛选出自己需要的时间片段，这个时候你就需要对现有记录进行检索。

假设我们有这些记录



```bash
$ tt -l
 INDEX   TIMESTAMP            COST(ms)  IS-RET  IS-EXP   OBJECT         CLASS                          METHOD
-------------------------------------------------------------------------------------------------------------------------------------
 1000    2018-12-04 11:15:38  1.096236  false   true     0x4b67cf4d     MathGame                       primeFactors
 1001    2018-12-04 11:15:39  0.191848  false   true     0x4b67cf4d     MathGame                       primeFactors
 1002    2018-12-04 11:15:40  0.069523  false   true     0x4b67cf4d     MathGame                       primeFactors
 1003    2018-12-04 11:15:41  0.186073  false   true     0x4b67cf4d     MathGame                       primeFactors
 1004    2018-12-04 11:15:42  17.76437  true    false    0x4b67cf4d     MathGame                       primeFactors
                              9
 1005    2018-12-04 11:15:43  0.4776    false   true     0x4b67cf4d     MathGame                       primeFactors
Affect(row-cnt:6) cost in 4 ms.
```

我需要筛选出 `primeFactors` 方法的调用信息



```bash
$ tt -s 'method.name=="primeFactors"'
 INDEX   TIMESTAMP            COST(ms)  IS-RET  IS-EXP   OBJECT         CLASS                          METHOD
-------------------------------------------------------------------------------------------------------------------------------------
 1000    2018-12-04 11:15:38  1.096236  false   true     0x4b67cf4d     MathGame                       primeFactors
 1001    2018-12-04 11:15:39  0.191848  false   true     0x4b67cf4d     MathGame                       primeFactors
 1002    2018-12-04 11:15:40  0.069523  false   true     0x4b67cf4d     MathGame                       primeFactors
 1003    2018-12-04 11:15:41  0.186073  false   true     0x4b67cf4d     MathGame                       primeFactors
 1004    2018-12-04 11:15:42  17.76437  true    false    0x4b67cf4d     MathGame                       primeFactors
                              9
 1005    2018-12-04 11:15:43  0.4776    false   true     0x4b67cf4d     MathGame                       primeFactors
Affect(row-cnt:6) cost in 607 ms.
```

你需要一个 `-s` 参数。同样的，搜索表达式的核心对象依旧是 `Advice` 对象。

#### 查看调用信息

对于具体一个时间片的信息而言，你可以通过 `-i` 参数后边跟着对应的 `INDEX` 编号查看到他的详细信息。



```bash
$ tt -i 1003
 INDEX            1003
 GMT-CREATE       2018-12-04 11:15:41
 COST(ms)         0.186073
 OBJECT           0x4b67cf4d
 CLASS            demo.MathGame
 METHOD           primeFactors
 IS-RETURN        false
 IS-EXCEPTION     true
 PARAMETERS[0]    @Integer[-564322413]
 THROW-EXCEPTION  java.lang.IllegalArgumentException: number is: -564322413, need >= 2
                      at demo.MathGame.primeFactors(MathGame.java:46)
                      at demo.MathGame.run(MathGame.java:24)
                      at demo.MathGame.main(MathGame.java:16)

Affect(row-cnt:1) cost in 11 ms.
```

####  重做一次调用

当你稍稍做了一些调整之后，你可能需要前端系统重新触发一次你的调用，此时得求爷爷告奶奶的需要前端配合联调的同学再次发起一次调用。而有些场景下，这个调用不是这么好触发的。

`tt` 命令由于保存了当时调用的所有现场信息，所以我们可以自己主动对一个 `INDEX` 编号的时间片自主发起一次调用，从而解放你的沟通成本。此时你需要 `-p` 参数。通过 `--replay-times` 指定 调用次数，通过 `--replay-interval` 指定多次调用间隔(单位 ms, 默认 1000ms)



```bash
$ tt -i 1004 -p
 RE-INDEX       1004
 GMT-REPLAY     2018-12-04 11:26:00
 OBJECT         0x4b67cf4d
 CLASS          demo.MathGame
 METHOD         primeFactors
 PARAMETERS[0]  @Integer[946738738]
 IS-RETURN      true
 IS-EXCEPTION   false
 COST(ms)         0.186073
 RETURN-OBJ     @ArrayList[
                    @Integer[2],
                    @Integer[11],
                    @Integer[17],
                    @Integer[2531387],
                ]
Time fragment[1004] successfully replayed.
Affect(row-cnt:1) cost in 14 ms.
```

你会发现结果虽然一样，但调用的路径发生了变化，由原来的程序发起变成了 Arthas 自己的内部线程发起的调用了。

####  观察表达式

`-w, --watch-express` 观察时空隧道使用`ognl` 表达式

- 使用[表达式核心变量](https://arthas.aliyun.com/doc/advice-class.html)中所有变量作为已知条件编写表达式。



```bash
[arthas@10718]$ tt -t demo.MathGame run -n 5
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 1) cost in 56 ms, listenerId: 1
 INDEX      TIMESTAMP                   COST(ms)     IS-RET     IS-EXP      OBJECT              CLASS                                     METHOD
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1000       2021-01-08 21:54:17         0.901091     true       false       0x7699a589          MathGame                                  run
[arthas@10718]$ tt -w 'target.illegalArgumentCount'  -x 1 -i 1000
@Integer[60]
Affect(row-cnt:1) cost in 7 ms.
```

- 获取类的静态字段、调用类的静态方法



```bash
[arthas@10718]$ tt -t demo.MathGame run -n 5
Press Q or Ctrl+C to abort.
Affect(class count: 1 , method count: 1) cost in 56 ms, listenerId: 1
 INDEX      TIMESTAMP                   COST(ms)     IS-RET     IS-EXP      OBJECT              CLASS                                     METHOD
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1000       2021-01-08 21:54:17         0.901091     true       false       0x7699a589          MathGame                                  run
[arthas@10718]$ tt -w '@demo.MathGame@random.nextInt(100)'  -x 1 -i 1000
@Integer[46]
```

注意这里使用 `com.taobao.arthas.core.advisor.Advice#getLoader`加载,使用精确`classloader` [ognl](https://arthas.aliyun.com/doc/ognl.html)更好。

高级用法 [获取 spring context 调用 bean 方法在新窗口打开](https://github.com/alibaba/arthas/issues/482)

- 需要强调的点

  1. **ThreadLocal 信息丢失**

     很多框架偷偷的将一些环境变量信息塞到了发起调用线程的 ThreadLocal 中，由于调用线程发生了变化，这些 ThreadLocal 线程信息无法通过 Arthas 保存，所以这些信息将会丢失。

     一些常见的 CASE 比如：鹰眼的 TraceId 等。

  2. **引用的对象**

     需要强调的是，`tt` 命令是将当前环境的对象引用保存起来，但仅仅也只能保存一个引用而已。如果方法内部对入参进行了变更，或者返回的对象经过了后续的处理，那么在 `tt` 查看的时候将无法看到当时最准确的值。这也是为什么 `watch` 命令存在的意义。

### profiler

[`profiler`在线教程在新窗口打开](https://arthas.aliyun.com/doc/arthas-tutorials.html?language=cn&id=command-profiler)

提示

使用[async-profiler在新窗口打开](https://github.com/jvm-profiling-tools/async-profiler)生成火焰图

`profiler` 命令支持生成应用热点的火焰图。本质上是通过不断的采样，然后把收集到的采样结果生成火焰图。

```
profiler` 命令基本运行结构是 `profiler action [actionArg]
```

#### 参数说明

|    参数名称 | 参数说明                                                     |
| ----------: | :----------------------------------------------------------- |
|    *action* | 要执行的操作                                                 |
| *actionArg* | 属性名模式                                                   |
|        [i:] | 采样间隔（单位：ns）（默认值：10'000'000，即 10 ms）         |
|        [f:] | 将输出转储到指定路径                                         |
|        [d:] | 运行评测指定秒                                               |
|        [e:] | 要跟踪哪个事件（cpu, alloc, lock, cache-misses 等），默认是 cpu |

####  启动 profiler



```text
$ profiler start
Started [cpu] profiling
```

提示

默认情况下，生成的是 cpu 的火焰图，即 event 为`cpu`。可以用`--event`参数来指定。

#### 获取已采集的 sample 的数量



```text
$ profiler getSamples
23
```

#### 查看 profiler 状态



```bash
$ profiler status
[cpu] profiling is running for 4 seconds
```

可以查看当前 profiler 在采样哪种`event`和采样时间。

#### 停止 profiler stop



#### 生成 html 格式结果

默认情况下，结果文件是`html`格式，也可以用`--format`参数指定：



```bash
$ profiler stop --format html
profiler output file: /tmp/test/arthas-output/20211207-111550.html
OK
```

或者在`--file`参数里用文件名指名格式。比如`--file /tmp/result.html` 。

#### 通过浏览器查看 arthas-output 下面的 profiler 结果

默认情况下，arthas 使用 3658 端口，则可以打开： [http://localhost:3658/arthas-output/在新窗口打开](http://localhost:3658/arthas-output/) 查看到`arthas-output`目录下面的 profiler 结果：

![img](https://arthas.aliyun.com/images/arthas-output.jpg)

点击可以查看具体的结果：

![img](https://arthas.aliyun.com/images/arthas-output-svg.jpg)

提示

如果是 chrome 浏览器，可能需要多次刷新。

####  profiler 支持的 events

在不同的平台，不同的 OS 下面，支持的 events 各有不同。比如在 macos 下面：



```bash
$ profiler list
Basic events:
  cpu
  alloc
  lock
  wall
  itimer
```

在 linux 下面



```bash
$ profiler list
Basic events:
  cpu
  alloc
  lock
  wall
  itimer
Perf events:
  page-faults
  context-switches
  cycles
  instructions
  cache-references
  cache-misses
  branches
  branch-misses
  bus-cycles
  L1-dcache-load-misses
  LLC-load-misses
  dTLB-load-misses
  mem:breakpoint
  trace:tracepoint
```

如果遇到 OS 本身的权限/配置问题，然后  缺少部分 event，可以参考`async-profiler`本身文档：[async-profiler在新窗口打开](https://github.com/jvm-profiling-tools/async-profiler)

可以用`--event`参数指定要采样的事件，比如对`alloc`事件进入采样：



```bash
$ profiler start --event alloc
```

#### 恢复采样



```bash
$ profiler resume
Started [cpu] profiling
```

`start`和`resume`的区别是：`start`是新开始采样，`resume`会保留上次`stop`时的数据。

通过执行`profiler getSamples`可以查看 samples 的数量来验证。

#### 生成的火焰图里的 unknown

- https://github.com/jvm-profiling-tools/async-profiler/discussions/409

#### 主要是看懂火焰图



- 火焰图是基于 perf 结果产生的SVG 图片，用来展示 CPU 的调用栈。
  - y 轴表示调用栈，每一层都是一个函数。调用栈越深，火焰就越高，顶部就是正在执行的函数，下方都是它的父函数。
  - x 轴表示抽样数，如果一个函数在 x 轴占据的宽度越宽，就表示它被抽到的次数多，即执行的时间长。注意，x 轴不代表时间，而是所有的调用栈合并后，按字母顺序排列的。

* 火焰图就是看顶层的哪个函数占据的宽度最大。只要有"平顶"（plateaus），就表示该函数可能存在性能问题。

* 颜色没有特殊含义，因为火焰图表示的是-cpu-的繁忙程度，所以一般选择暖色调

原点--------------------------------------->x轴

|

|

|

^（箭头反过来） y轴
