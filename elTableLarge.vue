<!-- 未解决fixed错位bug -->


<el-table ref=“table" class=“large-table” row-key=“key">
</el-table>

<style lang=“scss” scoped>
    .large-table{
        /deep/ .el-table__body-wrapper{
            max-height: 400px;
            Overflow-y: auto;
        }
    }
</style>

<script>
export default{
    props: {
        tableData: {
            type: Array,
            default: []
        }
    },
    computed: {
        originData(){
            return this.tableData.map((item, i)=>({…item, key:i}))
        },
        // 显示列表数据
        showData(){
            const table = this.originData.slice(this.limit, Math.floor(this.limit+15, this.originData.length))
            return table
        }，
        // Y轴偏移量
        getTransfrom(){
            return `translate3d(0,${this.startOffset}px,0)`
        }
    },
    data(){
        return {
            limit: 0, // 可视区域数据起始索引
            startOffset: 0 // Y轴偏移量
        }
    },
    watch: {
        getTransfrom: function(){
            document.query(‘.el-table__body’).style.transform = this.getTransform
        }
    },
    mounted(){
        const bodyWrapper = this.$refs[’table’].bodyWrapper
        bodyWrapper.addEventListener(’scoll’, this.handleScroll, true) // 添加监听事件
    },
    destroyed(){
        // 离开页面移除监听事件
        const bodyWrapper = this.$refs[’table’].bodyWrapper
        bodyWrapper.removeEventListener(’scoll’, this.handleScroll, true) // 添加监听事件
    },
    methods: {
        //  滚动监听事件
        handleScroll(){
            const itemHeight = 40 // 行高
            const bodyWrapper = this.$refs[’table’].bodyWrapper
            const scrollTop = bodyWrapper.scrollTop
            //  开始索引
            this.limit = Math.floor(scrollTop/itemHeight)
            // 滚动时列表容器的偏移量
            this.startOffset = scrollTop - (scrollTop%itemHeight)
        }
    }
}
</script>
