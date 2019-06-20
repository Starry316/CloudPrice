<template>

  <div class="user-container">
    <el-container >
      <el-container>
        <el-aside width="20%" style="margin-right: 1rem;" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="avatar" width="100%">
            <div style="padding: 14px;">
              <span style="text-align: center"><h3>{{name}}</h3></span>

              <div class="bottom clearfix">

                <el-button
                  v-if="!isEditing"
                  @click="editProfile" style="float: right" type="warning" icon="el-icon-edit" circle></el-button>
                <el-button
                  v-if="isEditing"
                  @click="editCancel" style="float: right" type="danger" icon="el-icon-edit" circle></el-button>
                <!--<el-button type="text" class="button">操作按钮</el-button>-->
              </div>
            </div>
          </el-card>
        </el-aside>
        <el-container style="background-color: white">
          <el-main>
            <div>
              <h3>个人信息</h3>
              <span v-if="!isEditing">{{introdution}}</span>
            </div>

            <el-input v-if="isEditing" style="margin-bottom: 2rem"
              type="textarea"
              placeholder="请输入内容"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="introdution"
              maxlength="30"
              show-word-limit>
            </el-input>

            <el-button
              v-if="isEditing"
              @click="saveProfile"
              style="float: right"
              type="primary"
              round>
                Save
            </el-button>

          </el-main>

        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  data() {
    return {
      introdution:'用户个人介绍',
      isEditing: false,
    }
  },
  watch: {

  },

  methods: {
    init() {

      //alert(this.$store.getters.name)
    },
    editProfile(){
      this.isEditing = true;
    },
    editCancel(){
      this.isEditing = false;
    },
    saveProfile(){
      //TODO
      this.isEditing = false;
    }
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
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .display-none{
    display: none;
  }
</style>

