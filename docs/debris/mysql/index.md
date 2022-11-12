# MySQL

## 创建用户并授权



```sql
create DATABASE data_standard;
# 说明：密码缺少大写会报错
create user 'data_standard'@'%' identified by 'Data_standard@2020';
#说明：on 数据库名.表明 all说明 见下面。如果只想要给select权限则把all代替select，多个写法中间用逗号隔开： select,insert,update 
grant all privileges on data_standard.* to data_standard@'%' with grant option;
# ALL  说明
flush privileges;
```

###  ALL 说明

下面讲解 GRANT 语句中的权限类型

####  1）授予数据库权限时，<权限类型>可以指定为以下值：

| 权限名称                       | 对应user表中的字段    | 说明                                                         |
| ------------------------------ | --------------------- | ------------------------------------------------------------ |
| SELECT                         | Select_priv           | 表示授予用户可以使用 SELECT 语句访问特定数据库中所有表和视图的权限。 |
| INSERT                         | Insert_priv           | 表示授予用户可以使用 INSERT 语句向特定数据库中所有表添加数据行的权限。 |
| DELETE                         | Delete_priv           | 表示授予用户可以使用 DELETE 语句删除特定数据库中所有表的数据行的权限。 |
| UPDATE                         | Update_priv           | 表示授予用户可以使用 UPDATE 语句更新特定数据库中所有数据表的值的权限。 |
| REFERENCES                     | References_priv       | 表示授予用户可以创建指向特定的数据库中的表外键的权限。       |
| CREATE                         | Create_priv           | 表示授权用户可以使用 CREATE TABLE 语句在特定数据库中创建新表的权限。 |
| ALTER                          | Alter_priv            | 表示授予用户可以使用 ALTER TABLE 语句修改特定数据库中所有数据表的权限。 |
| SHOW VIEW                      | Show_view_priv        | 表示授予用户可以查看特定数据库中已有视图的视图定义的权限。   |
| CREATE ROUTINE                 | Create_routine_priv   | 表示授予用户可以为特定的数据库创建存储过程和存储函数的权限。 |
| ALTER ROUTINE                  | Alter_routine_priv    | 表示授予用户可以更新和删除数据库中已有的存储过程和存储函数的权限。 |
| INDEX                          | Index_priv            | 表示授予用户可以在特定数据库中的所有数据表上定义和删除索引的权限。 |
| DROP                           | Drop_priv             | 表示授予用户可以删除特定数据库中所有表和视图的权限。         |
| CREATE TEMPORARY TABLES        | Create_tmp_table_priv | 表示授予用户可以在特定数据库中创建临时表的权限。             |
| CREATE VIEW                    | Create_view_priv      | 表示授予用户可以在特定数据库中创建新的视图的权限。           |
| EXECUTE ROUTINE                | Execute_priv          | 表示授予用户可以调用特定数据库的存储过程和存储函数的权限。   |
| LOCK TABLES                    | Lock_tables_priv      | 表示授予用户可以锁定特定数据库的已有数据表的权限。           |
| ALL 或 ALL PRIVILEGES 或 SUPER | Super_priv            | 表示以上所有权限/超级权限                                    |

#### 2) 授予表权限时，<权限类型>可以指定为以下值：

| 权限名称                       | 对应user表中的字段 | 说明                                                       |
| ------------------------------ | ------------------ | ---------------------------------------------------------- |
| SELECT                         | Select_priv        | 授予用户可以使用 SELECT 语句进行访问特定表的权限           |
| INSERT                         | Insert_priv        | 授予用户可以使用 INSERT 语句向一个特定表中添加数据行的权限 |
| DELETE                         | Delete_priv        | 授予用户可以使用 DELETE 语句从一个特定表中删除数据行的权限 |
| DROP                           | Drop_priv          | 授予用户可以删除数据表的权限                               |
| UPDATE                         | Update_priv        | 授予用户可以使用 UPDATE 语句更新特定数据表的权限           |
| ALTER                          | Alter_priv         | 授予用户可以使用 ALTER TABLE 语句修改数据表的权限          |
| REFERENCES                     | References_priv    | 授予用户可以创建一个外键来参照特定数据表的权限             |
| CREATE                         | Create_priv        | 授予用户可以使用特定的名字创建一个数据表的权限             |
| INDEX                          | Index_priv         | 授予用户可以在表上定义索引的权限                           |
| ALL 或 ALL PRIVILEGES 或 SUPER | Super_priv         | 所有的权限名                                               |

