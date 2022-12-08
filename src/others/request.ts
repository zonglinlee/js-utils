// https://juejin.cn/post/6968630178163458084
import axios from 'axios'
import { Loading, Message } from 'element-ui'
import { debounce } from '../common/throttleDebounce'

const pendingMap = new Map()

const LoadingInstance = {
    _target: null,
    _count: 0,
}

const defaultLoadingOptions = {
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
}
function myAxios(axiosConfig, customOptions, loadingOptions) {
    const service = axios.create({
        baseURL: process.env.VUE_APP_BASE_API_ANCHOR,
        timeout: 60 * 1000,
    })

    // 自定义配置
    const custom_options = Object.assign(
        {
            repeat_request_cancel: true, // 是否开启取消重复请求, 默认为 true
            loading: true, // 是否开启loading层效果, 默认为true
            reduct_data_format: true, // 是否开启简洁的数据结构响应, 默认为true
            error_message_show: true, // 是否开启接口错误信息展示,默认为true
            code_message_show: false, // 是否开启code不为0时的信息提示, 默认为false
        },
        customOptions
    )

    // 请求拦截
    service.interceptors.request.use(
        (config) => {
            const _r = removePending(config)
            if (_r instanceof Error) {
                return Promise.reject(_r)
            }
            custom_options.repeat_request_cancel && addPending(config)
            // 创建loading实例
            if (custom_options.loading) {
                LoadingInstance._count++
                if (LoadingInstance._count === 1) {
                    LoadingInstance._target = Loading.service(
                        Object.assign(defaultLoadingOptions, loadingOptions)
                    )
                }
            }
            // 自动携带token 添加自己的 token
            const TOKEN = 'myToken'
            if (TOKEN && typeof window !== 'undefined') {
                config.headers.Authorization = TOKEN
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // 响应拦截
    service.interceptors.response.use(
        (response) => {
            // removePending(response.config)
            if (custom_options.loading) {
                if (LoadingInstance._count > 0) LoadingInstance._count--
                debounce_closeLoading(custom_options) // 关闭loading
            }
            if (
                custom_options.code_message_show &&
                response.data &&
                response.data.code !== 0
            ) {
                Message({
                    type: 'error',
                    message: response.data.message,
                })
                return Promise.reject(response.data) // code不等于0, 页面具体逻辑就不执行了
            }

            return custom_options.reduct_data_format ? response.data : response
        },
        (error) => {
            // error.config && removePending(error.config)
            if (custom_options.loading) {
                if (LoadingInstance._count > 0) LoadingInstance._count--
                debounce_closeLoading(custom_options) // 关闭loading
            }
            custom_options.error_message_show && httpErrorStatusHandle(error) // 处理错误状态码
            return Promise.reject(error) // 错误继续返回给到具体页面
        }
    )

    return service(axiosConfig)
}

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error) {
    let message = error.message || ''
    if (error && error.response) {
        switch (error.response.status) {
            case 302:
                message = '接口重定向了！'
                break
            case 400:
                message = '参数不正确！'
                break
            case 401:
                message = '您未登录，或者登录已经超时，请先登录！'
                break
            case 403:
                message = '您没有权限操作！'
                break
            case 404:
                message = `请求地址出错: ${error.response.config.url}`
                break // 在正确域名下
            case 408:
                message = '请求超时！'
                break
            case 409:
                message = '系统已存在相同数据！'
                break
            case 500:
                message = '服务器内部错误！'
                break
            case 501:
                message = '服务未实现！'
                break
            case 502:
                message = '网关错误！'
                break
            case 503:
                message = '服务不可用！'
                break
            case 504:
                message = '服务暂时无法访问，请稍后再试！'
                break
            case 505:
                message = 'HTTP版本不受支持！'
                break
            default:
                message = '异常问题，请联系管理员！'
                break
        }
    }
    if (error.message.includes('timeout')) message = '网络请求超时！'
    if (error.message.includes('Network'))
        message = window.navigator.onLine ? '服务端异常！' : '您断网了！'

    Message({
        type: 'error',
        message,
    })
}

/**
 * 关闭Loading层实例
 * @param {*} _options
 */
function closeLoading(_options) {
    if (LoadingInstance._count === 0) {
        LoadingInstance._target && LoadingInstance._target.close()
        LoadingInstance._target = null
    }
}
// 合并loading，解决loading闪烁问题
const debounce_closeLoading = debounce(closeLoading, 150, false)

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 * @param {*} config
 */
function addPending(config) {
    const pendingKey = getPendingKey(config)
    pendingMap.set('requestObj', pendingKey)
    pendingMap.set('requestTime', new Date().getTime())
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config) {
    const pendingKey = getPendingKey(config)
    const requestObj = pendingMap.get('requestObj')
    const requestTime = pendingMap.get('requestTime')
    const timeNow = new Date().getTime()
    const interval = 1000
    if (pendingKey === requestObj && timeNow - requestTime < interval) {
        const message = '数据正在处理，请勿重复提交'
        console.warn(`[${pendingKey}]: ` + message)
        return new Error(message)
    }
}

/**
 * 生成唯一的每个请求的唯一key
 * @param {*} config
 * @returns
 */
function getPendingKey(config) {
    const { url, method, params } = config
    let data = config.data
    if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

export default myAxios
