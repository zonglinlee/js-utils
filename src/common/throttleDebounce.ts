// https://vue3js.cn/interview/JavaScript/debounce_throttle.html#%E4%BB%A3%E7%A0%81%E5%AE%9E%E7%8E%B0
// 节流: n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效
// 防抖: n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时

// 防抖函数：搜索框搜索输入。只需用户最后一次输入完，再发送请求 | 手机号、邮箱验证输入检测 |窗口大小resize。只需窗口调整完成后，计算窗口大小。防止重复渲染。
export function debounce(func, wait, immediate = false) {
    let timeout = null

    return function (...args) {
        const context = this
        if (timeout) clearTimeout(timeout) // timeout 不为null
        if (immediate) {
            const callNow = !timeout // 第一次会立即执行，以后只有事件执行后才会再次触发
            timeout = setTimeout(function () {
                timeout = null
            }, wait)
            if (callNow) {
                func.apply(context, args)
            }
        } else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait)
        }
    }
}

// 节流函数： 滚动加载，加载更多或滚到底部监听 | 搜索框，搜索联想功能
export function throttle(fn, delay) {
    let timer = null
    let startTime = Date.now()
    return function (...args) {
        const curTime = Date.now() // 当前时间
        const remaining = delay - (curTime - startTime) // 从上一次到现在，还剩下多少多余时间
        const context = this
        clearTimeout(timer)
        if (remaining <= 0) {
            fn.apply(context, args)
            startTime = Date.now()
        } else {
            timer = setTimeout(fn, remaining)
        }
    }
}
