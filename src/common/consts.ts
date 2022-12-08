export const HttpStatusCode = {
    '302': '接口重定向了！',
    '400': '参数不正确！',
    '401': '您未登录，或者登录已经超时，请先登录！',
    '403': '您没有权限操作！',
    '404': `请求地址出错`,
    // 在正确域名下
    '408': '请求超时！',
    '409': '系统已存在相同数据！',
    '500': '服务器内部错误！',
    '501': '服务未实现！',
    '502': '网关错误！',
    '503': '服务不可用！',
    '504': '服务暂时无法访问，请稍后再试！',
    '505': 'HTTP版本不受支持！',
    default: '异常问题，请联系管理员!',
}