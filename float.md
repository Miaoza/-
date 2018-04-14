w3cScool:
float 属性定义元素在哪个方向浮动。以往这个属性总应用于图像，使文本围绕在图像周围，不过在 CSS 中，任何元素都可以浮动。浮动元素会生成一个块级框，而不论它本身是何种元素。
如果浮动非替换元素，则要指定一个明确的宽度；否则，它们会尽可能地窄。
注释：假如在一行之上只有极少的空间可供浮动元素，那么这个元素会跳至下一行，这个过程会持续到某一行拥有足够的空间为止。


浮动的元素，高度会塌陷，所以布局中需要清除浮动
BFC（Block Formatting Context）:“块级格式化范围”
浮动元素会形成BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的


来源：http://www.iyunlu.com/view/css-xhtml/55.html
清除浮动的方法：
1.添加额外标签<div style="clear:both"></div>
2.使用br标签和其自身的html属性 <br clear="all" /> (br有clear=“all|left|right|none”属性)
3.父元素设置 overflow:hidden/overflow:auto 
通过设置父元素overflow值设置为hidden/auto;在IE6中还需要触发hasLayout,例如 zoom:1
4.父元素也设置浮动(会产生新的浮动问题)
5.父元素设置display:table(盒模型属性已经改变，由此造成的一系列问题)
6.使用:after 伪元素(:after是伪元素,不是伪类)
  由于IE6-7不支持:after，使用 zoom:1触发 hasLayout



那么如何触发BFC呢？
1.float 除了none以外的值  
2.overflow 除了visible 以外的值（hidden，auto，scroll ） 
3.display (table-cell，table-caption，inline-block) 
4.position（absolute，fixed）  
5.fieldset元素
