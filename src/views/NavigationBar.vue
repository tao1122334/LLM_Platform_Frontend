<script>
export default {
  data() {
    return {
      userData: null, // 用于存储从 login 组件返回的用户数据
      botTable: null,
      userTable: null
    };
  },
  methods: {
    // 跳转到登录页面
    goToLogin() {
      this.$router.push({ path: "/login" });
    },

    // TODO: url:admin_bot  接收返回的文件，并且直接让用户下载 已完成
    // 发送请求获取机器人表，并让用户下载返回的文件
    async getBotTable() {
      try {
        const response = await this.$get('admin_bot/', null, 'botTable');
        this.downloadFile(response, 'bot_table.csv'); // 假设文件格式为 CSV，文件名为 bot_table.csv
      } catch (error) {
        console.error('获取机器人表失败:', error);
      }
    },
    // TODO: url:admin_user  接收返回的文件，并且直接让用户下载 已完成
    // 发送请求获取用户表，并让用户下载返回的文件
    async getUserTable() {
      try {
        const response = await this.$get('home/admin_user/', null, 'userTable');
        this.downloadFile(response, 'user_table.csv'); // 假设文件格式为 CSV，文件名为 user_table.csv
      } catch (error) {
        console.error('获取用户表失败:', error);
      }
    },

    downloadFile(data, filename) {
      try {
        const blob = new Blob([data], {type: 'application/octet-stream'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // 释放 URL 对象
      } catch (error) {
        console.error('文件下载失败:', error);
      }
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
      <div @click="getUserTable" style="cursor: pointer">
        导出用户入账流水
      </div>
      <div @click="getBotTable" style="cursor: pointer">
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