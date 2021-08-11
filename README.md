# @xm/transform-data

#### 介绍

```
xnpm i -S @xm/transform-data
```

组件转换函数

```javascript
import TransformData  from  '@xm/transform-data'

const transformData  =  new TransformData()

const result = transformData.getOption(rows,config)

```

接受的数据源为 3 种：

- 平铺的数组结构：

```js
var rows = [
  {
    x: '纬度：月份、时间',
    y: '指标名称',
    dl: '图例的值',
    dw: '单位'
  }
]

transformData.getOption(rows, {
  x: 'x',
  y: 'y',
  dl: 'dl',
  dw: 'dw'
})
```

- 值为数组(许昌):

```js
var rows = [
  {
    x: [1, 2, 3, 4, 5, 6], // 纬度：月份、时间
    // y: ['指标1'], // 指标名称
    dl: [100, 22, 44, 54, 27, 12],
    dw: ['单位']
  }
]

transformData.getOptionXuchang(rows, {
  x: 'x',
  y: [
    {
      field: 'dl',
      // 写死指标名称
      name: '指标名称',
      unit: '次数'
    }
  ]
})
```

- 平铺的数组结构，无指标名称，需要先转换为数组结构（许昌）

```js
var rows = [
  {
    x: '纬度：月份、时间',
    dl: '图例的值',
    dl2: '图例的值',
    dw: '单位'
  }
]

transformData.getOptionXuchang(rows, {
  isFormat: true,
  x: 'x',
  y: [
    {
      field: 'dl',
      // 写死指标名称
      name: '指标名称',
      unit: '次数'
    },
    {
      field: 'dl2',
      // 写死指标名称2
      name: '指标名称2',
      unit: '次数'
    }
  ]
})
```
