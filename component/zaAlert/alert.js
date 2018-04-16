(function (root, factory){
    if (document.ZAALERTLOAD) { return; }
    // Set up ZaAlert appropriately for the environment.
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define('zaalert', function(exports) {
            return factory(root, exports);
        });
    // Finally, as a browser global.
    } else {
        root.ZaAlert = factory(root, {});
    }
})(this, function (root, ZaAlert) {
    if (document.ZAALERTLOAD) {
        return 'Don\'t repeat load ZaAlert!';
    }

    ZaAlert.alert = function(msg){
        var _body = document.body;
        var div = document.createElement('div');
        var btn;
        var html = '<div class="alert-container">\
                    <div class="alert-title">消息提示：</div>\
                    <div class="alert-content">'+msg+'</div>\
                    <div class="alert-btn"><button id="alertBtn">确 定</button></div>\
                </div>';
        div.setAttribute('class', 'za-alert');
        div.innerHTML = html; 
        _body.appendChild(div);
        btn = document.getElementById('alertBtn');
        btn.onclick = function (){
            div.remove();
        }
    }

    document.ZAALERTLOAD = true;
        
    return ZaAlert;
});