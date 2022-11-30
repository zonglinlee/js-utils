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

export type TypeCheck = {
    typeCheck: (type: JsTypes, val: any) => boolean
}

const typeCheck: TypeCheck = {
    typeCheck(type, val) {
        return Object.prototype.toString.call(val) === `[object ${type}]`
    },
}

export default typeCheck
