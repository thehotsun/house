// 实现简易模板

function temp (id, str) {
  var arr = []
  str = 'arr.push(' + str.replace(/[<%]]/g, ')').replace(/$[>%]/, function(_) {return _ ? '' : ')'}).replace(/<%=(.*)%>/g, function($1) {return ');arr.push($1);arr.push('})
  eval(str)
  ducument.getElementById(id).innerHtml = arr.join()
  console.log(arr);
  // var string = "var p = []; p.push('" +
  //     str
  //     .replace(/[\r\t\n]/g, "")
  //     .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
  //     .replace(/<%/g, "');")
  //     .replace(/%>/g,"p.push('")
  //     + "');"
}
