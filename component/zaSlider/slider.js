(function (root, factory){
    if (document.ZASLIDELOAD) { return; }
    // Set up ZaSlider appropriately for the environment.
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define('zaslider', function(exports) {
            return factory(root, exports);
        });
    // Finally, as a browser global.
    } else {
        root.ZaSlider = factory(root, {});
    }
})(this, function (root, ZaSlider) {
    if (document.ZASLIDELOAD) {
        return 'Don\'t repeat load ZaSlider!';
    }
    var hasInited = false;
    var defaultConfig = {
        isLoop: false,
        isAuto: false,
        isShowDiandian: true,
        duration: 3000
    };
    var elements;
    var itemLen=0;
    var autoTimer = 0;

    ZaSlider.configs = defaultConfig;

    function auto(){
        clearInterval(autoTimer);
        var tag = document.getElementsByClassName('za-slider-flex');
        var len = document.getElementsByClassName('slider-item').length;
        for(var i=0,l=tag.length;i<l;i++){
            var client = -tag[i].clientWidth;
            if((len-1)===itemLen&&!ZaSlider.configs.isLoop){
                console.log('right no item');
                return ;
            }
            if((len-1)===itemLen&&ZaSlider.configs.isLoop){
                itemLen = 0;
                tag[i].style.transition = "0s";
            }else{
                itemLen += 1;
                tag[i].style.transition = "1s";
            }
            
            slide(tag[i], client*itemLen);
            autoTimer = setInterval(function (){
                auto();
            }, ZaSlider.configs.duration);
        }

    }

    function hoverSlider(){
        var tag = document.getElementsByClassName('slider-container');
        var len = tag.length;
        var left = document.getElementsByClassName('slider-left-btn');
        var right = document.getElementsByClassName('slider-right-btn');
        while(len--){
            var index = len;
            tag[len].onmouseover = function(){
                left[index].style.display = 'block';
                right[index].style.display = 'block';
            }
            tag[len].onmouseout = function(){
                left[index].style.display = 'none';
                right[index].style.display = 'none';
            }
        }
    }

    function toggleEvent(){
        var leftbtn = document.getElementsByClassName('slider-left-btn');
        var rightbtn = document.getElementsByClassName('slider-right-btn');
        var len = document.getElementsByClassName('slider-item').length;
        var lflen = leftbtn.length;
        var rglen = rightbtn.length;
        while(lflen--){
           leftbtn[lflen].onclick = function (){
                var tag = document.getElementsByClassName('za-slider-flex');
                for(var i=0,l=tag.length;i<l;i++){
                    var client = -tag[i].clientWidth;
                    console.log((len-1)===itemLen);
                    if((len-1)===itemLen&&!ZaSlider.configs.isLoop){
                        console.log('left no item');
                        return ;
                    }
                    if((len-1)===itemLen&&ZaSlider.configs.isLoop){
                        itemLen = 0;
                        tag[i].style.transition = "0s";
                    }else{
                        itemLen += 1;
                        tag[i].style.transition = "1s";
                    }
                    
                    slide(tag[i], client*itemLen);
                    
                }
            };
        }
        while(rglen--){
            rightbtn[rglen].onclick = function (){
                var tag = document.getElementsByClassName('za-slider-flex');
                for(var i=0,l=tag.length;i<l;i++){
                    var client = -tag[i].clientWidth;
                    console.log(0===itemLen);
                    if(0===itemLen&&!ZaSlider.configs.isLoop){
                        console.log('right no item');
                        return ;
                    }
                    if(0===itemLen&&ZaSlider.configs.isLoop){
                        itemLen = len-1;
                        tag[i].style.transition = "0s";
                    }else{
                        itemLen = itemLen-1;
                        tag[i].style.transition = "1s";
                    }
                    console.log(client*itemLen);
                    slide(tag[i], client*itemLen);
                    
                }
            };
        }
        hoverSlider();
    }

    function createContainerNode(parent, node){
        var outer = node.outerHTML,
        attrs = node.attributes,
        a_len = attrs.length,
        divNode = document.createElement('div'),
        tag1 = '<za-slider',
        tag2 = '</za-slider>',
        cloneNode,
        left,
        right;

        divNode.innerHTML = outer.replace(tag1, '<div').replace(tag2, '</div>');
        divNode.setAttribute('class', 'slider');
        divNode.firstChild.classList.add('slider-container');
        parent.replaceChild(divNode, node);

        left = document.createElement('div');
        left.setAttribute('class', 'slider-left-btn');
        left.innerHTML = '<';
        right = document.createElement('div');
        right.setAttribute('class', 'slider-right-btn');
        right.innerHTML = '>';
        divNode.firstChild.appendChild(left);
        divNode.firstChild.appendChild(right);

        // ZaSlider.configs.isAuto&&auto();
        if(ZaSlider.configs.isAuto){
            autoTimer = setInterval(function (){
               auto();
            }, ZaSlider.configs.duration);
        }
        
        toggleEvent();
    }
    /**
     *生成新的dom
    */
    function createItemNode(parent, node){
        var outer = node.outerHTML,
        attrs = node.attributes,
        a_len = attrs.length,
        divNode = document.createElement('div'),
        classname = 'slider-item',
        tag1 = '<za-slider-item',
        tag2 = '</za-slider-item>',
        cloneNode;

        divNode.innerHTML = outer.replace(tag1, '<div').replace(tag2, '</div>');
        cloneNode = divNode.firstChild.cloneNode(true);

        cloneNode.classList.add(classname);
        node.remove();
        // parent.replaceChild(cloneNode, node);
        divNode.remove();
        return cloneNode;
    }

    function getElements(){
        elements = document.getElementsByTagName('za-slider');
        var items = elements[0].children,
        len = items.length,
        html = [],
        div = document.createElement('div'),
        frag = document.createDocumentFragment();

        div.setAttribute('class', 'za-slider-dian-container'),
        flexNode = document.createElement('div'),
        flexNode.setAttribute('class', 'za-slider-flex');
        elements[0].appendChild(flexNode);
        elements[0].appendChild(div);
        while(len--){
            html[len] = createItemNode(items[len].parentNode, items[len]).outerHTML;

            var el = document.createElement('i');
            el.setAttribute('class', 'za-slider-toast')
            frag.appendChild(el);
        }
        flexNode.innerHTML = html.join('');
        div.appendChild(frag);
        createContainerNode(elements[0].parentNode, elements[0]);
    }

    ZaSlider.initConfig = function(config){
        if (hasInited == true) {
            console.log('Don\'t repeat initialization!');
            return ;
        }

        hasInited = true;
    }

    /**
     * [slide slide translateX]
     * @param  {[number]} translate [位移量]
     * @return {[type]}           [description]
     */
    function slide(el, offset){
        el.style.transform = "translateX("+offset+"px)";
    }

    /**
     * auto init config
    **/
    window.addEventListener("DOMContentLoaded", function() {
        getElements();
        if (hasInited == false) {
            ZaSlider.initConfig(defaultConfig);
        }
    });

    console.log(ZaSlider);
    document.ZASLIDELOAD = true;
        
    return ZaSlider;
});
