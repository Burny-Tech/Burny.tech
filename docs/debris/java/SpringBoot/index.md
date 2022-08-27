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

