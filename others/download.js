/**
* 下载
* @param  {String} url 目标文件地址
* @param  {Object} params 请求参数
* @param  {String} filename 想要保存的文件名称
*/
function download(url, params, filename) {
    url = serialize(url, params)
    getBlob(url, function (blob) {
        saveAs(blob, filename);
    });
}

/**
 * 参数序列化(推荐使用qs插件工具，兼容更好)
 * @param {String} url 
 * @param {Object} params (key-value) value为基本数据类型
 */
function serialize(url, params) {
    url += '?'
    Object.keys(params).forEach(key => {
        url += key + '=' + params[key] + '&'
    })
    return url.slice(0, -1)
}

/**
* 获取 blob
* @param  {String} url 目标文件地址
* @return {cb}
    */
function getBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}
/**
* 保存
* @param  {Blob} blob
* @param  {String} filename 想要保存的文件名称
*/
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement('a');
        var body = document.querySelector('body');
        link.href = window.URL.createObjectURL(blob); // 用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象
        link.download = filename;
        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    }
}
