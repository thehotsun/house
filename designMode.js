// 学习各种设计模式

// 单例模式
// 我认为单利模式的实质就在于使用闭包来存储这个’单例‘，如果存在，则返回此单例，如果不存在，则创建并对闭包中存贮的变量赋值


function Createsample (fn) {
	var single = null
	return function () {
		if (this instanceof Createsample) {
			if (single) return single
			return single = new fn(arguments)
		}
	}
}


// 保证参数fn只执行一次
function singleleson (fn) {
	let instance = null
	return function () {
		if (instance) return
		let argu = Array.from(arguments)
		instance = true
		fn.apply(this, argu)
	}
}
