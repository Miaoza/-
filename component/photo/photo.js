(function (){
    var _photoContainer = document.getElementsByClassName("za-photo");
    setTimeout(function(){
        imgPostion(_photoContainer[0]);
    }, 0);

    function imgPostion(el){
        var imgs = el.children;
        var len = imgs.length;
        while(len--){
            // var top = "top:"+(40+10*(len))+"px;";
            // var left = 'left:'+60*(len+1)+'px;';
            // var rotate = 'transform:rotate(10deg);';
            var top = "top:"+10*Math.ceil(Math.random()*20)+'px;';
            var left = 'left:'+50*Math.ceil(Math.random()*20)+'px;';
            var _roate = 5*Math.ceil(Math.random()*4);
            if(len%3==0){
                _roate = -_roate;
            }
            var rotate = 'transform:rotate('+_roate+'deg);';
            imgs[len].style = top+left+rotate;

            imgs[len].onmouseover = function (ev){
                ev.target.style.transform = 'rotate(0deg) scale(1.5)';
            }

            imgs[len].onmouseout = function (ev){
                ev.target.style.transform = 'rotate('+_roate+'deg) scale(1)';
            }
        }
    }
})();
