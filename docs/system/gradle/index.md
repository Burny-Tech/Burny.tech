[[toc]]
:::tip
[gradle官网](https://gradle.org/install/ )

 [gradle 创建SpringBoot docs]( https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/) 

[springboot官网提供的脚手架](https://start.spring.io/)



:::

#### 必须存在的文件，其他可以删除。  

* ```build  .mvn```
* ```src```
* ```build.gradle   pom```
* ```settings.gradle```
* ```app``` 子模块目录

#### 常见命令
```sh
gradle init # 初始化
gradle clean  #清理
gradle classes #编译业务代码何配置文件
gradle test
gradle build #构建项目 生成在build包下
gradle build -x test  # 跳过测试
```
#### 修改源

init.d下的文件init.gradle 
```https://maven.aliyun.com/repository/pulbic```

#### 仓库地址说明
 严格上来说，gradle 是没有仓库的概念，./cache modeules 下面 
 gradle jar包 和 gradle 用mavenjar包是两个不同的概念

```
allProjects {
  repositories {
    maven {
      url 'https://maven.aliyun.com/repository/public/'
    }
    maven {
      url 'https://maven.aliyun.com/repository/spring/'
    }
    mavenLocal()
    mavenCentral()
  }
}
```

 #### wrapper 包装器

 用于解决实际开发中可能会遇到的不同项目需要不同的版本  


 常用命令

 ```gradle  wrapper --gradle-version```   
 ```gradle  wrapper --gradle-distribution-url```

#### groovy

```https://groovy.apache.org/download.html```

提供动态类型转换，闭包，元编程的支持  
支持DSL 语言  
Groovy是基于java ,运行在JVM上

* 脚本文件与类文件同在  
* 返回值不建议指定具体返回值类型
* 对象属性的赋值  读 操作  
  * 对象名\.属性名
  * 对象\["属性名"\]
  * Java 中的setter getter 构造函数等
* 方法默认最后一行作为返回值  
* 引号类型
  * 单引号  ```不支持变量引用```，不支持换行操作
  * 双引号  支持变量引用，不支持换行操作
  * 三引号  模板字符串  
*  不要在脚本中包含与脚本文件同名的类


#### idea 和gradle

同maven设置一样，需要设置下自己下载的gradle 家目录，并且指定jdk  
每次新建都需要设置gradle 家目录  

#### Java中的闭包

#### 部署 war包
*  tomcat

*  Gretty部署项目 低版本
   * 引入插件
   * 指定maven仓库
   * 针对gretty插件设置
   * ``` gradle appRun```

#### gradle生命周期

初始化 --> 配置 -> 导出  
仓库名，gradle setting 文件里的名称 -> 根据 执行build构建脚本 首先加载root 再加载 二级项目 有向无闭环 -> 导出

#### settings文件

* 作用：项目初始化阶段确定一下引用哪些工程工程到项目构件中  
* gradle 有工程树概念 类似于maven中的project 和module
  
* 有且只有一个，名称要正确
* 配置的是相对路径，可在路径前面加 :  表示相对路径

####  <a name="#task">Task </a>


项目是指是一系列task的集合

```sh
# 执行命令
gradle -i taskname  //i info 级别日志
gradle 驼峰命名的首字母缩写；
下面参数可传 方法，map,闭包等
task "task" {
  //任务的配置段：再配置阶段执行
  println "这是最简单的任务"
  //任务的执行阶段
  doFirst{

  }
  doLast{
    
  }

}
task task{

}
task ("taskname"){

}

taskname.dofirst{
  //如果该方法定义在外面，则比方法的dofirst还要先执行，同理，dolast比任务名内要后执行
}
taskname.doLast{
  
}
```


#### 任务依赖方式



* 参数式依赖，dependsOn后面用冒号
```sh

task C (dependsOn:['A','B']){
  # 或者将参数移到方法内  dependsOn:['A','B'] 函数内部依赖
  doLast{
    print 'taskccccc'
  }
}  
#或者海曙外部依赖
C.dependsOn['a','b']

#跨项目依赖
dependson('工程:任务名')
```
* 重复依赖只会执行一次


#### 常见脚本

##### 
```
gradle build 

gradle run 

plunins {
  id ''application 
}
指定主启动类
mainClass='com...'

gradle clean # 不会对子项目clean

项目报告
gradle projects 生成树状结构的项目结构

gradle tasks  **已经分配任务组的任务，当前包下，不会对子项目**

gradle tasks -all 所有task

gradle dependences 项目依赖 有星号代表jar包冲突
gradle properties  项目属性
```

调试
```
-Dorg.gradle.debug=true 调式gradlw 客户端，非daemon进程
-Dorg.gradle.daemon =true 调试gradle，daemon进程
-S，--full-straktrace 打印初所有异常的完整
-s ，-stackrrace 非完整打印
```
gradle.properties 
该项目下所有的全局参数，可以设置并行构建，jvm内存大小，构建核数目

**```gradle init -type pom``` 将maven项目转换为gradle项目，根目录执行** 选择grovy脚本

#### 任务的定义方式


第一种方式
[task](#task)
第二种方式
task对象调用 create registe 方法
```

group
description
override  替换已存在。配合type使用，默认false
dependsOn
action 添加一个任务
type 类似于继承

```
#### 任务类型

gradle默认给提供任务类型，实质是一段脚本，在task中使用
```
delete
jar
tar

```
还可以自定义任务类型

#### gradle 执行顺序

1. denpendsOn 强依赖方式
2. 通过task输入输出
3. 通过API指定执行顺序

#### 动态分配任务

taks名字前加数字 **```4.```** 代表循环执行4次

#### 任务超时异常 

gradle --continue 可在发生异常的时候继续执行，
```sh
timeout=Duration.ofMills(500)
```
#### task 查找
```
findByname
findBypath(:) # :代表相对路径
```

#### onlyif 断言
taskname.onlyif{!project.hasProperties('key')}

#### 默认task
defaulttask 'taskname'

#### gradle 文件操作
p32 p33
```
File filename=file('path')
filename.isExit 等

```
文件集合,可操作很多，
files('path',['path','path'])

#### 依赖方式
本地依赖：依赖本地的某个jar包，具体可通过 文件集合 文件树 解释：原始的lib包  ```implementation files('path')```   ```implementation files('dir':'lib',incldudes:['*.jar],excludes:[''])``` 
项目依赖
直接依赖 依赖的类型 依赖的组名 依赖的名称 依赖的版本号
          group:  , name:  ,   version   ,  version  ,

#### 依赖下载

当执行build的时候就会去下载

#### 依赖的类型

类似于maven的scope
```compile```  ```runtime``` 已经废弃 

#### api与impletemention的区别

api 编译时 能进行依赖传递，底层变了，全部都要变 可以避免重复依赖

implementation 不能进行依赖传递，底层变了，不用全部都要变 

以下 i = ```implementation  ```

```sh
A i B ,B i C  则A不能使用C

A i B ,B api C ,则A可以使用C

A I B,B I C,C API D ,则b可以使用d ,但是A不能使用D

A I B ,B API C C API D 这样A可以使用D
```

不管ABCD在何处都被添加到类路径都一样，在运行时这些模块中的class都是要被加载的

总之，除非设涉及到多模块依赖，为了避免重复依赖，会使用api，其他情况优先使用 imletation

#### 依赖冲突

会优先使用高版本号的依赖，认为会向下依赖传递，

exclude

transitive(false) 不建议 其他依赖不会导入

在版本后面加 !!   强制使用依赖版本



查看哪些有冲突

如果有冲突，构件会自动优先使用高版本号，如果需要可以添加以下配置

```
configurations.all(){
	Configuration configuration ->
		configration.resolutionStrategy.failOnVersionConflict()
}
```



将版本号改为`+` 或`latest.integration` 则代表使用最新版本



#### 插件

* 脚本插件
* 二进制插件（对象插件） 
  * 内部插件 
  * 第三方插件
  * 自定义插件

```sh
#使用方式
apply plugin:java

plunins:{

}
apply {
	pulunin:java
}

buildScript 插件


```



#### build.gradle

可以指定jdk版本，仓库库，字符集编码，仓库等从上到下，可以指定本地仓库

```sh
# 指定变异版本，跟变异环境有关，有java插件才能使用
sourceCompatibilty=1.8
targetCompatibility=1.8
# 业务编码字符集不变吗
compileJava.options.encoding "UTF-8"
compileTestJava.options.encoding "UTF-8"
#编译时采用的字符集
tasks.withType(JavaCompile){
	options.encoding="UTF-8"
}
tasks.withType(Javadoc){
	options.encoding="UTF-8"
}

repository{
	maven{ url 'file:///d:/repos/'}
	maven{name ""  ;url ""}
	mavenCentral()
	google()
	
}

allproject #所有仓库

ext #用户自定义属性 ,
#gradle.properties定义的是和系统属性，环境属性，项目属性，jvm参数等等

ext{
	phone= 
	name=".."
}
# 使用 
	${phone}
	


```





* build.script必须在最前面

####  项目发布

# 这个明天需要复制一下（以下三个问题）

```
plunins{
	id 'maven'
}
```



#### 利用钩子函数计算所消耗的时间



#### 解决springboot与plunin的manager版本不一致

spring-boot-gradle-plugin 插件

整个脚本文件的最上面









