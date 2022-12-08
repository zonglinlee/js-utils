import typeCheck from '../src/common/typeCheck'

test('typeCheck:', async () => {
    const symbol = Symbol('test')
    expect(typeCheck.checkType('Null', null)).toBe(true)
    expect(typeCheck.checkType('Undefined', undefined)).toBe(true)
    expect(typeCheck.checkType('String', 'hello')).toBe(true)
    expect(typeCheck.checkType('Number', 55)).toBe(true)
    expect(typeCheck.checkType('Boolean', true)).toBe(true)
    expect(typeCheck.checkType('Object', {})).toBe(true)
    expect(typeCheck.checkType('Array', [1, 2])).toBe(true)
    expect(typeCheck.checkType('Date', new Date())).toBe(true)
    expect(
        typeCheck.checkType('Function', () => {
            console.log(111)
        })
    ).toBe(true)
    expect(typeCheck.checkType('Function', setTimeout)).toBe(true)
    expect(typeCheck.checkType('RegExp', /\d+/g)).toBe(true)
    expect(typeCheck.checkType('Symbol', symbol)).toBe(true)
    // promise 检测
    const promise = new Promise((resolve) => {
        resolve(1)
    })
    const promiseLike = Promise.resolve(99)
    expect(typeCheck.isPromise(promise)).toBe(true)
    expect(typeCheck.isPromise(promiseLike)).toBe(true)
    // plain obj
    expect(typeCheck.isPlainObj({})).toBe(true)
    expect(typeCheck.isPlainObj(Object.create(null))).toBe(true)
    expect(typeCheck.isPlainObj(Object.create({}))).toBe(false)
    expect(typeCheck.isPlainObj([])).toBe(false)
    // 类数组判断
    const arrayLike = { '0': 0, '1': 1, length: 2 }
    expect(typeCheck.isLikeArray(arrayLike)).toBe(true)
})
