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

