// 学习各种设计模式

// 单例模式
// 我认为单利模式的实质就在于使用闭包来存储这个’单例‘，如果存在，则返回此单例，如果不存在，则创建并对闭包中存贮的变量赋值


function singleleson (fn) {
	var single = null
	return function Createsample(age, name) {
		if (this instanceof Createsample) {
			if (single) return single
			return single = new fn(age, name)
		}
	}
}

