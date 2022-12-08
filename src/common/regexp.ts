// url 正则校验  https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
export const isValidUrl = (urlString: string) => {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ) // validate fragment locator
    return !!urlPattern.test(urlString)
}

// passwordType1 校验: 登录密码必须是8至12个字符，必须用不含空格的英文字母、数字和符号至少3种，字母区分大小写!
export const isPasswordType1 =
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z._~!@#$^&*]+$)(?![a-z0-9]+$)(?![a-z._~!@#$^&*]+$)(?![0-9._~!@#$^&*]+$)[a-zA-Z0-9._~!@#$^&*]{8,12}$/

// 手机号码验证
export function isMobile(mobile: string) {
    return /^1[3-9]\d{9}$/.test(mobile)
}
// 身份证验证
export function isIdCard(code) {
    const city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江 ',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北 ',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏 ',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外 ',
    }
    let tip = ''
    let pass = true
    if (
        !code ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
            code
        )
    ) {
        tip = '身份证号格式错误'
        pass = false
    } else if (!city[code.substr(0, 2)]) {
        // tip = "地址编码错误"
        tip = '身份证输入错误'
        pass = false
    } else {
        // 18位身份证需要验证最后一位校验位
        if (code.length === 18) {
            code = code.split('')
            // ∑(ai×Wi)(mod 11)   加权因子
            const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            // 校验位
            const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
            let sum = 0
            let ai = 0
            let wi = 0
            for (let i = 0; i < 17; i++) {
                ai = code[i]
                wi = factor[i]
                sum += ai * wi
            }
            const last = parity[sum % 11]
            if (parity[sum % 11] != code[17]) {
                // tip = "校验位错误"
                tip = '身份证输入错误'
                pass = false
            }
        }
    }
    if (!pass) {
        return { tip, pass }
    } else {
        return { pass, tip }
    }
}

// 提取生日和性别
export function getBirthdayAndSex(idCard: string) {
    const info: { birthDay: string; sex: number } = {
        birthDay: null,
        sex: null,
    }
    const birth =
        idCard.length === 18 ? idCard.slice(6, 14) : idCard.slice(6, 12)
    // 18位：提取第17位数字；15位：提取最后一位数字
    const order = idCard.length === 18 ? idCard.slice(-2, -1) : idCard.slice(-1)
    info.birthDay =
        idCard.length === 18
            ? [birth.slice(0, 4), birth.slice(4, 6), birth.slice(-2)].join('-')
            : [
                  '19' + birth.slice(0, 2),
                  birth.slice(2, 4),
                  birth.slice(-2),
              ].join('-')
    // 余数为0代表女性，不为0代表男性
    info.sex = parseInt(order) % 2 === 0 ? 0 : 1
    return info
}
