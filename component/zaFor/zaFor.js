//自定义指令

/**
 *存在的bug
 *暂时没有错误判断
*/
"use strict";

(function (root){
    var _bodyDom;
    setTimeout(function (){
        _bodyDom = document.body;
        loopItem();
        parseHTML();
    });
    //.replace(/\s+/g,"")去掉所有空格
    function getInsertStrs(htmlStr) {
        var list = htmlStr.split("}}"),
        len = list.length-1,
        _inners = [];
        while(len--){
            var index = list[len].indexOf('{{');
            _inners.push(list[len].slice(index+2, list[len].length));
        }
        return _inners;
    }

    /**
     *为特殊字符添加转义符，待补充
    */
    function addZhuanyi(str){
        var index = str.indexOf('(');
        if(-1<index){
            var nextIndex = str.indexOf(')');
            //转义'('和')'
            str = str.slice(0, index)+'\\'+str.slice(index, nextIndex)+'\\'+str.slice(nextIndex);
        }
        if(-1<str.indexOf('+')){
            var list = str.split('+');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\+'+list[j];
            }
        }
        if(-1<str.indexOf('-')){
            var list = str.split('-');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\-'+list[j];
            }
        }
        if(-1<str.indexOf('*')){
            var list = str.split('*');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\*'+list[j];
            }
        }
        if(-1<str.indexOf('/')){
            var list = str.split('/');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\/'+list[j];
            }
        }
        if(-1<str.indexOf('%')){
            var list = str.split('%');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\%'+list[j];
            }
        }
        if(-1<str.indexOf('$')){
            var list = str.split('$');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\$'+list[j];
            }
        }
        if(-1<str.indexOf('^')){
            var list = str.split('^');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\^'+list[j];
            }
        }
        if(-1<str.indexOf('&')){
            var list = str.split('&');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\&'+list[j];
            }
        }
        if(-1<str.indexOf('|')){
            var list = str.split('|');
            str = '';
            for(var j=0,l=list.length;j<l;j++){
                str = 0===j?list[j]:str+'\\|'+list[j];
            }
        }
        return str;
    }

    /**
     *解析非循环的插值
    */
    function parseHTML(){
        var outer = _bodyDom.outerHTML.replace(/\{\{ /g,"\{\{").replace(/ \}\}/g, '\}\}'),
        arrList = getInsertStrs(outer),
        len = arrList.length;
        for(var i=0;i<len;i++){
            var _value = eval(arrList[i]),
            reg;
          
            arrList[i] = addZhuanyi(arrList[i]);
            reg = new RegExp('\{\{'+arrList[i]+'\}\}', "gm");
            outer = outer.replace(reg, _value);
        }
        _bodyDom.outerHTML = outer;
    }

    /**
     *获取插值符内变量的值
    */
    function getHtMLValue(str, value){
        var indexO = str.indexOf('.'),
        indexA = str.indexOf('['),
        indexF = str.indexOf('('),
        _val = '',
        list;
        if(-1<str.indexOf('+')){
            list = str.split('+');
        }
        if(-1<str.indexOf('-')){
            list = str.split('-');
        }
        if(-1<str.indexOf('*')){
            list = str.split('*');
        }
        if(-1<str.indexOf('/')){
            list = str.split('/');
        }
        if(-1<str.indexOf('%')){
            list = str.split('%');
        }

        if('string' === typeof value){
            return value;
        }

        if(!!list){
            for(var i=0,l=list.length;i<l;i++){
                var _var = list[i].slice(list[i].indexOf('.')+1);

                if('string' === typeof value[_var]){
                    value[_var] = "'"+value[_var]+"'";
                }
                str = str.replace(list[i], value[_var]);
            }
            return eval(str);
        }
        
        if(-1<indexO){
            var _var = str.slice(indexO+1);
            _val = value[_var];
        }else if(-1<indexA){
            var _var =str.slice(indexA+1, str.indexOf(']'));
            _val = value[_var];
        }else{
            _val = JSON.stringify(value);
        }

        return _val
    }

    /**
     *解析循环内插值
    */
    function parseLoopHTML(el, _index, _value){
        var outer = el.outerHTML,
        _arrs,
        len;

        outer = outer.replace(/\{\{ /g,"\{\{").replace(/ \}\}/g, '\}\}').replace(/\{\{zaIndex\}\}/g, _index);
        _arrs = getInsertStrs(outer);
        len = _arrs.length;
        for(var i=0;i<len;i++){
            var _val = '';
            _val = getHtMLValue(_arrs[i], _value);

            outer = outer.replace('\{\{'+_arrs[i]+'\}\}', _val);
        }
        el.outerHTML = outer;
    }

    /**
     *循环
    */
    function loopItem(){
        var zaTag = document.querySelectorAll('[za-for]'),//获取所有含有za-for属性的标签
        len = zaTag.length;

        //循环所有含za-for属性dom
        while(len--){
            var attr_val = zaTag[len].getAttribute('za-for').replace(/\s+/g,""),//去掉所有空格
            index = attr_val.indexOf('of'),//判断语法是否含有of
            list,
            val,
            arr,
            tagNode,
            frag,
            parent,
            inner,
            _nodes,
            obj;

            if(!index){
                console.log('error yufa');
                return ;
            }

            list = attr_val.slice(index+2, attr_val.length);//获取列表字符串
            if(!list){
                console.log('error yufa');
                return ;
            }

            val = attr_val.slice(0, index);
            if(!list){
                console.log('error yufa');
                return ;
            }

            //解析字符串
            if(-1<list.indexOf('[')){
                arr = list.slice(1, list.length-1).split(',');//是数组
            }else{
                arr = root[list];//是变量名
            }

            //添加循环后dom
            tagNode = zaTag[len];
            frag = document.createDocumentFragment();
            parent = tagNode.parentNode;
            inner = tagNode.innerHTML;
            _nodes = [];
            obj = {};

            //添加循环dom
            for(var i=0, l=arr.length; i<l; i++){
                var el = tagNode.cloneNode(false);
                el.innerHTML = inner;
                frag.appendChild(el);
                _nodes.push(el);
            }
            parent.replaceChild(frag, tagNode);

            //解析循环体内变量
            for(var i=0,l=_nodes.length;i<l;i++){
                parseLoopHTML(_nodes[i], i, arr[i]);
            }
        }//end while
    }
})(this);
