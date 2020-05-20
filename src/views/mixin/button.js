import {
    mapState
} from "vuex";
let itemsss = {}

function getItem(arr, path) {

    arr.forEach(item => {
        if (item.menuType == "F" && item.children && item.children.length > 0) {
            getItem(item.children, path);
        } else {
            if (item.menuUrl == path) {
                itemsss = item;
            }
        }
    })

}
let MIXIN = {
    data() {
        return {
            name: 'mixin',
            clickMenuId: "",
            PERMISSON:{
            },
        }
    },
    created() {


    },
    mounted() {
        this.getMenuNode();


    },
    methods: {
        getMenuNode() {
            getItem(this.items, this.$route.path.substr(1));
           
            this.clickMenuId = itemsss.menuId;
            if (itemsss.buttonPerms && itemsss.buttonPerms.length > 0) {
                let list=itemsss.buttonPerms.split(",");
                list.forEach(item=>{
                    this.PERMISSON[item]=true;
                })
            }

        },





    },
    watch: {
        items(val) {
            if (val && val.length > 0) {

                this.getMenuNode();
            }

        }

    },
    computed: {
        ...mapState({
            items: state => state.main.items
        })
    },
};
export default MIXIN;
