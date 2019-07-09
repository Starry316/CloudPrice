<template>

  <el-container  class="user-container" v-loading="loading">
      <el-row :gutter="20" style="width: 100%">
        <el-col  :xs="24" :sm="24" :md="8" :lg="6" :xl="6" style="margin-bottom: 16px;padding:16px" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="avatarUrl" width="100%">

            <div style="padding: 14px;">
              <span style="text-align: center"><h3>{{name}}</h3></span>

              <div class="bottom clearfix">
                <el-row>

                  <el-col :span="8" :offset="16">
                    <el-upload
                      action="/back/api/user/avatar/upload/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      multiple
                      :before-upload="beforeAvatarUpload"
                      style="display: inline">
                      <el-popover
                        placement="bottom"
                        width="160"
                        trigger="hover">
                        <div style="text-align: center; margin: 0">
                          上传头像
                        </div>
                        <el-button
                          style="float: right" type="primary"
                          icon="el-icon-upload2"
                          slot="reference"
                          circle>
                        </el-button>
                      </el-popover>
                    </el-upload>
                    <el-popover
                      placement="bottom"
                      width="160"
                      trigger="hover">
                      <div style="text-align: center; margin: 0">
                        修改信息
                      </div>
                      <el-button
                        v-if="!isEditing"
                        slot="reference"
                        @click="editProfile" style="float: right" type="warning" icon="el-icon-edit" circle></el-button>
                        <!--@click="editProfile" style="float: right" type="warning" icon="el-icon-edit" circle></el-button>-->
                    </el-popover>
                     <el-button
                      v-if="isEditing"
                      @click="editCancel" style="float: right" type="danger" icon="el-icon-edit" circle></el-button>
                    <!--<el-button type="text" class="button">操作按钮</el-button>-->
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col  :xs="24" :sm="24" :md="16" :lg="18" :xl="18" style="background-color: white;padding:16px">
        <el-card >
            <h3>个人信息</h3>
            <span v-if="!isEditing">{{userIntroduction}}</span>
            <!--个人介绍修改框-->
            <el-input v-if="isEditing" style="margin-bottom: 1rem"
                      type="textarea"
                      placeholder="请输入内容"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      v-model="userIntroduction"
                      maxlength="30"
                      show-word-limit>
            </el-input>
            <!--个人介绍修改框结束-->


            <h3>联系方式</h3>
            <span v-if="!isEditing">电话： {{telephone}}<br><br></span>
            <span v-if="!isEditing">邮箱： {{userEmail}}</span>


            <!--电话信息-->
            <label v-if="isEditing">电话： </label>
            <el-input v-if="isEditing" style="margin-bottom: 1rem"
                      type="text"
                      placeholder="请输入内容"
                      v-model="telephone">
            </el-input>

            <!--邮箱信息-->
            <label v-if="isEditing">邮箱： </label>
            <el-input v-if="isEditing" style="margin-bottom: 1rem"
                      type="text"
                      placeholder="请输入内容"
                      v-model="userEmail">
            </el-input>

            <el-button
              v-if="isEditing"
              @click="saveProfile"
              style="float: right"
              type="primary"
              round>
                Save
            </el-button>

        </el-card>
        </el-col>
      </el-row>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { modifyProfile, getInfo} from "../../api/user";
import ThemePicker from '@/components/ThemePicker'


export default {

  data() {
    return {
      userIntroduction:'用户个人介绍',
      // 使用isEditing 标识页面编辑状态
      isEditing: false,
      telephone:'',
      userEmail:'starry@123.com',
      loading:false,
      avatarUrl:'',
      uploadAvatarUrl:'https://jsonplaceholder.typicode.com/posts/'
      // uploadAvatarUrl:'http://localhost:8081/api/user/avatar/upload/'
    }
  },
  watch: {

  },

  methods: {
    // test(){
    //   this.$store.commit('user/SET_EMAIL', this.userEmail)
    //   this.$store.commit('user/SET_INTRODUCTION', this.introduction)
    // },
    init() {
      this.avatarUrl = this.$store.getters.avatar
      this.userEmail = this.$store.getters.email
      this.userIntroduction = this.$store.getters.introduction
      this.telephone = this.$store.getters.phone

      //alert(this.$store.getters.name)
    },
    editProfile(){
      this.isEditing = true;
    },
    editCancel(){
      this.isEditing = false;
    },
    showLoading(){
      this.loading = true;
    },
    hideLoading(){
      this.loading = false;
    },
    saveProfile(){
      this.showLoading();
      this.isEditing = false;
      let data = {
        introduction: this.userIntroduction,
        phone: this.telephone,
        email:this.userEmail
      }
      modifyProfile(data).then(respone =>{
        // let data = respone.data
        // this.introduction = data.introduction
        // this.telephone = data.telephone
        // this.userEmail = data.email
        this.$store.commit('user/SET_EMAIL', this.userEmail)
        this.$store.commit('user/SET_INTRODUCTION', this.userIntroduction)


        this.hideLoading();
        this.$message({
          message: '修改成功！',
          type: 'success'
        });
      }).catch(e =>{
        this.hideLoading();
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(res.data)
      this.hideLoading()
      this.$message.success("上传成功")
      this.avatarUrl = "/back/file/"+res.data

      this.$store.commit('user/SET_AVATAR', this.avatarUrl)
    },
    beforeAvatarUpload(file) {
      this.showLoading()
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
        this.hideLoading()
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        this.hideLoading()
      }
      return isJPG && isLt2M;
    },

  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'email',
      'phone',
      'introduction'
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

    /*background-color: #f0f2f5;*/
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

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

