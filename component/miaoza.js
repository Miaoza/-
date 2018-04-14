
var dynamicLoading = {  
    css: function(path){ 
        var head = document.getElementsByTagName('head')[0],
        frag = document.createDocumentFragment(),
        link = document.getElementsByTagName('link'),
        lEl;
        // html = [];
        if(!!link){
            lEl = link[0];
        }
        for (var i = 0, l=path.length; i < l; i++) {
            if(!path[i] || path[i].length === 0){  
                throw new Error('argument "path" is required !');  
            }
            var el = !!lEl?lEl.cloneNode(false):document.createElement('link'); 
            el.href = path[i];
            el.rel = 'stylesheet';
            el.type = 'text/css';
            frag.appendChild(el); 
        }
        head.appendChild(frag); 
        // head = null;
        // frag = null;
        // link = null;
        // lEl = null;
    },  
    js: function(path){  
        var head = document.getElementsByTagName('head')[0],
        frag = document.createDocumentFragment(), 
        script = document.getElementsByTagName('script'),
        sEl;
        if(!!script){
            sEl = document.getElementsByTagName('script')[0]
        }
        for (var i = 0, l=path.length; i < l; i++) {
            if(!path[i] || path[i].length === 0){  
                throw new Error('argument "path" is required !');  
            }  
            var el = !!sEl?sEl.cloneNode(false):document.createElement('script');
            el.href = path[i];
            el.type = 'text/javascript';
            frag.appendChild(el); 
        }
        head.appendChild(frag); 
        // head = null;
        // frag = null;
        // link = null;
        // lEl = null;
    }  
}  
/**对象包含两个完全独立的方法，分别用来加载 CSS 文件和 JS 文件，参数均为欲加载的文件路径。原理非常的简单：对于不同的加载文件类型创建不同的节点，然后添加各自的属性，最后扔到 head 标签里面。经测试，本方法兼容各浏览器，安全、无毒、环保，实乃 web 开发人员工作常备代码，请放心使用。
下面是调用代码，异常简单：
*/
var cssPath = ["./button.css"],
jsPath = [];
//动态加载 CSS 文件
dynamicLoading.css(cssPath);
//动态加载 JS 文件
dynamicLoading.js(jsPath);
