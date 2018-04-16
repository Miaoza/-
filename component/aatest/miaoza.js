(function (root, _document){
    var _body,
    timer = 0,
    parents = [],
    lastParents = [];

    setTimeout(function (){
        _body = _document.body
        getForItem();
    });

    /******************
    *****for plugin****
    *******************/

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
            if(-1===rvar.indexOf(']')&&!ivarMatch){
                throw '语法错误:'+rvar;
            }

            rValue = JSON.parse(rvar);
        }

        if(0===rvar.indexOf('{')){
            if(-1===rvar.indexOf('}')&&!ivarMatch){
                throw '语法错误:'+rvar;
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
            parseHTML.apply(nodes[i], [variable]);
        }
    }

    /*******************
    ****parse plugin****
    ********************/

    /**
     *格式化为字符串
    */
    function stringify(value) {
      if (null===value||undefined===value) { // null || undefined
        return '';
      }
      switch (typeof value) {
        case 'string':
          break;
        case 'number':
          value = '' + value;
          break;
        default:
          value = JSON.stringify(value);
      }

      return value;
    }

    /**
     *格式化变量，添加this
    */
    function splitOperat(str){
        str ='this.'+str;
        var jsString = str.replace(/\+/g,'+this.')
                          .replace(/\*/g,'*this.')
                          .replace(/\-/g,'-this.')
                          .replace(/\//g,'/this.')
                          .replace(/\%/g,'%this.')
                          .replace(/\!/g,'!this.')
                          .replace(/\&\&/g,'&&this.')
                          .replace(/\|\|/g,'||this.');

        return jsString;
    }

    /**
     *解析变量
    */
    function getVariable(element, variable){       
        var content = '',
        matchSymbel = /\{\{\s*([\s\S]+?)\s*\}\}/g,
        commentSym = /<\!--\s*([\s\S]+?)\s*-->/g,
        list = [],   
        content = element.innerHTML;
        
        content = content.replace(commentSym, '');
        list = element.childNodes;
        //start for childNodes 
        for(var i=0,l=list.length;i<l;i++){
            if(3!==list[i].nodeType){
                continue;
            }
            var replaces = !list[i].data.match(matchSymbel)?[]:list[i].data.match(matchSymbel);
            //start for match {{xxx}}
            for(var j=0,len=replaces.length;j<len;j++){
                var startIndex = replaces[j].indexOf("{{"),
                endIndex = replaces[j].indexOf('}}');
                //start if have '{{' and '}}'
                if(-1<startIndex&&-1<endIndex){
                    var value = splitOperat(replaces[j].slice(startIndex+2, endIndex));
                    //is string not variable
                    if('"'===value[5]||"'"===value[5]){
                        if(-1===value.indexOf("'",6)&&-1===value.indexOf('"',6)){
                            throw '语法错误：'+value;
                        }else{
                            value = value.slice(5);
                        }
                    }
                    //is number not variable
                    if(!isNaN(+value.slice(5))){
                        value = value.slice(5);
                    }
                    try{
                        var _val = eval(value);
                        //replace string at point position
                        content = [
                            content.slice(0, content.indexOf(replaces[j])), 
                            _val, 
                            content.slice(content.indexOf(replaces[j])+replaces[j].length)
                        ].join('');
                        element.innerHTML = stringify(content);
                    }catch(err){
                        throw '语法错误：'+err+'-->'+value;
                    }                    
                }
                //end if have '{{' and '}}'
            } 
            //end for match {{xxx}}           
        }
        //end for childNodes 
    }

    /**
     *解析子节点
    */
    function traverseNodes(node, _var){  
        //判断是否是元素节点  
        if(node.nodeType === 1){  
            console.log(node); 
            if('body'!==node.localName){
                //判断是否有属性节点 
                var attr = [];
                for(var i=0;i<node.attributes.length;i++){  
                    //得到属性节点  
                    attr.push(node.attributes.item(i));  
                }
                if(!!attr.length){
                    this!==root&&parseAttribute.apply(this, [node]);
                }
            }
              

            //判断该元素节点是否有子节点  
            if(!!node.children.length&&'script'!==node.localName){ 
                //
                if(!parents.includes(node)){
                    parents.push(node);
                } 

                //得到所有的子节点  
                var sonnodes = node.children;  
                //遍历所哟的子节点  
                for (var i = 0; i < sonnodes.length; i++) {
                    //得到具体的某个子节点  
                    var sonnode = sonnodes.item(i);  
                    //递归遍历
                    traverseNodes.apply(this, [sonnode, _var]);
                } 
            }else{
                if('script'!==node.localName){
                    getVariable.apply(this, [node, _var]);
                    if(JSON.stringify(lastParents)!==JSON.stringify(parents)&&!!parents.length){
                        getParentNode.apply(this, [parents, _var]);
                    }
                    lastParents = lastParents.concat(parents);
                    parents = [];
                }
            }
        }else{
            getVariable.apply(this, [node, _var]);
        }  
    }

    /**
     *解析父node
    */
    function getParentNode(nodes, _var){
        var len = nodes.length;
        while(len--){
            getVariable.apply(this, [nodes[len], _var]);
        }
    }
    
    /**
     *解析属性
    */
    function parseAttribute(node){
        var _attrs = Array.prototype.slice.call(node.attributes),
        len = _attrs.length;

        while(len--){
            var attr_vals = _attrs[len].value,
            startIndex = attr_vals.indexOf("{{"),
            endIndex = attr_vals.indexOf('}}');

            if(-1<startIndex&&-1<endIndex){
                var attrVal = attr_vals.substring(attr_vals.indexOf("{{")+2, attr_vals.indexOf('}}'));
                _attrs[len].value = stringify(eval(splitOperat(attrVal))+attr_vals.substring(attr_vals.indexOf('}}')+2));
            }          
        }
    }

    /**
     *解析插值符API
    */
    parseHTML = function(_var){
        traverseNodes.apply(this, [this, _var]);

        clearTimeout(timer);
        timer = setTimeout(function (){
            traverseNodes.apply(root, [_body, '']);
        }, 10);
    }

})(this, document);


    