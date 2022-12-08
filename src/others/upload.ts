/**
 * 前端加签直传阿里云 OSS
 */
import axios from 'axios'
export type Sts_Response = {
    dir: string // oss 路径
    fileName: string // 文件名
    accessid: string // oss accessKeyId
    policy: string // oss policy
    signature: string // 签名
    host: string // oss host
}

export async function uploadFileToOss(file: File, StsResponse: Sts_Response) {
    try {
        const formData = new FormData()
        // formData.append('name', param.name)
        formData.append('key', StsResponse.dir + StsResponse.fileName)
        formData.append('OSSAccessKeyId', StsResponse.accessid)
        formData.append('policy', StsResponse.policy)
        formData.append('Signature', StsResponse.signature)
        formData.append('file', file)
        formData.append('success_action_status', '200') // 成功后返回的操作码
        return await doUpload(formData, StsResponse.host)
    } catch (e) {
        console.log(e)
    }
}

function generateRandomFilename(length) {
    const chars =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

function doUpload(formData: FormData, url) {
    const config = {
        headers: {
            'Content-Type':
                'multipart/form-data;boundary=' + new Date().getTime(),
        },
    }
    return axios.post(url, formData, config)
}
