<template>
  <div class="app-container">
    <div><h2>用户管理</h2></div>

  </div>
</template>

<script>
export default {

  data() {
    return {


    }
  },
  watch: {

  },

  methods: {
    init() {

      alert(this.$store.getters.name)
    }
  },

  mounted(){
    this.init();
  }
}
</script>

