// 实现简易模板
var str = document.getElementById('id').innerHTML
var arr = []
function temp (id) {
  str = 'arr.push("' + str.replace(/<%=(.*)%>/gm, function(_, $1) {return '");arr.push(' + $1 + ');' + 'arr.push("'}).replace(/(%>$)/g, '').replace(/<%/gm, '");').replace(/%>/g, 'arr.push("').replace(/[\r\t\n]/g, '') + '")'
  var fn = new  Function(str)
  fn()
  // Function 这种情形定义的函数，上下文只在全局作用域中定义，也就是只能读取自身作用域以及全局作用域的函数
  document.getElementById(id).innerHTML = arr.join('')
}
