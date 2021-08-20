// time: 2020-10-29
// author: Salt_lovely
// func: 计算时间差，格式<!-- <span class="salt-time-diff （实时更新则额外加上real-time——结束时间会强制改为当前时间）">{起始时间}|{结束时间}|{指令（d-天，h-小时，m-分钟，s-秒，M-毫秒）}</span> -->
// 参见https://mcbbs-wiki.cn/wiki/T:时间差
if (typeof saltTimeDiffMark_noConflictSign == 'undefined') { var saltTimeDiffMark_noConflictSign = false } // 如果一个页面中有多个此脚本，则不启用
window.addEventListener('load', () => {
    'use strict';
    if (saltTimeDiffMark_noConflictSign) { return } else { saltTimeDiffMark_noConflictSign = true } // 如果一个页面中有多个此脚本，则不启用
    timediffHandle()    // 开始计算
    timediffRealtime()  // 实时更新
    // 函数部分
    function timediffHandle() {
        var elems = document.querySelectorAll('.salt-time-diff')
        for (let i = 0; i < elems.length; i++) {
            var el = elems[i]
            // txt: [0]起始时间 [1]结束时间，默认为当前时间 [2]
            var txt = el.textContent.replace(/[年月日]/g, '/').replace(/[；：]/g, ':').split('SPLIT')
            var time1 = new Date(txt[0]), time2, time3, outtxt
            if (!time1.getTime() || time1.getTime() == NaN) { time1 = new Date() }      // 预防无效输入
            if (txt.length < 2) {
                time2 = new Date()
            } else {
                time2 = new Date(txt[1])
                if (!time2.getTime() || time2.getTime() == NaN) { time2 = new Date() }  // 预防无效输入
            }
            time3 = Math.abs(time1.getTime() - time2.getTime())
            // 送入timediff函数
            if (txt.length > 2) {
                txt[2] = txt[2].replace('天', 'd').replace('时', 'h').replace('分', 'm').replace('毫秒', 'M').replace('秒', 's')
                outtxt = timediff(time3, txt[2])
                el.setAttribute('timeDiff-command', txt[2])
            } else {
                outtxt = timediff(time3)
                el.setAttribute('timeDiff-command', 'd')
            }
            el.textContent = outtxt
            // 后续处理
            el.classList.remove('salt-time-diff')
            el.classList.add('salt-time-diff-done')
            el.setAttribute('startTime', time1.toString())
            el.setAttribute('endTime', time2.toString())
        }
    }
    function timediffRealtime() {
        var elems = document.querySelectorAll('.salt-time-diff-done.real-time')
        setInterval(() => { // 主要过程: 每0.25秒更新一次
            for (let i = 0; i < elems.length; i++) {
                setTimeout(() => { // 异步, 避免卡顿
                    var el = elems[i]
                    var time1 = new Date(el.getAttribute('startTime'))
                        , time2 = new Date()
                        , cmd = el.getAttribute('timeDiff-command')
                    if (!time1.getTime() || time1.getTime() == NaN) { // 预防无效输入
                        time1 = new Date()
                        el.setAttribute('startTime', time1.toString())
                    }
                    var time3 = Math.abs(time1.getTime() - time2.getTime())
                    // 送入timediff函数
                    var t = timediff(time3, cmd)
                    if (el.textContent != t) { el.textContent = t } // 避免闪烁
                }, 0)
            }
        }, 250)
        setInterval(() => { // 检查是否有漏网之鱼: 每5秒更新一次
            if (document.querySelectorAll('.salt-time-diff').length > 0) { timediffHandle() }
            elems = document.querySelectorAll('.salt-time-diff-done.real-time')
        }, 5000)
    }
    function timediff(ms = 0, cmd = 'd') { // 默认：没有时间差，只输出日期
        var finaltxt = ''
        if (cmd.indexOf('d') != -1) {
            let days = Math.floor(ms / (24 * 3600 * 1000))
            ms = ms % (24 * 3600 * 1000)         // 除去天数后剩余的毫秒数
            finaltxt += days + '天'
        }
        if (cmd.indexOf('h') != -1) {
            let hours = Math.floor(ms / (3600 * 1000))
            ms = ms % (3600 * 1000)             // 除去小时后剩余的毫秒数
            finaltxt += hours + '小时'
        }
        if (cmd.indexOf('m') != -1) {
            let hours = Math.floor(ms / (60 * 1000))
            ms = ms % (60 * 1000)               // 除去分钟后剩余的毫秒数
            finaltxt += hours + '分钟'
        }
        if (cmd.indexOf('s') != -1) {
            let hours = Math.floor(ms / (1000))
            ms = ms % (1000)                    // 除去秒数后剩余的毫秒数
            finaltxt += hours + '秒'
        }
        if (cmd.indexOf('M') != -1 || finaltxt.length < 1) { // 保险：若指令输入为空，则输出毫秒数
            finaltxt += ms + '毫秒'             // 剩余的毫秒数
        }
        return finaltxt
    }
})