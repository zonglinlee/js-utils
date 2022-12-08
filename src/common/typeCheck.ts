// https://juejin.cn/post/7002891064059117576
// js 类型检测
import TypeCheck from './typeCheck'

type JsTypes =
    | 'Null'
    | 'Undefined'
    | 'String'
    | 'Number'
    | 'Boolean'
    | 'Object'
    | 'Array'
    | 'Date'
    | 'Function'
    | 'RegExp'
    | 'Symbol'
    | 'Math'
    | 'Blob'

export type TypeCheck = {
    checkType: (type: JsTypes, val: any) => boolean
    isPromise: (x: PromiseLike<any> | Promise<any>) => boolean
    isPlainObj: (x: any) => boolean
    isLikeArray: (x: any) => boolean
}

const typeCheck: TypeCheck = {
    // typeof作为官方提供的类型检测操作符，在检测undefined、string、boolean、symbol这些基本数据类型及function方面是十分靠谱的
    // 不能对具体对象类型（Array、Date、regExp）进行区分。
    // typeof null === 'object' // 竟然是true。。
    checkType(type, val) {
        return Object.prototype.toString.call(val) === `[object ${type}]`
    },
    isPromise(x) {
        if (!(x instanceof Promise)) {
            return false
        }
        return this.checkType('Function', x.then)
    },
    /**
     * 纯对象的定义：特指通过一下三种方式创建的对象
     *
     * new Object
     * 对象字面量创建 {}
     * Object.create(null)
     * jquery、lodash源码都是采用下边的方法来检测
     */
    isPlainObj(value) {
        // 先用toString先排除其他数据类型
        if (!value || !this.checkType('Object', value)) {
            return false
        }
        const proto = Object.getPrototypeOf(value)
        if (proto === null) {
            //兼容Object.create(null)这样创建的对象
            return true
        }
        const Ctor =
            Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
            proto.constructor
        if (typeof Ctor !== 'function') {
            return false
        }
        const funcToString = Function.prototype.toString
        const objectCtorString = funcToString.call(Object)
        // 这里通过字符串判断构造函数是否是Object，而不是直接使用instanceof，是为了避免上边提到的 多window环境Object不同的问题
        if (funcToString.call(Ctor) === objectCtorString) {
            return true
        }
        return false
    },
    /**
     * 类数组的定义是：
     *
     * 拥有length属性，其它属性（索引）为非负整数（对象中的索引会被当做字符串来处理
     * 不具有数组所具有的方法
     */
    isLikeArray(x) {
        if (!(typeof x === 'object' && x !== null)) {
            return false
        }
        return (
            typeof x.length === 'number' && x.length >= 0 && !Array.isArray(x)
        )
    },
}

export default typeCheck
