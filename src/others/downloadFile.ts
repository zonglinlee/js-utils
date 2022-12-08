import { Loading, Message } from 'element-ui'
import axios from 'axios'
import * as qs from 'qs'
import { saveAs } from './fileSaver'
import { isValidUrl } from '../common/regexp'

// form 表单提交的方式下载文件
export function downloadFileByFormSubmit(downloadUrl: string, data) {
    const cloneData = data ? { ...data } : {}
    const formEle = document.createElement('form')
    formEle.setAttribute('method', 'post')
    formEle.setAttribute('target', '_blank')
    formEle.setAttribute('action', downloadUrl)
    formEle.setAttribute('id', 'importFileHidden')

    if (cloneData) {
        for (const key in cloneData) {
            const inputEle = document.createElement('input')
            inputEle.setAttribute('type', 'hidden')
            inputEle.setAttribute('name', key)
            inputEle.value = cloneData[key]
            formEle.appendChild(inputEle)
        }
    }
    document.body.appendChild(formEle)
    formEle.submit()
    document.body.querySelector('#importFileHidden').remove()
}

// download by blob
export function downloadFileByBlob(url, params, filename) {
    const downloadLoadingInstance = Loading.service({
        text: '正在下载数据，请稍候',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    return axios
        .post(url, params, {
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob',
        })
        .then(async (response) => {
            // response.data 应该是个 Blob =>  Blob {size: 7968, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            const data = response.data
            const isBlob = typeof data === 'object' && data instanceof Blob
            if (isBlob) {
                // const blob = new Blob([data])
                // saveAs(blob, filename)
                saveAs(data, filename)
            } else {
                if (isValidUrl(data)) {
                    saveAs(data, filename)
                } else {
                    console.error('response data:不是blob对象或者可下载的url')
                    Message.error('下载文件出现错误，请联系管理员！')
                }
            }
            downloadLoadingInstance.close()
        })
        .catch((r) => {
            console.error(r)
            Message.error('下载文件出现错误，请联系管理员！')
            downloadLoadingInstance.close()
        })
}
