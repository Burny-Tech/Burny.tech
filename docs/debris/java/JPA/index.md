# JPA

## 一对多



```java

public class Stock extends BaseEntity {
        @ApiModelProperty("囤货客户")
    @OneToMany(targetEntity = StockCus.class,cascade = CascadeType.ALL,fetch = FetchType.LAZY,orphanRemoval = true)
    @JoinColumn(name = "stock_cus_id",referencedColumnName = "id",insertable = true,updatable = true)
    List<StockCus> stockCusList;
    
}
//多的一方没有包含一的一方
public class StockCus  extends BaseEntity{
}
```

**删除多的一方！！！**

```java
    public void save(StockForm form) {
        Long id = form.getId();
        List<StockCusForm> stockCusList = form.getStockCusList();
        Stock saveBean = new Stock();
        if (id != null) {
            Stock bean = this.getOrign(id);
            List<StockCusForm> listForm = form.getStockCusList();
            //原来的多的一方全都删除掉，用stockcusrepository。delebyid 是删除无效的
            if (listForm == null) {
                List<StockCus> stockCusList2 = bean.getStockCusList();
                if (stockCusList2 != null) {
                    bean.getStockCusList().removeAll(stockCusList2);
                    //stockRepository.save(bean);
                }
            }

            Optional.ofNullable(listForm).ifPresent(
                    (formList) -> {
                        Map<Long,StockCus> mapForm = formList.stream().filter(c -> c.getId()!=null ).map(x -> StockCus.of(x)).collect(Collectors.toMap(StockCus::getId,e->e));
                        Optional.ofNullable(bean.getStockCusList()).ifPresent((x) -> {
                            Map<Long, StockCus> sqlBean = x.stream().collect(Collectors.toMap(StockCus::getId, e -> e));
                            sqlBean.keySet().stream().forEach(b -> {
                                StockCus stockCus = mapForm.get(b);
                                if (stockCus == null) {
                                     //原来的多的一方删除掉，用stockcusrepository。delebyid 是删除无效的
                                    bean.getStockCusList().remove(b);

                                }
                            });
                        });
                    }
            );
            BeanConverter.convert(bean, saveBean);
        }
        BeanConverter.convert(form, saveBean);
        Optional.ofNullable(stockCusList).ifPresent((b) -> {
            List<StockCus> result = b.stream().map(bean -> {
                StockCus save = new StockCus();
                //更新
                Optional.ofNullable(bean.getId()).ifPresent((t) -> {
                    Optional<StockCus> byId = stockCusRepository.findById(t);
                    byId.orElseThrow(() -> new BaseException("记录不存在"));
                    byId.ifPresent(x -> BeanConverter.convert(x, save));
                });
                //保存
                BeanConverter.convert(bean, save);
                return save;
            }).collect(Collectors.toList());
            saveBean.setStockCusList(result);
        });
        this.checkOutId(saveBean);

        //
        //囤货业务的结束逻辑改为：提报成功数量=下游订单总数量
        //现货采购的逻辑为：采购数量 = 下游订单总数量

        if (saveBean.getBuyType()!=null&& saveBean.getBuyType()==0){
            Integer subSuccNum = saveBean.getSubSuccNum();
            Integer stockCus = saveBean.getStockCusList().stream().filter(e -> e.getDownNum() != null).map(StockCus::getDownNum).reduce(Integer::sum).orElse(null);
            if (subSuccNum!=null && stockCus!=null&& subSuccNum.equals(stockCus)){
                saveBean.setOrderSatusIn(1);
            }
        }
        if (saveBean.getBuyType()!=null&& saveBean.getBuyType()==1){
            Integer subSuccNum = saveBean.getNum();
            Integer stockCus = saveBean.getStockCusList().stream().filter(e -> e.getDownNum() != null).map(StockCus::getDownNum).reduce(Integer::sum).orElse(null);
            if (subSuccNum!=null && stockCus!=null&& subSuccNum.equals(stockCus)){
                saveBean.setOrderSatusIn(1);
            }
        }



        stockRepository.save(saveBean);
    }



```

## 启动时加载到内存

```java
package com.gdin.analysis.service;

/*
 *@author cyx
 *@date 2022/3/7
 *@apiNote TODO
 */

import com.gdin.analysis.dao.DepartmentRepository;
import com.gdin.analysis.entity.Department;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DepartmentService {

    @Resource
    DepartmentRepository departmentRepository;


    private List<Department> departmentList;

    private Map<Long, Department> departmentMap;

    private Map<String, Department> stringDepartmentMap;

    public List<Department> getDepartmentList() {
        return departmentList;
    }

    public void setDepartmentList(List<Department> departmentList) {
        this.departmentList = departmentList;
    }

    public Map<Long, Department> getDepartmentMap() {
        return departmentMap;
    }

    public void setDepartmentMap(Map<Long, Department> departmentMap) {
        this.departmentMap = departmentMap;
    }


    public Map<String, Department> getStringDepartmentMap() {
        return stringDepartmentMap;
    }

    public void setStringDepartmentMap(Map<String, Department> stringDepartmentMap) {
        this.stringDepartmentMap = stringDepartmentMap;
    }

    @PostConstruct
    public void initData() {
        List<Department> all =
                departmentRepository.findAll();
        HashMap<Long, Department> hashMap = new HashMap<>(256);
        HashMap<String, Department> stringMap = new HashMap<>();
        all.forEach(bean -> {
            hashMap.put(bean.getId(), bean);
            stringMap.put(bean.getName(), bean);
        });
        setDepartmentList(all);
        setDepartmentMap(hashMap);
        setStringDepartmentMap(stringMap);
    }

    public List<Department> getDepartment() {
        return getDepartmentList();
    }

    public Boolean judgeDepartmentIdIsExist(List<Long> longs) {
        Boolean exist = true;
        for (int i = 0; i < longs.size(); i++) {
            boolean contains = this.departmentList.contains(longs.get(i));
            if (!contains) {
                exist = false;
            }
        }
        return true;
    }

    public Department getById(Long id) {
        Department department = this.departmentMap.get(id);
        return department;
    }

}

```

## 逻辑删除与唯一索引







