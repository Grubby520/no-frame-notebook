import axios from 'axios'
import UploadFileImage from '@/api/basicData/upload'
import { isEmpty, fileToMd5 } from '@/utils'
import { Message } from 'element-ui'


/**
 * 获取预签名信息
 * @param {File} params.file  上传的文件（file格式） 必传
 * @param {String} params.scope  上传的scope 必传
 * @param {String} params.folder  存放文件的文件路径 必传
 */
async function getUploadImgPreSign(params) {
    let { file, scope, folder } = params
    const _contentType = 'image' // 资源类型
    let md5 = file.type.includes(_contentType) ? await fileToMd5(file) : null // 只有图片才执行md5
    let apiParams = {
        fileName: file.name,
        contentType: file.type,
        scope,
        folder,
        md5
    }

    return new Promise((resolve, reject) => {
        UploadFileImage.getFilePreSign(apiParams).then((res) => {
            let { data } = res
            if (isEmpty(data)) {
                reject({ success: false })
            } else {
                resolve({
                    ...data,
                    md5
                })
            }
        }).catch(error => {
            reject(error)
        })
    })
}


/**
 * 上传文件到第三方
 * @param {File} params.file  上传文件所需的参数 必传
 * @param {String} params.uploadUrl  上传的url 必传
 * @param {String} params.folder  存放文件的文件路径 必传
 * @param {Function} params.timeout  上传超时时间，默认8min 非必传
 * @param {Function} params.onUploadProgress  上传进度回调 非必传
 */
function uploadFile(params) {
    let defaultTimeOut = 8 * 60 * 1000 // 请求超时时间，默认8min
    let { file, uploadUrl, timeout = defaultTimeOut, method: requestMethod } = params
    const CancelToken = axios.CancelToken
    let config = {
        timeout,
        headers: {
            'Content-Type': file.type
        },
        cancelToken: new CancelToken(function executor(c) {
            params.file.abort = c
        })
    }

    return new Promise((resolve, reject) => {
        axios({
            method: requestMethod.toLowerCase(),
            url: uploadUrl,
            data: file,
            ...config,
            onUploadProgress: function (ev) {
                // 判断是否有传入file对象，且未被删除
                if (params.onProgress && typeof params.onProgress === 'function' && params.file && params.file.abort) {
                    if (ev.total > 0) {
                        ev.percent = ev.loaded / ev.total * 100
                    }
                    params.onProgress(ev, params.file)
                }
            }
        })
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
                let timeout = String(error).indexOf('timeout') > -1
                if (timeout) {
                    Message({
                        message: '上传文件超时，请检查网络或调整文件大小',
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            })
    })
}

/**
 * 提交上传结果后返回文件信息
 */
function submitUploadResult(params, returnInfo) {
    let submitResultParams = {
        contentType: params.file.type,
        scope: params.scope,
        folder: params.folder,
        url: returnInfo.showUrl,
        md5: returnInfo.md5
    }
    return UploadFileImage.uploadResult(submitResultParams).then(() => {
        return Promise.resolve(returnInfo)
    }).catch(() => {
        return Promise.reject({
            success: false
        })
    })
}


/**
 * 处理文件上传
 * @param {File} params.file  上传的文件（file格式） 必传
 * @param {String} params.scope  上传的scope 必传
 * @param {String} params.folder  存放文件的文件路径 必传
 * @param {Function} params.onUploadProgress  上传进度回调 非必传
 */
async function clientUploadFile(params) {
    let preSignRes = await getUploadImgPreSign(params)
    /**
     * preSignRes(预签名返回信息)
     * {
     *    exists: Boolean    //文件是否已存在
     *    headers: null      //需要添加的headers
     *    showUrl: String    //文件地址
     *    uploadUrl: String  //请求第三方的url，带签名信息等
     *    method: "PUT"      //请求第三方的方法
     *    md5: String        //md5，用于去重校验（前端添加的字段）
     * }
    */

    return new Promise((resolve, reject) => {
        if (preSignRes.exists) {
            // 文件已存在，返回信息
            resolve(preSignRes)
        } else {
            // 文件不存在，则上传到第三方
            let { uploadUrl = '', method = 'put', md5 = '' } = preSignRes
            let uploadParams = {
                file: params.file,
                uploadUrl,
                method
            }
            Object.assign(uploadParams, params)
            uploadFile(uploadParams).then(() => {
                if (md5) {
                // mod: md5，提交上传结果后返回信息
                    submitUploadResult(params, preSignRes)
                        .then(res => {
                            resolve(res)
                        })
                        .catch(error => {
                            reject(error)
                        })
                } else {
                // mod: 非md5，返回信息
                    resolve(preSignRes)
                }
            }).catch((error) => {
                reject(error)
            })
        }
    })
}

/**
 * 上传相关参数
 * scope 云服务商
 * folder 存放路径
 */
const uploadCommonParams = {
    scope: {
        S3: 'WWW',
        tencent: 'INTERNAL'
    },
    folder: {
        products: 'products',
        sizeChart: 'products/size-chart',
        purchase: 'purchase'
    }
}

export {
    clientUploadFile,
    uploadCommonParams
}
