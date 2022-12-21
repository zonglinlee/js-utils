// 获取当前时间
export function getNowTime() {
    function add_10(num) {
        if (num < 10) {
            num = '0' + num
        }
        return num
    }
    const myDate = new Date()
    const nowTime =
        myDate.getFullYear() +
        '-' +
        add_10(myDate.getMonth() + 1) +
        '-' +
        myDate.getDate() +
        ' ' +
        add_10(myDate.getHours()) +
        ':' +
        add_10(myDate.getMinutes()) +
        ':' +
        add_10(myDate.getSeconds())
    return nowTime
}
