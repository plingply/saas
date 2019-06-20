export default {
    data() {
        return {
            fysize: 10,
            pageSizes: [10, 20, 30, 40, 50],
            fy_layout: "total, sizes, prev, pager, next, jumper"
        }
    },

    computed: {
        campus_id() {
            return this.$store.state.campusID;
        }
    }

}