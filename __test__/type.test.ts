import typeCheck from '../src/basic/type'

test('typeCheck:', () => {
    expect(typeCheck.typeCheck('Array', [1, 2])).toBe(true)
    expect(typeCheck.typeCheck('String', 'hello')).toBe(true)
    expect(typeCheck.typeCheck('Boolean', 'hello')).toBe(false)
})
