<!-- ./UploadFiles.vue 文件备份，源文件已经更新为客户端上传 -->
<template>
    <div class="sl-upload">
        <el-upload v-if="!readonly" action="/api/v1.0/data/upload/file" :on-error="uploadFailure"
            :on-success="uploadSuccess" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-remove="removed"
            :show-file-list="showFileList" :accept="accept" :limit="limit" :file-list="fileList" multiple
            :on-exceed="handleExceed" :on-progress="onprogress">
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
        <el-progress :percentage="percentage" :format="format" v-if="cShowProgress"></el-progress>
    </div>
</template>
<script>
import UploadFile from '@/api/basicData/upload'
import { sourceImageToCut } from 'utils/helper'
export default {
    name: 'SlUploadFiles',
    components: {},
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
                '.jpg,.jpeg,.png,.pdf,.xlsx,.xls,.docx,.doc, .zip, .rar, .arj, .z'
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
            default: false
        },

        showProgress: Boolean
    },
    data() {
        return {
            fileList: [],
            files: [],
            uploadCount: 0,
            vaildCount: 0,

            percentage: 0
        }
    },
    computed: {
        cShowProgress() {
            return this.showProgress && this.percentage > 0
        }
    },
    created() {
        if (this.value) {
            this.files = JSON.parse(JSON.stringify(this.value))
            this.fileList = this.value.map((item) => {
                item.name = item.fileName
                return item
            })
        }
    },
    methods: {
        // 下载
        downloadFile(item) {
            event.stopPropagation()
            UploadFile.download(item.url, item.fileName)
        },
        getFileType(fileName) {
            return fileName
                .substring(fileName.lastIndexOf('.') + 1)
                .toLowerCase()
        },
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
            this.uploadCount += 1
            this.$emit('changeDisabled', true)
        },
        verifyIsUploadComplete() {
            this.vaildCount += 1
            if (this.vaildCount === this.uploadCount) {
                this.$emit('changeDisabled', false)
                this.uploadCount = 0
                this.vaildCount = 0
            }
        },
        uploadFailure() {
            this.verifyIsUploadComplete()
            this.$message.error('上传失败！')

            this.updatePercentage(0)
        },
        uploadSuccess(response, file, fileList) {
            this.verifyIsUploadComplete()
            this.$message.success('上传成功！')
            this.files.push({
                fileName: file.name,
                url: file.response.data.src
            })
            this.fileList = fileList
            this.$emit('emitFile', this.files)

            this.updatePercentage(0)
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
        updateFiles(fileList, index) {
            this.files = fileList.map((item) => {
                return {
                    fileName: item.name,
                    url: item.url
                }
            })
            this.$emit('emitFile', this.files)
        },
        removed(file, fileList) {
            if (file.status === 'uploading') {
                this.verifyIsUploadComplete()
            }
            this.updateFiles(fileList)
        },
        removeFile(file, index) {
            this.$confirm(
                `你确定要删除 ${file.name || file.fileName}？`,
                '提示',
                {
                    lockScroll: false,
                    closeOnClickModal: false
                }
            ).then(
                () => {
                    if (!this.showFileList) {
                        this.files.splice(index, 1)
                        this.fileList.splice(index, 1)
                    }
                    this.$emit('emitFile', this.fileList, this.files)
                },
                () => {}
            )
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `最多上传 ${this.limit} 个文件，请把已上传的文件删除后重新上传！`
            )
        },
        sourceImage(src, w, h) {
            return sourceImageToCut(src, w, h)
        },
        reloadFileList(values) {
            if (values) {
                this.files = JSON.parse(JSON.stringify(values))
                this.fileList = values.map((item) => {
                    item.name = item.fileName
                    return item
                })
            } else {
                this.$set(this, 'fileList', [])
                this.$set(this, 'files', [])
            }
            this.$emit('emitFile', this.fileList, this.files)
        },

        updatePercentage(v) {
            this.percentage = v
        },
        onprogress(event) {
            this.updatePercentage(Math.floor(event.percent))
        },
        format(percentage) {
            return `${percentage}%`
        }
    },
    watch: {
        value(newVal) {
            this.reloadFileList(newVal)
        },
        showFileList(newVal) {
            this.showFileList = newVal
        },
        limit(newVal) {
            if (newVal) {
                this.limit = newVal
            } else {
                this.limit = 20
            }
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
