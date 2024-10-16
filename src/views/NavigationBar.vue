<script>
export default {
  data() {
    return {
      userData: null, // 用于存储从 login 组件返回的用户数据
    };
  },
  methods: {
    // 跳转到登录页面
    goToLogin() {
      this.$router.push({ path: "/login" });
    },

  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; width: 15vw; height: 95vh">

    <div style="font-size: 1.5em; margin-bottom: 1em">
      LLM Platform
    </div>

    <div style="display: flex; flex-direction: column; gap: 1em">
      <div @click="this.$router.push({path: '/'});" style="cursor: pointer">
        主页
      </div>
      <div @click="this.$router.push({path: '/PersonalPage'});" style="cursor: pointer">
        个人空间
      </div>
      <div @click="this.$router.push({path: '/BotShop'});" style="cursor: pointer">
        Bot 商店
      </div>
      <div>
        导出用户入账流水
      </div>
      <div>
        导出Bot评分
      </div>
      <div @click="goToLogin" style="cursor: pointer">
      登录
      </div>
    </div>

    <div>
      <!-- 显示用户信息 -->
      <div v-if="userData" style="margin-top: auto;">
        <div>
          <img :src="userData.avatar" alt="用户头像" style="width: 50px; height: 50px;" />
        </div>
        <div>
          用户名: {{ userData.username }}
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>