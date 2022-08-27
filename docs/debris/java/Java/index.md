# Java 碎片



## JDK8特性



::: details  Optional 

```java
 public void checkOutId(StockCus stockCus) {
        Optional.ofNullable(stockCus.getCusId()).ifPresent((b) -> {
            Optional<StockCus> byId = stockCusRepository.findById(b);
            Optional.ofNullable(byId).orElseThrow(() -> new BaseException("记录不存在"));
        });
        Optional.ofNullable(stockCus.getCusId()).ifPresent((b)->{
            Customer customer = customerService.get(b);
            Optional.ofNullable(customer).orElseThrow(()->new BaseException("记录不存在"));
        });

    }
```

:::


::: details   `List &lt;  List  &lt;   Object&gt;&gt;` 转`List  &lt; Object &gt;`

```java
            List<List<StockCus>> collect2 = stocks.stream().map(b -> b.getStockCusList()).collect(Collectors.toList());
            List<StockCus> collect3 = collect2.stream().flatMap(Collection::stream).collect(Collectors.toList());
```

:::

:::   details  归类

```java
        Map<Long, List<Stock>> collect1 = all1.stream().collect(Collectors.groupingBy(b -> b.getBrandId()));

```

:::

:::  details  统计

```java
            Integer down = collect3.stream().filter(b -> b.getDownNum() != null).map(StockCus::getDownNum).reduce(Integer::sum).orElse(null);

```

:::



