/*
* @Author: nianko
* @Date:   2018-04-16 16:43:46
* @Last Modified by:   nianko
* @Last Modified time: 2018-04-16 16:43:51
*/
(function (root, factory){
    if (document.ZACONFIRMLOAD) { return; }
    // Set up ZaConfirm appropriately for the environment.
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define('zaconfirm', function(exports) {
            return factory(root, exports);
        });
    // Finally, as a browser global.
    } else {
        root.ZaConfirm = factory(root, {});
    }
})(this, function (root, ZaConfirm) {
    if (document.ZACONFIRMLOAD) {
        return 'Don\'t repeat load ZaConfirm!';
    }

    /**
     *确定按钮触发自定义点击事件时执行
    */
    function sureHandle(ev){
        ev.target.removeEventListener('click', sureHandle, false);
        document.getElementsByClassName('za-confirm')[0].remove();
    }

    /**
     *取消按钮触发自定义点击事件时执行
    */
    function cancelHandle(ev){
        ev.target.removeEventListener('click', cancelHandle, false);
        document.getElementsByClassName('za-confirm')[0].remove();
    }
    
    ZaConfirm.confirm = function(_zaConfirmConfig){
        var config = {
            title: _zaConfirmConfig.title,
            text: _zaConfirmConfig.text,
            sureBtn: !_zaConfirmConfig.sureBtn?'确 定':_zaConfirmConfig.sureBtn,
            sureBtnFn: !_zaConfirmConfig.sureBtnFn?'':_zaConfirmConfig.sureBtnFn,
            sureParam: _zaConfirmConfig.sureParam,
            cancelBtn: !_zaConfirmConfig.cancelBtn?'取 消':_zaConfirmConfig.cancelBtn,
            cancelBtnFn: !_zaConfirmConfig.cancelBtnFn?'':_zaConfirmConfig.cancelBtnFn,
            cancelParam: _zaConfirmConfig.cancelParam
        }, 
        _body = document.body,
        div = document.createElement('div'),
        html = '<div class="confirm-container">\
                    <div class="confirm-title">'+config.title+'</div>\
                    <div class="confirm-info">'+config.text+'</div>\
                    <div class="confirm-btn">\
                        <button id="sureConfirm" class="confirm-sure">'+config.sureBtn+'</button>\
                        <button id="cancelConfirm" class="confirm-cancel">'+config.cancelBtn+'</button>\
                    </div>\
                </div>',
        suretag, 
        cancelTag;

        div.setAttribute('class', 'za-confirm');
        div.innerHTML = html;
        _body.appendChild(div);

        suretag = document.getElementById('sureConfirm');
        cancelTag = document.getElementById('cancelConfirm');
        if(!!config.sureBtnFn){
            var param = JSON.stringify(config.sureParam);
            suretag.setAttribute('onclick', config.sureBtnFn+'('+param+')');
            suretag.addEventListener('click', sureHandle, false);
        }else{
            suretag.onclick = function(ev){
                console.log(ev);
                div.remove();
            }
        }

        if(!!config.cancelBtnFn){
            var param = JSON.stringify(config.cancelParam);
            cancelTag.setAttribute('onclick', config.cancelBtnFn+'('+param+')');
            cancelTag.addEventListener('click', cancelHandle, false);
        }else{
            cancelTag.onclick = function(){
               div.remove(); 
            }
        }
    }

    document.ZACONFIRMLOAD = true;
        
    return ZaConfirm;
});