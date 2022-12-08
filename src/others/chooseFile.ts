/**
 * copy from uniapp
 */

const ALL = '*'
const files = {}
let imageInput = null

function updateElementStyle(element, styles) {
    for (const attrName in styles) {
        element.style[attrName] = styles[attrName]
    }
}

function isWXEnv() {
    const ua = window.navigator.userAgent.toLowerCase()
    if (
        ua.match(/MicroMessenger/i) &&
        ua.match(/MicroMessenger/i)[0] === 'micromessenger'
    ) {
        return true
    } else {
        return false
    }
}

function createInput({ count, sourceType, type, extension }) {
    const inputEl = document.createElement('input')
    inputEl.type = 'file'

    updateElementStyle(inputEl, {
        position: 'absolute',
        visibility: 'hidden',
        'z-index': -999,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
    })

    inputEl.accept = extension
        .map((item) => {
            if (type !== ALL) {
                // 剔除.拼接在type后
                return `${type}/${item.replace('.', '')}`
            } else {
                // 在微信环境里，'.jpeg,.png' 会提示没有应用可执行此操作
                if (isWXEnv()) {
                    return '.'
                }
                // 在后缀前方加上.
                return item.indexOf('.') === 0 ? item : `.${item}`
            }
        })
        .join(',')

    if (count > 1) {
        inputEl.multiple = true
    }

    // 经过测试，仅能限制只通过相机拍摄，不能限制只允许从相册选择。
    if (sourceType.length === 1 && sourceType[0] === 'camera') {
        inputEl.capture = 'camera'
    }

    return inputEl
}

function hasOwn(obj, key) {
    const hasOwnProperty = Object.prototype.hasOwnProperty
    return hasOwnProperty.call(obj, key)
}

/**
 * 从url读取File
 * @param {string} url
 * @param {Promise}
 */
function urlToFile(url) {
    const file = files[url]
    if (file) {
        return Promise.resolve(file)
    }
    if (/^data:[a-z-]+\/[a-z-]+;base64,/.test(url)) {
        return Promise.resolve(base64ToFile(url))
    }
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = function () {
            resolve(this.response)
        }
        xhr.onerror = reject
        xhr.send()
    })
}

/**
 * base64转File
 * @param {string} base64
 * @return {File}
 */
export function base64ToFile(base64) {
    base64 = base64.split(',')
    const type = base64[0].match(/:(.*?);/)[1]
    const str = atob(base64[1])
    let n = str.length
    const array = new Uint8Array(n)
    while (n--) {
        array[n] = str.charCodeAt(n)
    }
    return blobToFile(array, type)
}

/**
 * 简易获取扩展名
 * @param {string} type
 * @return {string}
 */
function getExtname(type) {
    const extname = type.split('/')[1]
    return extname ? `.${extname}` : ''
}

/**
 * 简易获取文件名
 * @param {*} url
 */
function getFileName(url) {
    url = url.split('#')[0].split('?')[0]
    const array = url.split('/')
    return array[array.length - 1]
}

/**
 * blob转File
 * @param {Blob} blob
 * @param {string} type
 * @return {File}
 */
function blobToFile(blob, type) {
    if (!(blob instanceof File)) {
        type = type || blob.type || ''
        const filename = `${Date.now()}${getExtname(type)}`
        try {
            blob = new File([blob], filename, { type })
        } catch (error) {
            blob = blob instanceof Blob ? blob : new Blob([blob], { type })
            blob.name = blob.name || filename
        }
    }
    return blob
}

/**
 * 从本地file或者blob对象创建url
 * @param {Blob|File} file
 * @return {string}
 */
function fileToUrl(file) {
    for (const key in files) {
        if (hasOwn(files, key)) {
            const oldFile = files[key]
            if (oldFile === file) {
                return key
            }
        }
    }
    const url = (window.URL || window.webkitURL).createObjectURL(file)
    files[url] = file
    return url
}

function getSameOriginUrl(url) {
    const a = document.createElement('a')
    a.href = url
    if (a.origin === location.origin) {
        return Promise.resolve(url)
    }
    return urlToFile(url).then(fileToUrl)
}

function revokeObjectURL(url) {
    ;(window.URL || window.webkitURL).revokeObjectURL(url)
    delete files[url]
}

/**
 * 默认选择图片，如果是 pdf, 如下调用
 * chooseFile({sourceType:[], extension:['pdf], fileType:'*'})
 */

export function chooseFile({
    count = 1,
    sizeType = ['original'],
    sourceType = ['camera', 'album'],
    extension = ['jpg', 'png', 'jpeg'],
    fileType = 'image',
    success,
}) {
    // TODO handle sizeType 尝试通过 canvas 压缩
    if (imageInput) {
        document.body.removeChild(imageInput)
        imageInput = null
    }

    imageInput = createInput({
        count,
        sourceType,
        extension,
        type: fileType,
    })
    document.body.appendChild(imageInput)

    imageInput.addEventListener('change', function (event) {
        const tempFiles = []
        const fileCount = event.target.files.length
        for (let i = 0; i < fileCount; i++) {
            const file = event.target.files[i]
            let filePath
            Object.defineProperty(file, 'path', {
                get() {
                    filePath = filePath || fileToUrl(file)
                    return filePath
                },
            })
            if (i < count) tempFiles.push(file)
        }
        const res = {
            errMsg: 'chooseImage:ok',
            get tempFilePaths() {
                return tempFiles.map(({ path }) => path)
            },
            tempFiles: tempFiles,
        }
        success(res)
        // TODO 用户取消选择时，触发 fail，目前尚未找到合适的方法。
    })

    imageInput.click()
}
