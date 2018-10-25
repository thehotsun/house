/*判断数据类型*/

function typeOf(obj) {
  let toString = Object.prototype.toString
  return toString.call(obj).slice(8, -1)
}

/*

快速排序
arr type：Array

*/

function quickSort(arr) {
  for (var i = 1; i < arr.length; i++) {
    var target = arr[i]
    var index = undefined
    for (var j = i - 1; j >= 0; j--) {
      if (target < arr[j]) index = j
      else break
    }
    if (index != undefined) {
      arr.splice(index, 0, arr[i])
      arr.splice(i + 1, 1)
    }
  }
  return arr
}

/*

数组扁平化
将所有的嵌套数组（只能是数组）都扁平到一个数组中
arr type：Array

 */

/*
此方法是将reduce当做map使用
function flatten (arr) {
  let array = []
  arr.reduce((prev, next) => {
    array = array.concat(typeOf(next) === 'Array' ? flatten(next) : next)
  }, [])
  return array
}*/

function flatten(arr) {
  while (
    arr.some(item => {
      return typeOf(item) === 'Array'
    })
  ) {
    arr = [].concat(...arr)
  }
  return arr
}

/*

寻找obj在arr中应有的下标

arr type：Array
obj type：number

sortedIndex([1,3,4,6,7], 5) 返回的值为5在arr中应该占有的下标位置即3

 */

function sortedIndex(arr, obj) {
  var low = 0,
    high = arr.length
  while (high - 1 !== low) {
    let mid = Math.floor((high + low) / 2)
    if (obj > arr[mid]) low = mid
    else high = mid
  }
  return high
}

/*

深拷贝
obj type: Object

 */

function shen(obj) {
  let newObj = isAarray(obj) ? [] : {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      newObj[i] = typeof obj[i] == 'object' ? shen(obj[i]) : obj[i]
    }
  }
  return newObj
}

/*
  
  接收一个日期参数， 返回当前日期的上一天或者下一天 
  @param  date  type：string  格式为 yyyymmdd 
          next  type：boolean 为true则为下一天， false则为上一天 默认为true
          skip  type：boolean 为true则跳过周六周日， false则不跳过周日周六上一天 默认为true
  return date  type：string  格式为 yyyymmdd 

 */

function getDate(date, next = true, skip = true) {
  let diff = next ? 1 : -1
  var sj = new Date(
    date.slice(0, 4),
    date.slice(4, 6) - 1,
    date.slice(6) - diff
  )
  if (skip) {
    let day = sj.getDay()
    if (day === 0 && skip)
      sj = new Date(
        date.slice(0, 4),
        date.slice(4, 6) - 1,
        date.slice(6) - diff - 2
      )
    else if (day === 0 && !skip)
      sj = new Date(
        date.slice(0, 4),
        date.slice(4, 6) - 1,
        date.slice(6) - diff + 1
      )
    else if (day === 6 && skip)
      sj = new Date(
        date.slice(0, 4),
        date.slice(4, 6) - 1,
        date.slice(6) - diff - 1
      )
    else if (day === 6 && !skip)
      sj = new Date(
        date.slice(0, 4),
        date.slice(4, 6) - 1,
        date.slice(6) - diff + 2
      )
  }
  let year = sj.getFullYear()
  let month =
    sj.getMonth() + 1 < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1
  let today = sj.getDate() < 10 ? '0' + sj.getDate() : sj.getDate()
  return year + month + today
}

/**
 * 获取查询参数
 * @return {Object}
 * @example
 * http://www.gtja.net?stockCode=123456&stockName=股票名
 * =》 {
 *       stockCode: '123456',
 *       stockName: '股票名'
 *     }
 */
function getRequests() {
  var url = location.href
  var theRequest = {}
  if (url.indexOf('?') !== -1) {
    let str = url.substr(url.indexOf('?') + 1)
    if (str.indexOf('&') !== -1) {
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
    } else {
      theRequest[str.split('=')[0]] = str.split('=')[1]
    }
  }
  return theRequest
}

/**
 * 传入据今天未知的天数，获取其中周一到周五的天数
 * @params {number}
 * @return number
 */

function getWorkDay(diff) {
  let date = new Date()
  let day = date.getDay()
  let remainder = (diff - day) % 7
  let work = ((diff - day - remainder) / 7) * 5
  switch (remainder) {
    case 1:
    case 2:
      break
    default:
      work += remainder - 2
      break
  }
  switch (day) {
    case 6:
    case 0:
      work += 5
      break
    default:
      work += day
      break
  }
  return work
}

/**
 * 传入据今天未知的天数，获取其中周一到周五的天数
 * @params {Array}
 * [[], []]
 *    分别代表开始时间（此时间是较大的那一个）和结束时间
 *      其中又分别传入年、月、日
 * @return number
 */

function getDiff(...params) {
  let start = params[0]
  let end = params[1]
  let diff = +new Date(start.join('-')) - +new Date(end.join('-'))
  return (diff / 1000 / 60 / 60 / 24).toFixed()
}

export {
  typeOf,
  quickSort,
  flatten,
  sortedIndex,
  shen,
  getDate,
  get,
  getRequests,
  getWorkDay,
  getDiff
}
