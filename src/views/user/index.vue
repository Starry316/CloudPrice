<template>

  <div class="user-container" v-loading="loading">

    <el-container >
      <el-container>
        <el-aside width="20%" style="margin-right: 1rem;" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="avatar" width="100%">

            <div style="padding: 14px;">
              <span style="text-align: center"><h3>{{name}}</h3></span>

              <div class="bottom clearfix">
                <el-row>

                  <el-col :span="8" :offset="16">
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
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
        </el-aside>
        <el-container style="background-color: white">
          <el-main>
            <!--个人介绍-->
            <h3>个人信息</h3>
            <span v-if="!isEditing">{{introduction}}</span>
            <!--个人介绍修改框-->
            <el-input v-if="isEditing" style="margin-bottom: 1rem"
                      type="textarea"
                      placeholder="请输入内容"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      v-model="introduction"
                      maxlength="30"
                      show-word-limit>
            </el-input>
            <!--个人介绍修改框结束-->


            <h3>联系方式</h3>
            <span v-if="!isEditing">电话： {{telephone}}<br><br></span>
            <span v-if="!isEditing">邮箱： {{email}}</span>


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
                      v-model="email">
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
import { modifyProfile} from "../../api/user";
import ThemePicker from '@/components/ThemePicker'


export default {

  data() {
    return {
      introduction:'用户个人介绍',
      // 使用isEditing 标识页面编辑状态
      isEditing: false,
      telephone:'18340018269',
      email:'starry@123.com',
      loading:false
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
        introduction: this.introduction,
        telephone: this.telephone,
        email:this.email
      }
      modifyProfile(data).then(respone =>{
        let data = respone.data
        this.introduction = data.introduction
        this.telephone = data.telephone
        this.email = data.email
        // loading.close();
        this.hideLoading();
        this.$message({
          message: '修改成功！',
          type: 'success'
        });
      });
    },
    handleAvatarSuccess(res, file) {
      this.avatar = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

