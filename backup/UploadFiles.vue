<template>
    <div class="sl-upload">
        <el-upload v-if="!readonly" action="" :on-error="onError" :http-request="httpRequest" :on-success="onSuccess"
            :before-remove="beforeRemove" :before-upload="beforeUpload" :on-remove="onRemove" :on-progress="onProgress"
            :show-file-list="showFileList" :accept="accept" :limit="limit" :file-list="fileList" multiple
            :on-exceed="onExceed">
            <el-button type="text" style="text-decoration: underline;">点击上传</el-button>
        </el-upload>
        <template v-if="!showFileList">
            <div v-for="(item, index) in files" :key="index">
                <p class="item">
                    <span class="file-name" :title="item.fileName">{{item.fileName}}</span>
                    <el-popover v-show="!/[doc|docx|xls|xlsx|xlsm|ppt|pptx|pdf]$/.test(item.fileName)"
                        popper-class="tinymce-popper" placement="top" :close-delay="0" trigger="click">
                        <div>
                            <img :src="sourceImage(item.url, 450, 450)" />
                        </div>
                        <a slot="reference">查看</a>
                    </el-popover>
                    <a @click="downloadFile(item)">下载</a>
                    <el-button v-if="!readonly || deleteable" type="text" class="sl-del"
                        @click="removeFile(item, index)">{{$t('button.delete')}}</el-button>
                </p>
            </div>
        </template>
    </div>
</template>
<script>
import UploadFile from '@/api/basicData/upload'
import { sourceImageToCut } from 'utils/helper'
import * as ClientUploadFile from '@/utils/clientUploadFile.js'
export default {
    name: 'SlUploadFiles',
    components: {},
    // model: { // ps 暂不改造
    //     prop: 'value',
    //     event: 'emitFile'
    // },
    props: {
        value: {
            type: Array
        },
        limit: {
            type: Number,
            default: 20
        },
        listType: {
            type: String,
            default: 'text'
        },
        accept: {
            type: String,
            default:
                '.jpg,.jpeg,.png,.pdf,.xlsx,.xls,.docx,.doc,.zip,.rar,.arj,.z'
        },
        deleteable: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        size: {
            type: Number,
            default: 50
        },
        showFileList: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            fileList: [],
            files: [],
            uploadCount: 0,
            vaildCount: 0,
            uploadReqArg: {
                folder: ClientUploadFile.uploadCommonParams.folder.purchase,
                scope: ClientUploadFile.uploadCommonParams.scope.tencent
            },
            httpResponse: {} // 上传接口返回的response
        }
    },
    methods: {
        beforeUpload(file) {
            const isOverSize = file.size / 1024 / 1024 > this.size
            // 上传文件大小限制
            if (isOverSize) {
                this.$message.error(
                    `${file.name}超出限制大小，大小不能超过 ${this.size}MB`
                )
                return false
            }
            // 上传文件类型限制
            if (this.accept.indexOf(this.getFileType(file.name)) === -1) {
                this.$message({
                    showClose: true,
                    message: `${file.name}文件类型错误，请选择以${this.accept}为结尾的文件`,
                    type: 'error',
                    duration: 15000
                })
                return false
            }

            this.uploadCount++
            this.$emit('changeDisabled', true)
        },
        verifyIsUploadComplete(file) {
            this.vaildCount++
            if (this.vaildCount === this.uploadCount) {
                this.$emit('changeDisabled', false)
                this.uploadCount = 0
                this.vaildCount = 0
            }
        },
        onProgress(ev) {},
        // 待处理file
        onError(err, file, fileList) {
            this.verifyIsUploadComplete()
            this.$message.error('上传失败！')
        },
        onSuccess(response, file, fileList) {
            this.verifyIsUploadComplete(file)
            this.$message.success('上传成功！')
            this.files.push({
                fileName: file.name,
                url: this.httpResponse.showUrl
            })
            // fix files中的数据与fileList无法对齐
            const _index = fileList.findIndex((item) => item.uid === file.uid)
            if (_index !== -1) {
                fileList[_index].url = this.httpResponse.showUrl
            }
            this.fileList = fileList
            this.$emit('emitFile', this.files)
        },
        beforeRemove(file) {
            const isOverSize = file.size / 1024 / 1024 > this.size
            if (isOverSize) {
                return true
            }
            if (this.accept.indexOf(this.getFileType(file.name)) === -1) {
                return true
            }
            return this.$confirm(
                `你确定要删除 ${file.name || file.fileName}？`,
                '提示',
                {
                    lockScroll: false,
                    closeOnClickModal: false
                }
            )
        },
        removeFile(file, index) {
            this.$confirm(
                `你确定要删除 ${file.name || file.fileName}？`,
                '提示',
                {
                    lockScroll: false,
                    closeOnClickModal: false
                }
            ).then(() => {
                if (!this.showFileList) {
                    this.files.splice(index, 1)
                    this.fileList.splice(index, 1)
                }
                this.$emit('emitFile', this.files)
            })
        },
        onRemove(file, fileList) {
            this.fileList = fileList
            if (file.status === 'uploading') {
                // 取消请求
                file.raw.abort()
                this.verifyIsUploadComplete(file)
            }
            this.updateFiles(fileList)
        },
        updateFiles(fileList, index) {
            // fix fileList过滤包含正在上传的文件
            this.files = fileList
                .filter((file) => file.url)
                .map((item) => {
                    return {
                        fileName: item.name,
                        url: item.url
                    }
                })
            this.$emit('emitFile', this.files)
        },
        onExceed(files, fileList) {
            this.$message.warning(
                `最多上传 ${this.limit} 个文件，请把已上传的文件删除后重新上传！`
            )
        },
        /**
         * mod 调用后台上传接口 -> 客户端直接调用第三方云
         * @param {String} params.folder 存放路径
         * @param {String ['INTERNAL' | 'WW']} params.scope 上传云服务器
         */
        httpRequest(params) {
            Object.assign(params, this.uploadReqArg)
            ClientUploadFile.clientUploadFile(params)
                .then((res) => {
                    this.httpResponse = res
                    params.onSuccess() // 更新status
                })
                .catch((res) => {
                    params.onError() // 更新status
                })
        },
        getFileType(fileName) {
            return (
                (fileName &&
                    fileName
                        .substring(fileName.lastIndexOf('.') + 1)
                        .toLowerCase()) ||
                ''
            )
        },
        sourceImage(src, w, h) {
            return sourceImageToCut(src, w, h)
        },
        // 下载
        downloadFile(item) {
            this.$message.success('正在导出中...')
            event.stopPropagation()
            UploadFile.download(item.url, item.fileName)
        },
        reloadFileList(values) {
            if (values) {
                this.files = JSON.parse(JSON.stringify(values))
                this.fileList = values.map((item) => {
                    item.name = item.fileName
                    return item
                })
            } else {
                this.fileList = []
                this.files = []
            }
            this.$emit('emitFile', this.files)
        }
    },
    watch: {
        value: {
            handler: 'reloadFileList',
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
.item {
    text-align: left;
}
.file-name {
    display: inline-block;
    width: 100px;
    line-height: 20px;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
}
a {
    color: #409eff;
    text-decoration: underline;
    font-size: 12px;
    margin-right: 10px;
}
.sl-del {
    color: #f56c6c;
    text-decoration: underline;
}
</style>
