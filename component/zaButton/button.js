/*
* @Author: nianko
* @Date:   2018-04-16 16:48:21
* @Last Modified by:   nianko
* @Last Modified time: 2018-04-16 16:48:26
*/
//自定义按钮事件
"use strict";
(function (){
    function getTag(){
        return document.getElementsByTagName('button');
    }
    var tag = getTag();
    setTimeout(function(){
        var len = tag.length;
        while(len--){
            var isClassDisabled = tag[len].classList.contains('za-disabled'),
            isAttrDisabled = tag[len].disabled;

            if(isClassDisabled&&!isAttrDisabled){
                tag[len].disabled = true;
                continue;
            }
            if(!isClassDisabled&&isAttrDisabled){
                tag[len].classList.add('za-disabled');
                continue;
            }
        }
    }, 0);
})();
