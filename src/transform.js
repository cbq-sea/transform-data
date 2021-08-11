import { isPlainObject, summate, formatData } from './utils'

const COMPONENT_TYPE = {
  1: {
    name: '指标图',
    type: 'indicator',
  },
  2: {
    name: '折线图',
    type: 'line',
  },
  3: {
    name: '区域图',
    type: 'line',
  },
  4: {
    name: '基本柱状图',
    type: 'bar',
  },
  5: {
    name: '饼图',
    type: 'pie',
  },
  6: {
    name: '环形饼图',
    type: 'pie',
  },
  7: {
    name: '表格',
    type: 'table',
  },
  8: {
    name: '水平柱状图',
    type: 'bar',
  },
  9: {
    name: '双轴折线图',
    type: 'line',
  },
  10: {
    name: '折线柱状图',
    type: 'line',
  },
  11: {
    name: '列表下钻',
    type: 'list',
  },
  12: {
    name: '占位组件',
    type: 'any',
  },
  13: {
    name: '曲线图',
    type: 'line',
  },
  14: {
    name: '静态图',
    type: 'static',
  },
  15: {
    name: '2D地图',
    type: 'map',
  },
  16: {
    name: '条形图',
    type: 'bar',
  },
  17: {
    name: '二级tab',
    type: 'tab',
  },
  20: {
    name: '轮播图',
    type: 'swiper',
  },
  22: {
    name: '雷达图',
    type: 'radar',
  },
}

/**
 * 转换函数 用于转换[{key:value}] 数据为echarts | table 标准数据
 */
export default class TransformData {
  constructor(rows = [], config = {}, chartConfig) {
    this.rows = rows
    this.config = config
    this.chartConfig = chartConfig
  }

  /**
   *转换x轴
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @param {object} chartConfig  图表配置项
   * @returns {object}
   */
  getXAxis = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { x, componentType, componentStyleConfig = {} } = config
    const data = [...new Set(rows.map((it) => it[x]))].map((item) => {
      if ((componentType === 8 || componentType === 16) && item.length > 6) {
        // 水平柱状图 label文字长度控制
        const num = Math.floor(item.length / 2)

        return `${item.substring(0, num)}\n${item.substring(num)}`
      }

      return item
    })

    const targetConfig = isPlainObject(chartConfig)
      ? {
          axisLabel: {
            color: chartConfig.color || '#fff',
            rotate: componentStyleConfig.rotate,
          },
          axisLine: {
            lineStyle: {
              color: chartConfig.color || '#fff',
            },
          },
          splitLine: {
            lineStyle: {
              color: [chartConfig.color || '#fff'],
            },
          },
        }
      : {
          axisLabel: {
            rotate: componentStyleConfig.rotate || 0,
          },
        }
    // eslint-disable-next-line
    !componentStyleConfig.rotate && delete targetConfig.axisLabel

