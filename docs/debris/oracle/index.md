

## 连接数

```sql
# oralce 默认没有能查客户端ip,创建触发器进行查询
create or replace trigger on_logon_trigger after logon on database  
begin  
    dbms_application_info.set_client_info(sys_context('userenv', 'ip_address'));  
end;

# 查看当前连接
SELECT * from  v$session

# 查询连接信息
select sid,serial#,username,program,machine,client_info  ,LOGON_TIME
from v$session  
WHERE client_info is not null 
order by LOGON_TIME DESC  

# 统计
select client_info ,COUNT(*)
from v$session  
WHERE client_info IS NOT  NULL
GROUP BY  client_info
order by LOGON_TIME DESC  


```

