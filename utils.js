
/*判断数据类型*/

function typeOf (obj) {
  let toString = Object.prototype.toString
  return toString.call(obj).slice(8, -1)
}

/*

快速排序
arr type：Array

*/

function quickSort (arr) {
  for (var i = 1; i < arr.length; i++) {
    var target = arr[i]
    var index = undefined
    for (var j = i - 1; j >= 0; j--) {
        if (target < arr[j]) index = j
        else break
    }
    if (index != undefined)  {
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

function flatten (arr) {
  while (arr.some(item => {return typeOf(item) === 'Array'})) {
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
    var low = 0, high = arr.length;
    while (high - 1 !== low) {
      let mid = Math.floor((high + low) / 2)
      if (obj > arr[mid]) low = mid
      else high = mid
    }
    return high;
};

/*

深拷贝
obj type: Object

 */

function shen (obj) {
  let newObj = isAarray(obj) ? [] : {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      newObj[i] = (typeof obj[i] == 'object') ? shen(obj[i]) : obj[i]
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
  var sj = new Date(date.slice(0, 4), date.slice(4, 6) - 1, date.slice(6) - diff)
  if (skip) {
    let day = sj.getDay()
    if (day === 0 && skip) sj = new Date(date.slice(0, 4), date.slice(4, 6) - 1, date.slice(6)- diff - 2)
    else if (day === 0 && !skip) sj = new Date(date.slice(0, 4), date.slice(4, 6) - 1, date.slice(6)- diff + 1)
    else if (day === 6 && skip) sj = new Date(date.slice(0, 4), date.slice(4, 6) - 1, date.slice(6)- diff - 1)
    else if (day === 6 && !skip) sj = new Date(date.slice(0, 4), date.slice(4, 6) - 1, date.slice(6)- diff + 2)
  }
  let year = sj.getFullYear()
  let month = sj.getMonth() + 1 < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1
  let today = sj.getDate() < 10 ? '0' + sj.getDate() : sj.getDate()
  return year + month + today
}

/**
 * 此函数接受一个开始时间，一个结束时间，以小时为基准，可接受小数，来判断当前日期是否在传入的时间区间内,且当前日期不能为周末
 * @param start 开始时间, type: number
 *        end 结束时间, type: number
 * return true 或者 false
 */

function getNowDate(start = 9, end = 16) { // 接受两个参数，一个为开始时间，一个为结束时间，且都以小时为基准，可以传入小数
  let date = new Date()
  let detailDate = date.toString().slice(16, 21)
  let regex = /:(\d+)/
      detailDate = detailDate.replace(regex, (a, b) => {
    return ('.' + (b / 60).toString().replace(/0./, ''))
  })
  if (detailDate >= start && detailDate <= end && date.getDay() !== 0 && date.getDay() !== 6) {
    return true
  } else {
    return false
  }
}

export {
  typeOf,
  quickSort,
  flatten,
  sortedIndex,
  shen,
  getDate,
  get
}