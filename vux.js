let p = Promise.resolve()
  .then(() => {
    throw new Error('1')
  })
  .then(resp => {
    console.log('2')
    console.log(resp)
  })
  .catch(e => {
    console.log('3')
  })

console.log()
