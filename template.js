// 实现简易模板

<script type="text/html" id="ww">
   <%for ( var i = 0; i < users.length; i++ ) { %>
      <li>
          <a href='<%=users[i].url%>'>
              <%=users[i].name%>
          </a>
      </li>
  <%}%>
</script>


var str = document.getElementById('ww').innerHTML
function temp (id) {
  var data = [{url: 'https://www.baidu.com', name : 'xz'}, {url: 'https://www.baidu.com', name : 'xz'}, {url:'https://www.baidu.com', name : 'xz'}]
  str = 'var arr= []; arr.push("' + str.replace(/<%=(.*?)%>/gm, function(_, $1) {return '");arr.push(' + $1 + ');' + 'arr.push("'}).replace(/(%>$)/g, '').replace(/<%/gm, '");').replace(/%>/g, 'arr.push("').replace(/[\r\t\n]/g, '') + '");return arr.join("")'
  var fn = new  Function('users', str)
  // Function 这种情形定义的函数，上下文只在全局作用域中定义，也就是只能读取自身作用域以及全局作用域的函数
  document.getElementById(id).innerHTML = fn(data)
}