    return {
      type: 'category',
      data,
      ...targetConfig,
    }
  }

  getXAxisXC = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { x, xRest = '', componentStyleConfig = {} } = config

    const targetConfig = isPlainObject(chartConfig)
      ? {
          axisLabel: {
            color: chartConfig.color || '#fff',
            rotate: componentStyleConfig.rotate,
          },
          axisLine: {
            lineStyle: {
              color: chartConfig.color || '#fff',
            },
          },
          splitLine: {
            lineStyle: {
              color: [chartConfig.color || '#fff'],
            },
          },
        }
      : {
          axisLabel: {
            rotate: componentStyleConfig.rotate || 0,
          },
        }
    // eslint-disable-next-line
    !componentStyleConfig.rotate && delete targetConfig.axisLabel

    return {
      type: 'category',
      data: rows[x].map((it) => it + xRest),
      ...targetConfig,
    }
  }

  /**
   *转换Y轴
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @param {object} chartConfig  图表配置项
   * @returns {object}
   */
  getYAxis = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { dw } = config

    const name = rows.length ? rows[0][dw] : ''

    const targetConfig = isPlainObject(chartConfig)
      ? {
          axisLabel: {
            color: chartConfig.color || '#fff',
          },
          axisLine: {
            lineStyle: {
              color: chartConfig.color || '#fff',
            },
          },
          splitLine: {
            lineStyle: {
              color: [chartConfig.color || '#fff'],
            },
          },
          nameTextStyle: {
            color: chartConfig.color || '#fff',
          },
        }
      : {}

    return {
      type: 'value',
      name: name ? `单位：${name}` : '',
      ...targetConfig,
    }
  }

  /**
   * 许昌
   *转换Y轴
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @param {object} chartConfig  图表配置项
   * @returns {object}
   */
  // eslint-disable-next-line
  getYAxisXC = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { y = [] } = config

    const dws = [...new Set(y.map((it) => it.unit))].filter(Boolean)

    const targetConfig = isPlainObject(chartConfig)
      ? {
          axisLabel: {
            color: chartConfig.color || '#fff',
          },
          axisLine: {
            lineStyle: {
              color: chartConfig.color || '#fff',
            },
          },
          splitLine: {
            lineStyle: {
              color: [chartConfig.color || '#fff'],
            },
          },
          nameTextStyle: {
            color: chartConfig.color || '#fff',
          },
        }
      : {}

    return {
      type: 'value',
      name: dws.length ? `单位：${dws[0]}` : '',
      ...targetConfig,
    }
  }

  /**
   *转换Y轴 双y轴
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @param {object} chartConfig  图表配置项
   * @returns {array}
   */

  getDoubleYAxis = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { dw, y } = config

    const series = this.getSeries(rows, config)

    const targetConfig = isPlainObject(chartConfig)
      ? {
          axisLabel: {
            color: chartConfig.color || '#fff',
          },
          axisLine: {
            lineStyle: {
              color: chartConfig.color || '#fff',
            },
          },
          splitLine: {
            lineStyle: {
              color: [chartConfig.color || '#fff'],
            },
          },
          nameTextStyle: {
            color: chartConfig.color || '#fff',
          },
        }
      : {}

    return series.slice(0, 2).map((it) => ({
      type: 'value',
      name: it ? `单位：${(rows.find((row) => row[y] === it.name) || {})[dw] || ''}` : '',
      ...targetConfig,
    }))
  }

  /**
   *转换Y轴 双y轴
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @param {object} chartConfig  图表配置项
   * @returns {array}
   */
  // eslint-disable-next-line
  getDoubleYAxisXC = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { y = [] } = config

    const dws = [...new Set(y.map((it) => it.unit))].filter(Boolean)

    const targetConfig = isPlainObject(chartConfig)
      ? {
          axisLabel: {
            color: chartConfig.color || '#fff',
          },
          axisLine: {
            lineStyle: {
              color: chartConfig.color || '#fff',
            },
          },
          splitLine: {
            lineStyle: {
              color: [chartConfig.color || '#fff'],
            },
          },
          nameTextStyle: {
            color: chartConfig.color || '#fff',
          },
        }
      : {}

    return dws.slice(0, 2).map((it) => ({
      type: 'value',
      name: it ? `单位：${it}` : '',
      ...targetConfig,
    }))
  }

  /**
   *转换series
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @returns {array}
   */
  getSeries = (rows = this.rows, config = this.config) => {
    const {
      x,
      y,
      dl,
      dw,
      componentType,
      x_zh = '',
      mode = {},
      modeStyle = [],
      count = 0,
      size = {},
      rowCount = 1,
      componentStyleConfig = {},
    } = config

    const indicators = [...new Set(rows.map((it) => it[y]))]

    const series = indicators.map((it) => {
      const itemData = rows.filter((row) => row[y] === it).map((it2) => it2[dl])
      return {
        type: COMPONENT_TYPE[componentType].type,
        name: it,
        data: itemData,
        smooth: componentType === 13,
        stack: componentStyleConfig.isStack ? '总量' : '',
        barMaxWidth: 22,
      }
    })

    switch (componentType) {
      case 1:
        //  指标图
        // 判断来自于卡片 ，专题 ，中屏
        if (Object.keys(componentStyleConfig).length > 0) {
          // 来自于卡片
          return rows.slice(0, componentStyleConfig.count).map((item, index) => ({
            num: item[dl],
            unit: item[dw],
            label: item[y],
            width: '100%',
            ...componentStyleConfig.modeStyle[index],
          }))
        }
        // 来自于中屏和专题
        return rows.slice(0, count).map((item, index) => ({
          num: item[mode.dl],
          unit: item[mode.dw],
          label: item[mode.y],
          width:
            Object.keys(size).length > 0 ? `${Math.ceil(size.width / rowCount) - 10}px` : '100%',
          ...modeStyle[index],
        }))
      case 5:
        // 饼图
        return [
          {
            name: x_zh,
            emphasis: {
              label: {
                show: false,
              },
            },
            type: 'pie',
            radius: '55%',
            center: ['28%', '50%'],
            data: rows.map((item) => ({
              value: item[dl],
              name: item[x],
              drilldown: item.drilldown,
            })),
          },
        ]
      case 6:
        // 环形饼图
        return [
          {
            name: x_zh,
            type: 'pie',
            radius: ['40%', '60%'],
            data: rows.map((item) => ({
              value: item[dl],
              name: item[x],
            })),
          },
        ]
      case 9:
        // 双轴折线图
        return series.slice(0, 2).map((r, i) => {
          if (i === 1) {
            return { ...r, yAxisIndex: 1 }
          }

          return r
        })
      case 10:
        // 折线柱状图
        return series.slice(0, 2).map((r, i) => {
          if (i === 1) {
            return { ...r, type: 'bar', yAxisIndex: 1 }
          }

          return r
        })
      case 22: {
        // 雷达图数据
        const indicator = [...new Set(rows.map((it) => it[y]))]
        const metrc = [...new Set(rows.map((it) => it[x]))]
        let dataArr = []
        const radarSeries = [
          {
            type: 'radar',
            data: metrc.map((c) => {
              const arr = rows.filter((row) => row[x] === c).map((it2) => it2[dl])
              dataArr = dataArr.concat(arr)

              return {
                name: c,
                value: arr,
              }
            }),
          },
        ]
        const maxNum = Math.max(...dataArr)
        const radar = {
          indicator: indicator
            .map((name) => ({ name }))
            .map((it, idx) => ({
              ...it,
              max: maxNum,
              axisLabel: {
                show: idx === 0,
              },
            })),
          radius: '65%',
          name: {
            show: true,
          },
        }

        return {
          radar,
          series: radarSeries,
          legend: {
            show: true,
            left: '6%',
            top: 'top',
          },
        }
      }
      default:
        return series.map((it) => ({ ...it, barMaxWidth: 22 }))
    }
  }

  /**
   * 许昌
   *转换series
   * @param {object} rows  数据集
   * @param {object} config  配置项
   * @returns {array}
   */
  getSeriesXC = (rows = this.rows, config = this.config) => {
    const {
      x = [],
      y = [],
      dl,
      dw,
      componentType,
      x_zh = '',
      mode = {},
      modeStyle = [],
      count = 0,
      size = {},
      rowCount = 1,
      componentStyleConfig = {},
      values,
      value,
    } = config

    const series = Array.isArray(y)
      ? y.map((it) => {
          const itemData = rows[it.field]
          return {
            type: COMPONENT_TYPE[componentType].type,
            name: it.name,
            data: itemData,
            smooth: componentType === 13,
            stack: componentStyleConfig.isStack ? '总量' : '',
            barMaxWidth: 22,
          }
        })
      : []

    const pieField = y.length ? y[0].field : ''
    const pieData = rows[pieField]

    switch (componentType) {
      case 1:
        //  指标图
        // 判断来自于卡片 ，专题 ，中屏
        if (Object.keys(componentStyleConfig).length > 0) {
          // 来自于卡片
          return rows.slice(0, componentStyleConfig.count).map((item, index) => ({
            num: item[dl],
            unit: item[dw],
            label: item[y],
            width: '100%',
            ...componentStyleConfig.modeStyle[index],
          }))
        }
        // 来自于中屏和专题
        return rows.slice(0, count).map((item, index) => ({
          num: item[mode.dl],
          unit: item[mode.dw],
          label: item[mode.y],
          width:
            Object.keys(size).length > 0 ? `${Math.ceil(size.width / rowCount) - 10}px` : '100%',
          ...modeStyle[index],
        }))
      case 5:
        // 饼图

        return [
          {
            name: x_zh,
            emphasis: {
              label: {
                show: false,
              },
            },
            type: 'pie',
            radius: '55%',
            center: ['28%', '50%'],
            data: rows[x]?.map((item, index) => ({
              value: pieData[index],
              name: item,
            })),
          },
        ]
      case 6:
        // 环形饼图
        return [
          {
            name: x_zh,
            radius: ['40%', '60%'],
            type: 'pie',
            data: rows[x]?.map((item, index) => ({
              value: pieData[index],
              name: item,
            })),
          },
        ]
      case 9:
        // 双轴折线图
        return series.map((r, i) => {
          if (i === 1) {
            return { ...r, yAxisIndex: 1 }
          }

          return r
        })
      case 10:
        // 折线柱状图
        return series.map((r, i) => {
          if (i === 0) {
            return { ...r, type: 'bar' }
          }
          if (i === 1) {
            return { ...r, type: 'line', yAxisIndex: 1 }
          }

          return r
        })
      case 22: {
        // 雷达图数据 todo
        const indicator = rows[y]
        const metrc = x
        const dataArr = (rows[value] || rows[values]).map((it) => +it) // 统一字段为value 兼容以前values 字段
        const radarSeries = [
          {
            type: 'radar',
            data: [
              {
                name: metrc,
                value: dataArr,
              },
            ],
          },
        ]
        const radar = {
          indicator: indicator.map((name) => ({ name })),
          radius: '65%',
          name: {
            show: true,
          },
        }
        return {
          radar,
          series: radarSeries,
          legend: {
            show: true,
            left: '6%',
            top: 'top',
          },
        }
      }
      default:
        return series.map((it) => ({ ...it, barMaxWidth: 22 }))
    }
  }

  /**
   *转换列表下钻数据
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @returns {array} [{title:'',list:[value:'',label:'']}]
   */
  getList = (rows = this.rows, config = this.config) => {
    const { x, tag, text, y, dl } = config

    // const y = from === 'form' ? y : fields[0].field
    // const dl = from === 'form' ? dl : fields[0].value

    const titles = [...new Set(rows.map((it) => it[x]))]

    const list = titles.map((it) => {
      const temp = rows.filter((row) => row[x] === it)

      const arr = temp.map((row2) => ({
        value: row2[dl],
        label: row2[y],
      }))

      const tags = temp.map((row3) => row3[tag]).filter(Boolean)

      return {
        title: it,
        text,
        list: arr,
        tags: tag ? [...new Set(tags)] : [],
        group: temp.length > 0 ? temp[0].group : '',
      }
    })

    return list
  }

  getXiazuanFromform = (rows = this.rows, config = this.config) => {
    const { tag, text, y, dl } = config

    const titles = [...new Set(rows.filter((it) => it.group).map((it) => it.group))]

    const list = titles.map((it) => {
      const temp = rows.filter((row) => row.group === it)

      const arr = temp.map((row2) => ({
        value: row2[dl],
        label: row2[y],
      }))

      const tags = temp.map((row2) => row2[tag])

      return {
        title: it,
        text,
        list: arr,
        tags: tag ? [...new Set(tags)] : [],
        group: temp.length > 0 ? temp[0].group : '',
      }
    })

    return list
  }

  /**
   *转换表格
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @returns {array} {columns:[],list:[]}
   */
  getTable = (rows = this.rows, config = this.config) => {
    const { x, y, dl, x_zh } = config

    const indicators = [...new Set(rows.map((it) => it[y]))] // 指标

    const metricData = [...new Set(rows.map((it) => it[x]))] // 维度颗粒度

    const columns = [{ title: x_zh, dataIndex: x_zh }].concat(
      indicators.map((item) => ({ title: item, dataIndex: item }))
    )

    const list = metricData.map((metric, index) => {
      const attach =
        rows
          .filter((it) => it[x] === metric)
          .map((it) => it.attach)
          .filter(Boolean)[0] || {}

      const temp = {
        [x_zh]: metric,
        id: index,
        attach,
      }

      indicators.forEach((it) => {
        temp[it] = (rows.find((row) => row[y] === it && row[x] === metric) || {})[dl]
      })

      return temp
    })

    return {
      columns,
      list,
    }
  }

  /**
   *转换静态图数据
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @returns {object} {}
   */
  getStaticImg = (rows = this.rows, config = this.config) => {
    const { indicatorPicture, picture, ...rest } = config

    const imgs = [...new Set(rows.map((it) => it[indicatorPicture]))].filter(Boolean)

    return {
      ...rest,
      src: imgs[0] ? imgs[0] : picture,
    }
  }

  /**
   *获取进度条
   * @param {array} rows  数据集
   * @param {object} config  配置项
   * @returns {object}
   */
  getProgress = (rows = this.rows, config = this.config) => {
    const { x, y, dl } = config
    const cenetrEnum = {
      0: ['25%', '50%'],
      1: ['75%', '50%'],
    }
    return {
      legend: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      series: rows.map((it, inx) => ({
        name: it[x],
        type: 'pie',
        center: cenetrEnum[inx],
        data: [
          { value: it[dl], name: it[y] },
          {
            value: 100 - it[dl],
            name: '',
            itemStyle: {
              emphasis: {
                color: '#e6e9f0',
              },
              normal: {
                color: '#e6e9f0',
              },
            },
          },
        ],
      })),
    }
  }

  /**
   *获取自定义组件数据
   * @param {array} rows  [this.rows] 数据集
   * @param {object} config  [this.config] 配置项
   * * @param {object} chartConfig  [this.chartConfig] 图表配置项
   * @returns {object|array}
   */
  getCustomData = (rows = this.rows, config = this.config) => {
    const { x, y, dl, dw, moduleConfig = {} } = config
    const { isChart, componentType, props, needTransform } = moduleConfig

    const formConfig = Object.entries(props || {}).map(([key, value]) => ({
      key,
      ...value,
    }))

    const formData = {}

    formConfig.forEach((it) => {
      const value = [...new Set(rows.map((row) => row[config[it.key]]))].filter(Boolean)
      formData[it.key] = it.type === 'string' ? value.join() : value
    })

    if (!needTransform) {
      return {
        options: rows,
        ...formData,
      }
    }

    return isChart
      ? {
          options: this.getOption(rows, {
            x,
            y,
            dl,
            dw,
            componentType,
          }),
          ...formData,
        }
      : formData
  }

  /**
   *
   * @param {array} x
   * @param {array} y
   * @param {array} values
   * @returns
   */
  formatXcData = (x = [], y = [], values = [], unit = '%') => {
    const uniqueX = [...new Set(x)]
    const uniqueY = [...new Set(y)]
    const result = {
      x: uniqueX,
      yArr: [],
    }

    const combineArr = x.map((item, index) => ({
      label: `${item}${y[index]}`,
      value: values[index],
    }))

    uniqueX.forEach((it) => {
      uniqueY.forEach((it2, index2) => {
        const key = it + it2
        const valueArr = combineArr.filter((c) => c.label === key).map((c) => c.value)
        const summary = summate(valueArr)
        result[it2] = [...(result[it2] || []), summary]
        result[`y${index2 + 1}`] = [...(result[`y${index2 + 1}`] || []), summary]
        if (!result.yArr.find((c) => c.name === it2)) {
          result.yArr = [...result.yArr, { field: it2, name: it2, unit }]
        }
      })
    })

    console.log('许昌处理后数据:', result)

    return result
  }

  /**
   * @param {array} x
   * @param {array} values
   * @returns
   */
  formatXcData2 = (x = [], values = []) => {
    const uniqueX = [...new Set(x)]
    const result = {
      x: uniqueX,
    }
    const combineArr = x.map((item, index) => ({
      label: item,
      value: values[index],
    }))

    uniqueX.forEach((it) => {
      const valueArr = combineArr.filter((c) => c.label === it).map((c) => c.value)
      const summary = summate(valueArr)
      result.y = [...(result.y || []), summary]
    })

    console.log('许昌处理后数据:', result)

    return result
  }

  /**
   * @param {array} rows
   * @param {string} x
   * @param {string} y
   * @param {string} value
   * @returns
   */
  formatZsData = (rows = [], x = '', y = '', value = '', unit) => {
    const xData = rows.map((it) => it[x])
    const yData = rows.map((it) => it[y])
    const uniqueX = [...new Set(xData)]
    const uniqueY = [...new Set(yData)]
    const result = {
      x: uniqueX,
      yArr: [],
    }

    const combineArr = xData.map((item, index) => {
      const label = `${item}${yData[index]}`
      return {
        label,
        value: (rows.find((row) => `${row[x]}${row[y]}` === label) || {})[value],
      }
    })

    uniqueX.forEach((it) => {
      uniqueY.forEach((it2, index2) => {
        const key = it + it2

        const summary = combineArr.find((c) => c.label === key)?.value

        result[it2] = [...(result[it2] || []), summary]
        result[`y${index2 + 1}`] = [...(result[`y${index2 + 1}`] || []), summary]
        if (!result.yArr.find((c) => c.name === it2)) {
          result.yArr = [...result.yArr, { field: it2, name: it2, unit }]
        }
      })
    })

    console.log('中山处理后数据:', result)

    return result
  }

  /**
   *获取完成的echarts option | 表格 | 列表下钻
   * @param {array} rows  [this.rows] 数据集
   * @param {object} config  [this.config] 配置项
   * * @param {object} chartConfig  [this.chartConfig] 图表配置项
   * @returns {object|array}
   */
  getOption = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { componentType, componentStyleConfig = {} } = config

    switch (componentType) {
      case 1: // 指标图
        return this.getSeries(rows, config)

      case 2: // 折线图
      case 3: // 区域图
      case 4: // 基本柱状图
      case 13: // 曲线图
        return {
          // legend: {
          //   show: this.getSeries(rows, config).length > 1 ? true : false,
          // },
          grid: {
            top: 50,
          },
          xAxis: this.getXAxis(rows, config, chartConfig),
          yAxis: this.getYAxis(rows, config, chartConfig),
          series: this.getSeries(rows, config),
        }

      case 5: //
      case 6: // 环形饼图
        return {
          legend: {
            right: '2%',
          },
          series: this.getSeries(rows, config),
        }

      case 7: // 表格
        return this.getTable(rows, config)

      case 8: // 水平柱状图
      case 16: // 条形图
        return {
          // legend: {
          //   show: this.getSeries(rows, config).length > 1 ? true : false,
          // },
          grid: {
            top: 50,
          },
          xAxis: {
            ...this.getYAxis(rows, config, chartConfig),
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: '#5C626B',
            },
            show: false,
          },
          yAxis: {
            ...this.getXAxis(rows, config, chartConfig),
            splitLine: {
              show: false,
            },
          },
          series: this.getSeries(rows, config).map((item) => ({
            ...item,
            barMaxWidth: 22,
            label: {
              show: true,
              position: 'insideLeft',
              color: '#fff',
              textStyle: {
                color: '#fff',
              },
            },
            itemStyle: componentStyleConfig.isStack
              ? {}
              : {
                  emphasis: {
                    barBorderRadius: 9,
                  },
                  normal: {
                    barBorderRadius: 9,
                  },
                },
          })),
        }

      case 9: // 双轴折线图
        return {
          // legend: {
          //   show: this.getSeries(rows, config).length > 1 ? true : false,
          // },
          grid: {
            top: 50,
          },
          xAxis: this.getXAxis(rows, config, chartConfig),
          yAxis: this.getDoubleYAxis(rows, config, chartConfig),
          series: this.getSeries(rows, config),
        }

      case 10: // 折线柱状图
        return {
          // legend: {
          //   show: this.getSeries(rows, config).length > 1 ? true : false,
          // },
          grid: {
            top: 50,
          },
          xAxis: this.getXAxis(rows, config, chartConfig),
          yAxis: this.getDoubleYAxis(rows, config, chartConfig),
          series: this.getSeries(rows, config),
        }

      case 11: // 列表下钻
        return this.getList(rows, config)
      case 14: // 静态图
        return this.getStaticImg(rows, config)
      case 18:
        return this.getCustomData(rows, config)

      case 22: // 雷达图
        return this.getSeries(rows, config)

      default:
        return rows
    }
  }

  /**
   * 许昌 行业归因分析
   * @param {object} rows  [this.rows] 数据集
   * @returns {array}
   */
  formatXCTreeData = (rows) => {
    const { cymc = [], hymc = [], cyzjzzs = [] } = rows
    const zsArr = [...new Set(cyzjzzs)]

    const cyArr = [...new Set(cymc)].map((it, index) => ({
      label: it,
      speed: `${zsArr[index]}%`,
      children: [],
    }))
    const combineArr = cymc.map((it, index) => ({
      cymc: it,
      hymc: hymc[index],
      zs: cyzjzzs[index],
    }))

    cyArr.forEach((it) => {
      const { label } = it
      const temp = combineArr.filter((c) => c.cymc === label).map((c) => ({ label: c.hymc }))
      it.children = temp
    })

    return [
      {
        label: 'GDP',
        children: cyArr,
      },
    ]
  }

  /**
   * 许昌
   *获取完成的 echarts option | 表格 | 列表下钻
   * @param {object | array| } rows  [this.rows] 数据集
   * @param {object} config  [this.config] 配置项
   * * @param {object} chartConfig  [this.chartConfig] 图表配置项
   * @returns {object|array}
   */
  getOptionXuchang = (rows = this.rows, config = this.config, chartConfig = this.chartConfig) => {
    const { componentType, x, y, values, unit, value, isFormat = false } = config

    if (isFormat) {
      rows = formatData(rows)
    }

    switch (componentType) {
      // case 1: // 指标图
      //   return this.getSeries(rows, config)

      case 2: // 折线图
      case 3: // 区域图
      case 4: // 基本柱状图
      case 13: // 曲线图
        if (typeof y === 'string') {
          let dealedData = {}
          dealedData = Array.isArray(rows)
            ? this.formatZsData(rows, x, y, value, unit)
            : this.formatXcData(rows[x], rows[y], rows[value] || rows[values], unit) // rows[value] || rows[values] 统一字段为value 兼容以前values字段
          return {
            grid: {
              top: 50,
            },
            xAxis: this.getXAxisXC(
              dealedData,
              { ...config, x: 'x', y: dealedData.yArr },
              chartConfig
            ),
            yAxis: this.getYAxisXC(
              dealedData,
              { ...config, x: 'x', y: dealedData.yArr },
              chartConfig
            ),
            series: this.getSeriesXC(dealedData, { ...config, x: 'x', y: dealedData.yArr }),
          }
        }
        return {
          grid: {
            top: 50,
          },
          xAxis: this.getXAxisXC(rows, config, chartConfig),
          yAxis: this.getYAxisXC(rows, config, chartConfig),
          series: this.getSeriesXC(rows, config),
        }

      case 5: //
      case 6: // 环形饼图
        return {
          legend: {
            right: '2%',
          },
          series: this.getSeriesXC(rows, config),
        }

      case 8:
        if (typeof y === 'string') {
          let dealedData = {}
          dealedData = Array.isArray(rows)
            ? this.formatZsData(rows, x, y, value, unit)
            : this.formatXcData(rows[x], rows[y], rows[value] || rows[values], unit)
          return {
            grid: {
              top: 50,
            },
            yAxis: this.getXAxisXC(
              dealedData,
              { ...config, x: 'x', y: dealedData.yArr },
              chartConfig
            ),
            xAxis: this.getYAxisXC(
              dealedData,
              { ...config, x: 'x', y: dealedData.yArr },
              chartConfig
            ),
            series: this.getSeriesXC(dealedData, { ...config, x: 'x', y: dealedData.yArr }),
          }
        }
        return {
          grid: {
            top: 50,
          },
          yAxis: this.getXAxisXC(rows, config, chartConfig),
          xAxis: this.getYAxisXC(rows, config, chartConfig),
          series: this.getSeriesXC(rows, config),
        }

      case 9: // 双轴折线图
      case 10: // 折线柱状图
        if (typeof y === 'string') {
          let dealedData = {}
          dealedData = Array.isArray(rows)
            ? this.formatZsData(rows, x, y, value, unit)
            : this.formatXcData(rows[x], rows[y], rows[value] || rows[values], unit)
          return {
            grid: {
              top: 50,
            },
            xAxis: this.getXAxisXC(
              dealedData,
              { ...config, x: 'x', y: dealedData.yArr },
              chartConfig
            ),
            yAxis: this.getDoubleYAxisXC(
              dealedData,
              { ...config, x: 'x', y: dealedData.yArr },
              chartConfig
            ),
            series: this.getSeriesXC(dealedData, { ...config, x: 'x', y: dealedData.yArr }),
          }
        }

        return {
          grid: {
            top: 50,
          },
          xAxis: this.getXAxisXC(rows, config, chartConfig),
          yAxis: this.getDoubleYAxisXC(rows, config, chartConfig),
          series: this.getSeriesXC(rows, config),
        }

      case 22: // 雷达图
        return this.getSeriesXC(rows, config)
      default:
        return rows
    }
  }

  /**
   * 数据魔方数据处理
   * @param {array} rows
   * @param {object} config
   */
  getOptionCube = (rows = [], config = {}) => {
    const dm = rows[0] || {}
    const keys = Object.keys(dm)
    const {
      measureMap = {},
      componentType,
      unit,
      x_zh,
      size = {},
      modeStyle = [],
      rowCount = 4,
    } = config
    const dimensionKeys = keys.filter((it) => it.startsWith('dimension_'))
    const measureKeys = keys.filter((it) => it.startsWith('measure_'))

    let dimensionData = []
    let measureData = []

    if (dimensionKeys.length === 1) {
      // 维度为1
      dimensionData = rows.map((it) => it.dimension_0)
      measureData = measureKeys.map((it) => {
        const data = rows.map((it2) => it2[it])
        return {
          name: measureMap[it]?.title,
          data,
        }
      })
    } else if (dimensionKeys.length === 2) {
      dimensionData = rows.map((it) => it.dimension_1)
    }

    switch (componentType) {
      case 1:
        // 指标图
        return measureData.map((it, index) => ({
          label: it.name,
          num: it?.data[0],
          width:
            Object.keys(size).length > 0 ? `${Math.ceil(size.width / rowCount) - 10}px` : '100%',
          ...modeStyle[index],
        }))

      case 2: // 折线图
      case 3: // 区域图
      case 4: // 基本柱状图
      case 13: // 曲线图
        return {
          xAxis: {
            type: 'category',
            data: dimensionData,
          },
          yAxis: {
            type: 'value',
            name: unit ? `单位：${unit}` : '',
          },
          series: measureData,
        }

      case 5: // 基本饼图
        return {
          series: [
            {
              name: x_zh,
              emphasis: {
                label: {
                  show: false,
                },
              },
              radius: '55%',
              center: ['28%', '50%'],
              data: measureData.map((it) => ({ name: it.name, value: it?.data[0] })),
            },
          ],
        }

      case 6:
        // 环形饼图
        return {
          series: [
            {
              name: x_zh,
              radius: ['40%', '60%'],
              data: measureData.map((it) => ({ name: it.name, value: it?.data[0] })),
            },
          ],
        }

      case 10: // 双轴图
        return {
          xAxis: {
            type: 'category',
            data: dimensionData,
          },
          yAxis: [
            {
              type: 'value',
              name: unit ? `单位：${unit}` : '',
            },
            {
              type: 'value',
              name: unit ? `单位：${unit}` : '',
            },
          ],
          series: measureData
            .slice(0, 2)
            .map((it, index) => ({ ...it, type: index === 0 ? 'bar' : 'line' })),
        }

      case 8: // 水平柱状图
      case 16: // 条形图
        return {
          grid: {
            top: 50,
          },
          xAxis: {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: '#5C626B',
            },
            show: false,
          },
          yAxis: {
            type: 'category',
            splitLine: {
              show: false,
            },
            data: dimensionData,
          },
          series: measureData.map((item) => ({
            ...item,
            barMaxWidth: 22,
            label: {
              show: true,
              position: 'insideLeft',
              color: '#fff',
              textStyle: {
                color: '#fff',
              },
            },
          })),
        }

      default:
        return rows
    }
  }
}
