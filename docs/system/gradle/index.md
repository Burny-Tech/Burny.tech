
[[toc]]
:::tip
官网：https://gradle.org/install/  
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

  