#### 3) 授予列权限时，<权限类型>的值只能指定为 SELECT、INSERT 和 UPDATE，同时权限的后面需要加上列名列表 column-list。

#### 4) 最有效率的权限是用户权限。

授予用户权限时，<权限类型>除了可以指定为授予数据库权限时的所有值之外，还可以是下面这些值：

- CREATE USER：表示授予用户可以创建和删除新用户的权限。
- SHOW DATABASES：表示授予用户可以使用 SHOW DATABASES 语句查看所有已有的数据库的定义的权限。

## 查询表元信息结构



```sql
use data_standard; # 使用哪个库
show TABLES;  # 展示所有的表
desc/DESCRIBE  table_category_rel;  # 表结构
show create table  table_category_rel; # 创建语句

use information_schema;

show DATABASEs; # 当前账号可查看的所有数据库

SELECT * from  TABLES ; # 提供了关于数据库中的表的信息（包括视图）。详细表述了某个表属于哪个schema，表类型，表引擎，创建时间等信息。是show tables from schemaname的结果取之此表
SELECT * from COLUMNS; # 提供了表中的列信息。详细表述了某张表的所有列以及每个列的信息。是show columns from schemaname.tablename的结果取之此表。
SELECT * from STATISTICS; # 提供了关于表索引的信息。是show index from schemaname.tablename的结果取之此表。
SELECT * from USER_PRIVILEGES; # 用户权限表：给出了关于全程权限的信息。该信息源自mysql.user授权表。是非标准表
SELECT * from SCHEMA_PRIVILEGEs; # 方案权限）表：给出了关于方案（数据库）权限的信息。该信息来自mysql.db授权表。是非标准表。
SELECT * from TABLE_CONSTRAINTS; # 描述了存在约束的表。以及表的约束类型。
select * from VIEWS; # 给出了关于数据库中的视图的信息。需要有show views权限，否则无法查看视图信息。


```

[来源](https://blog.csdn.net/u011250186/article/details/124377147)

## 命令行界面select 后乱序无法查看

```sh
# 在后面加上\G即可
select * from test\G
```





## 查看所有进程

```sh
SELECT * from information_schema.processlist WHERE host like  '%192.168.1.102%'
```

## 查看MySQL执行记录



```sh
#  查看profiling设置,是否开启
SHOW GLOBAL VARIABLES LIKE "profiling%"
SET GLOBAL profiling = ON
# 查看最近执行的SQL,可以得到ID
SHOW PROFILES
# 将ID赋值到下面的语句中，既可以查看执行时基础数据
SHOW PROFILE cpu,block io for 34;
```



### 查看全局查询日志



```sh

#
SHOW GLOBAL VARIABLES LIKE "general_log%"
SET GLOBAL general_log = ON
#设置表明
SET GLOBAL log_output = "TABLE" # 此处不设置，默认为 general_log
SHOW GLOBAL VARIABLES LIKE "log_output%"

# 
select * from mysql.general_log
#线上不建议开启

```





## 触发器 定时任务 - 定时保存表 的占用空间和行数



```sh

# 定时任务 查看是否开启  启动定时器
 select * from  mysql.event;
SHOW GLOBAL VARIABLES LIKE '%sql_mode%'
set GLOBAL event_scheduler = 1;
# 删除定时任务
DROP EVENT IF EXISTS patrol_data_event;
DROP EVENT  patrol_data_event;

# 新增定时任务


CREATE EVENT if not exists  patrol_data_event ON 
-- SCHEDULE EVERY 5 SECOND 
SCHEDULE EVERY 1 Day 
starts '2022-09-26 23:59:00'
DO
INSERT INTO patrol_database.patrol_data ( date, table_name, data_size, table_rows, table_schema ) SELECT
CURDATE(),
TABLE_NAME,
TRUNCATE (( data_length + index_length )/ 1024 / 1024, 2 ) AS data_size,-- 查看数据+索引占用大小单位为MB
table_rows,
table_schema 
FROM
	information_schema.TABLES;
```

## select into

```sh


create table xxxx like data_mgr;
 
insert into xxxx select * from data_mgr;

把table_2数据转存到table_1，此方法适合table_1已经创建的

INSERT INTO db1_name(field1,field2) SELECT field1,field2 FROM db2_name
```

