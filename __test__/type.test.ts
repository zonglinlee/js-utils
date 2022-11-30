import typeCheck from '../src/basic/type'

test('typeCheck:', () => {
    let symbol = Symbol('test')
    expect(typeCheck.typeCheck('Null', null)).toBe(true)
    expect(typeCheck.typeCheck('Undefined', undefined)).toBe(true)
    expect(typeCheck.typeCheck('String', 'hello')).toBe(true)
    expect(typeCheck.typeCheck('Number', 55)).toBe(true)
    expect(typeCheck.typeCheck('Boolean', true)).toBe(true)
    expect(typeCheck.typeCheck('Object', {})).toBe(true)
    expect(typeCheck.typeCheck('Array', [1, 2])).toBe(true)
    expect(typeCheck.typeCheck('Date', new Date())).toBe(true)
    expect(typeCheck.typeCheck('Function', () => {})).toBe(true)
    expect(typeCheck.typeCheck('Function', setTimeout)).toBe(true)
    expect(typeCheck.typeCheck('RegExp', /\d+/g)).toBe(true)
    expect(typeCheck.typeCheck('Symbol', symbol)).toBe(true)
})
