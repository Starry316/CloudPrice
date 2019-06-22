<template>

  <div class="user-container" v-loading="loading">
    <h3>爬虫配置</h3>
    <el-container >
      <el-container>
        <el-aside width="20%" style="margin-right: 1rem;" >

        </el-aside>
        <el-container style="background-color: white">
          <el-main>

          </el-main>

        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { modifyProfile} from "../../api/user";


export default {

  data() {
    return {

      loading:false
    }
  },
  watch: {

  },

  methods: {
    init() {

      //alert(this.$store.getters.name)
    },

  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },

  mounted(){
    this.init();
  }
}
</script>
<style scoped>
  .user-container{
    padding: 32px;
    background-color: #f0f2f5;
    position: relative;
  }
</style>

