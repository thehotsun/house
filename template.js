// 实现简易模板
function temp (id, str) {
  var arr = []
  str = 'arr.push("' + str.replace(/<%=(.*)%>/gm, function(_, $1) {return '");arr.push(' + $1 + ');' + 'arr.push("'}).replace(/(%>$)/g, '').replace(/<%/gm, '");').replace(/%>/g, 'arr.push("').replace(/[\r\t\n]/g, '') + '")'
  console.log(str);
  eval(str)
  console.log(arr);
  document.getElementById(id).innerHTML = arr.join('')
}
