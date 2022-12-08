// https://segmentfault.com/a/1190000016418021

// 利用set去重 ：这种方法无法去掉 {} 空对象
export function uniqueArrBySet(arr: Array<any>) {
    return Array.from(new Set(arr))
}

// 利用 for 嵌套 for，然后 splice 去重 : NaN 和 {} 没有去重
export function uniqueArrByDoubleForLoop(arr: Array<any>) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                //第一个等同于第二个，splice方法删除第二个
                arr.splice(j, 1)
                j--
            }
        }
    }
    return arr
}

// 利用 filter 去重 : NaN 和 {} 没有去重
// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
export function uniqueArrByFilter(arr: any[]) {
    return arr.filter((item, index, self) => self.indexOf(item) === index)
}
