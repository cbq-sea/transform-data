export function isPlainObject(obj) {
  return obj !== null && Object.prototype.toString.call(obj) === '[object Object]'
}

export function summate(data) {
  return data.reduce((t, c) => {
    if (Object.is(+c, NaN)) {
      // 去除非数字的情况
      return t
    }
    return t + c * 1
  }, 0)
}

// eslint-disable-next-line
function uniqueData(arr) {
  const map = new Map()
  arr.forEach((item, index) => {
    if (!map.has(item)) {
      map.set(item, { indexArr: [], name: item })
    }
    map.get(item).indexArr.push(index)
  })

  return [...map.values()]
}

export function formatXcData(x = [], y = [], values = []) {
  const uniqueX = [...new Set(x)]
  const uniqueY = [...new Set(y)]
  const temp = {
    x: uniqueX,
  }
  const combineArr = x.map((item, index) => {
    return {
      label: `${item}${y[index]}`,
      value: values[index],
    }
  })

  uniqueX.forEach((it) => {
    uniqueY.forEach((it2, index2) => {
      const key = it + it2
      const valueArr = combineArr.filter((c) => c.label === key).map((c) => c.value)
      const summary = summate(valueArr)
      temp[it2] = [...(temp[it2] || []), summary]
      temp[`y${index2 + 1}`] = [...(temp[`y${index2 + 1}`] || []), summary]
    })
  })

  console.log('许昌处理后数据:', temp)

  return temp
}

export function formatData(arr) {
  const data = {}
  arr.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (data[key]) {
        data[key].push(value)
      } else {
        data[key] = [value]
      }
    })
  })

  console.log('格式化数据:', data)
  return data
}

