// 实现简易promise

class Promise {
  constructor(fn) {
    this.status = 'pending'
    this.data = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    try {
      fn(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  resolve(data) {
    // console.log(this, 1)
    this.status = 'resolve'
    this.data = data
    this.onFulfilledCallbacks.map(fn => {
      fn(this.data)
    })
  }

  reject(data) {
    this.status = 'reject'
    this.data = data
    this.onRejectedCallbacks.map(fn => {
      fn(this.data)
    })
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (x instanceof Promise) {
      if (x.status === 'pending') {
        x.then(y => {
          return resolvePromise(x, y, resolve, reject)
        })
      } else {
        return x.then(resolve, reject)
      }
      // return x.then(resolve, reject)
    } else if ((typeof x === 'function' || typeof x === 'object') && x) {
      let then = x.then
      if (typeof then === 'function') {
        x.then(
          y => {
            return resolvePromise(x, y, resolve, reject)
          },
          reason => {
            reject(reason)
          }
        )
      }
    } else {
      resolve(x)
    }
  }

  then(onFulfill, onReject) {
    let that = this
    let newPromise
    if (that.status === 'pending') {
      return (newPromise = new Promise((resolve, reject) => {
        that.onFulfilledCallbacks.push(data => {
          let x = onFulfill(that.data)
          return that.resolvePromise(newPromise, x, resolve, reject)
        })
        that.onRejectedCallbacks.push(data => {
          let x = onReject(that.data)
          return that.resolvePromise(newPromise, x, resolve, reject)
        })
      }))
    } else if (that.status === 'resolve') {
      return (newPromise = new Promise((resolve, reject) => {
        let x = onFulfill(that.data)
        return that.resolvePromise(newPromise, x, resolve, reject)
      }))
    } else if (that.status === 'reject') {
      return (newPromise = new Promise((resolve, reject) => {
        let x = onReject(that.data)
        return that.resolvePromise(newPromise, x, resolve, reject)
      }))
    } else {
      onReject(that.data)
    }
  }
}
