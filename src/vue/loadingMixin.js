// vue element-ui loading mixins

export default {
    data() {
        return {
            fullScreenLoading: null,
        }
    },
    methods: {
        openLoading(text = '加载中') {
            this.fullScreenLoading = this.$loading({
                lock: true,
                text,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
        },
        closeLoading() {
            this.fullScreenLoading && this.fullScreenLoading.close()
        },
    },
}
