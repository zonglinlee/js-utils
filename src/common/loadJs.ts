// 引入外部js文件
export function loadJs(src, attribute = null) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        if (attribute) {
            for (const attr of Object.keys(attribute)) {
                script.setAttribute(attr, attribute[attr])
            }
        }
        script.type = 'text/javascript'
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            reject()
        }

        script.src = src
        document.getElementsByTagName('body')[0].appendChild(script)
        // console.log(script)
    })
}
