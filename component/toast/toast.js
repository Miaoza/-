(function (root, factory){
    if (document.ZATOASTLOAD) { return; }
    // Set up ZaToast appropriately for the environment.
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define('zatoast', function(exports) {
            return factory(root, exports);
        });
    // Finally, as a browser global.
    } else {
        root.ZaToast = factory(root, {});
    }
})(this, function (root, ZaToast) {
    if (document.ZATOASTLOAD) {
        return 'Don\'t repeat load ZaToast!';
    }

    function isNumber(num){
        var reg = new RegExp("^[0-9]*$");
        if(!reg.test(num)){
            return false;
        }
        return true;
    }

    function appendOrRemoveToast(obj, classlist){
        var _body = document.body,
        div = document.createElement('div'),
        isExisted = document.getElementsByClassName('toast-container')[0],
        containerEl = !isExisted?document.createElement('div'):document.getElementsByClassName('toast-container')[0];
        if(!isExisted){
            containerEl.setAttribute('class', 'toast-container');
            _body.appendChild(containerEl);
        }
        div.setAttribute('class', classlist);
        div.innerHTML = obj.message;
        containerEl.appendChild(div);

        setTimeout(function (){
            div.remove();
            containerEl.remove;
        }, obj.duration);
    }
    
    /**
     *info 普通消息提示
     *param [object message: content, duration: 显示时间]
    */
    ZaToast.info = function (info){
        var timestamp = 2000;
        info.duration = !info.duration?timestamp:info.duration;
        if(!isNumber(info.duration)){
            div.remove();
            return 'error duration budui';
        }
        appendOrRemoveToast(info, 'toast info-toast')
    }

    /**
     *success 成功提示
     *param [object message: content, duration: 显示时间]
    */
    ZaToast.success = function (success){
        var timestamp = 2000;
        success.duration = !success.duration?timestamp:success.duration;
        if(!isNumber(success.duration)){
            div.remove();
            return 'error duration budui';
        }
        appendOrRemoveToast(success, 'toast success-toast')
    }

    /**
     *warn 警告提示
     *param [object message: content, duration: 显示时间]
    */
    ZaToast.warn = function (warn){
        var timestamp = 2000;
        warn.duration = !warn.duration?timestamp:warn.duration;
        if(!isNumber(warn.duration)){
            div.remove();
            return 'error duration budui';
        }
        appendOrRemoveToast(warn, 'toast warn-toast')
    }

    /**
     *error 错误提示
     *param [object message: content, duration: 显示时间]
    */
    ZaToast.error = function (error){
        var timestamp = 2000;
        error.duration = !error.duration?timestamp:error.duration;
        if(!isNumber(error.duration)){
            div.remove();
            return 'error duration budui';
        }
        appendOrRemoveToast(error, 'toast error-toast')
    }

    document.ZATOASTLOAD = true;
        
    return ZaToast;
});
