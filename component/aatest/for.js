(function (root, _document){
    var _bodyDom;

    setTimeout(function (){
        _bodyDom = _document.body
        getForItem();
    });

    /**
     *获取含有【za-for】属性的dom
    */
    function getForItem(){
        var zaTag = Array.prototype.slice.call(document.querySelectorAll('[za-for]')),//获取所有含有za-for属性的标签
        len = zaTag.length;
        while(len--){
            forItem.apply(zaTag[len]);
        }
    }

    /**
     *添加循环节点
    */
    function forItem(){
        var expression = this.getAttribute('za-for'),
        match = null,
        ivar = '',
        rvar = '',
        ivarMatch = null,
        variable = null,
        rValue,
        keys = [],
        len = 0,
        frag = null,
        parent = null,
        inner = '',
        nodes = [];
        match = expression.match(/^\s*([\s\S]+?)\s+of\s+([\s\S]+?)\s*$/);

        if(!match){
            throw '语法错误';
        }

        ivar = match[1];
        rvar = match[2];
        ivarMatch = ivar.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
        
        if(!ivarMatch){
            throw '语法错误';
        }

        variable = ivarMatch[1]?ivarMatch[1]:[ivarMatch[2], ivarMatch[3]];
        
        if(0===rvar.indexOf('[')){
            if(-1===rvar.indexOf(']')){
                if(!ivarMatch){
                    throw '语法错误:'+rvar;
                }
            }
            rValue = JSON.parse(rvar);
        }

        if(0===rvar.indexOf('{')){
            if(-1===rvar.indexOf('}')){
                if(!ivarMatch){
                    throw '语法错误:'+rvar;
                }
            }
            rValue = JSON.parse(rvar);
        }
        rValue = !!rValue?rValue:root[rvar];
        keys = Object.keys(rValue);
        len =keys.length;
        
        //添加循环后节点
        frag = document.createDocumentFragment();
        parent = this.parentNode;
        inner = this.innerHTML;
        nodes = [];
        for(var i=0; i<len; i++){
            var el = this.cloneNode(false);
            el.innerHTML = inner;
            el.zaIndex = i;
            if('string'===typeof variable){
                el[variable] = rValue[keys[i]];
            }else{
                el[variable[0]] = keys[i];
                el[variable[1]] = rValue[keys[i]];
            }
            frag.appendChild(el);
            nodes.push(el);
        }
        parent.replaceChild(frag, this);

        for(var i=0,l=nodes.length;i<l;i++){
            ZaParse.parseHTML.apply(nodes[i], [variable]);
        }
    }

})(this, document);