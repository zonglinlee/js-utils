import { uniqueArrByFilter } from '../src/common/uniqueArr'

test('uniqueArrByFilter', () => {
    expect(
        uniqueArrByFilter([1, 2, 2, true, true, 'hello', 'hello'])
    ).toStrictEqual([1, 2, true, 'hello'])

    expect(uniqueArrByFilter([1, {}, {}])).toStrictEqual([1, {}, {}])
})
