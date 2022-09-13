# SpringBoot

## 返回给前端 全局格式化LocalDateTime



```java

package com.gdin.analysis.config;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/25 8:59
 */

import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * LocalDateTime全局格式
 */
@Configuration
public class LocalDateTimeGlobalConfig {

    //默认值2021-7-9 11:21:11，想使用其他格式可在配置文件里配置
    private static final String pattern="yyyy-MM-dd HH:mm:ss";

    /**
     * 设置LocalDateTime格式
     */
    @Bean
    public LocalDateTimeSerializer localDateTimeDeserializer() {
        return new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 设置Jackson中LocalDateTime的格式
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return builder -> builder.serializerByType(LocalDateTime.class, localDateTimeDeserializer());
    }

}




```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>gdin-ucar-analysis</artifactId>
        <groupId>com.gdin.ucar</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>analysis-common</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi</artifactId>
            <version>4.1.0</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.datatype</groupId>
            <artifactId>jackson-datatype-jsr310</artifactId>
            <version>2.9.8</version>
        </dependency>


        <dependency>
            <groupId>com.gdin</groupId>
            <artifactId>gdin-starter-dependencies-common</artifactId>
            <version>1.0.0-RELEASE</version>
        </dependency>
        <dependency>
            <groupId>com.github.yitter</groupId>
            <artifactId>yitter-idgenerator</artifactId>
            <version>1.0.6</version>
        </dependency>
    </dependencies>

</project>
```



```yml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
```

##  SSH连接 mysql

```sh
# 数据信息
139.9.19.120 # IP A :外网可访问的服务器
192.168.0.120 # IP B:与A 内网可互通

```

nginx配置

```
stream {
    upstream cloudsocket {
       hash $remote_addr consistent;
       server 192.168.0.210:3306 weight=5 max_fails=3 fail_timeout=30s;
    }
    server {
       listen 9001;#     ˿ں 
       proxy_connect_timeout 10s;
       proxy_timeout 300s;#   ÿͻ  ˺ʹ      ֮  ĳ ʱʱ 䣬   5      û       Զ  Ͽ   
       proxy_pass cloudsocket;
    }
    
}
```

Navicat链接方式

![](/images/debris/java/SpringBoot/4149.png)

![](/images/debris/java/SpringBoot/4448.png)



SpringBoot



```java
package com.example.demo11.config;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/9/5 16:57
 */

import org.springframework.stereotype.Component;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;


@WebListener
@Component
public class MyContextListener implements ServletContextListener {
    private SSHConnection conexionssh;
    public MyContextListener() {
        super();
    }

    @Override
    public void contextInitialized(ServletContextEvent arg0) {
        // 建立连接
        try {
            conexionssh = new SSHConnection();
            conexionssh.SSHConnection();
            System.out.println("成功建立SSH连接");
        } catch (Throwable e) {
            System.out.println("SSH连接失败！");
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent arg0) {
        // 断开连接
        System.out.println("Context destroyed ... !\n\n\n");
        try {
            conexionssh.closeSSH(); // disconnect
            System.out.println("\n\n\n成功断开SSH连接!\n\n\n");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("\n\n\n断开SSH连接出错！\n\n\n");
        }
    }
}

```

```java
package com.example.demo11.config;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/9/5 16:56
 */

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

public class SSHConnection {


    String user = "****";// 服务器登录名

    String password = ""****";//";// 服务器登陆密码

    String host = "139.9.79.120";	// 服务器公网IP

    int port = 22;  //  服务器公网IP 跳板机ssh开放的接口,ssh通道端口   默认端口 22

    int local_port = 3307; // 这个是本地的端口，选取一个没有占用的port即可

    String remote_host = "192.168.0.210";// 要访问的mysql所在的ip

    int remote_port = 3306;// 服务器上数据库端口号



    Session session = null;
    /**
     *    建立SSH连接
     */
    public void SSHConnection() throws Exception{
        try {
            JSch jsch = new JSch();
            session = jsch.getSession(user, host, port);
            session.setPassword(password);
            session.setConfig("StrictHostKeyChecking", "no");
            session.connect();
            session.setPortForwardingL(local_port, remote_host, remote_port);
        } catch (Exception e) {
            // do something
        }
    }
    /**
     *    断开SSH连接
     */
    public void closeSSH () throws Exception
    {
        this.session.disconnect();
    }

}


```



```java
spring.application.name=demo11
server.port=8503
//127.0.0.1:3307 本机的3307端口，ip不需改动，和ssh工具类的local_port对应起来
spring.datasource.url=jdbc:mysql://127.0.0.1:3307/databasename?useSSL=false&autoReconnect=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
spring.datasource.username=*** // 数据库用户名
spring.datasource.password=*** //数据库密码
spring.datasource.druid.test-on-borrow=true
spring.datasource.druid.test-while-idle=true
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
```



```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>demo11</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo11</name>
    <description>demo11</description>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>


        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>com.jcraft</groupId>
            <artifactId>jsch</artifactId>
            <version>0.1.55</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <mainClass>com.example.demo11.Demo11Application</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>

```



## 直连数据库 

```java

stream {
    server {
    	 listen 9023; ## 
    	 proxy_connect_timeout 10s; #连接超时时间
      proxy_timeout 300s;#设置客户端和代理服务之间的超时时间，如果5分钟内没操作将自动断开
      proxy_pass 192.168.0.210:3306; #内网的ip和端口。
    }
    
}
```





