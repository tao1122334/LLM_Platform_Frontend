<script>


export default {
  data() {
    return {
      userData: null, // 用于存储从 login 组件返回的用户数据
      botTable: null,
      userTable: null,
      isVisible: false, // 控制列表的显示和隐藏
      isTable: false,
    };
  },
   mounted() {
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  },
   computed: {
    displayStyle() {
      console.log(this.isVisible);
      return this.isVisible ? 0.5 : 0;
    },
    transition_style() {
      return {
        transition: 'display 1s ease',
      };
    }
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
    toggleVisibility() {
      this.isVisible = !this.isVisible;
      this.isTable =!this.isTable;
      console.log("isVisible",this.isVisible);
      console.log("isTable",this.isTable);
    },

     handleMouseMove(event) {
      const x = event.clientX;
      if(!this.isTable){
        if (x < 100) { // 当鼠标靠近屏幕左边时
        this.isVisible = true;
        console.log('隐藏边栏');
         console.log("isVisible",this.isVisible);
      console.log("isTable",this.isTable);
      } else {
        this.isVisible = false;
        console.log('显示边栏');
         console.log("isVisible",this.isVisible);
      console.log("isTable",this.isTable);
      }

      }
      else{
        this.isVisible=true
      }
    },
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; width: 15vw; height: 95vh" class="list" >

    <div style="font-size: 1.5em ; margin-bottom: 1em" >
      LLM Platform
      <button id="toggleButton" class="button-flat" @click="toggleVisibility" v-if="isVisible">
  {{ isTable ? '隐藏边栏' : '显示边栏' }}
    </button>

    </div >


     <div :style="{ display: displayStyle, transition: transition_style, opacity: isVisible ? 1 : 0, 'flex-direction': 'column', gap: '1em'}" class="list" >

      <div @click="this.$router.push({path: '/'});" style="cursor: pointer;margin-top: 40px" class="button-flat" v-if="isVisible">
        主页
      </div>
      <div @click="this.$router.push({path: '/PersonalPage'});" style="cursor: pointer" class="button-flat" v-if="isVisible">
        个人空间
      </div>
      <div @click="this.$router.push({path: '/BotShop'});" style="cursor: pointer" class="button-flat" v-if="isVisible">
        Bot 商店
      </div>
      <div @click="getUserTable" style="cursor: pointer" class="button-flat"  v-if="isVisible">
        导出用户入账流水
      </div>
      <div @click="getBotTable" style="cursor: pointer" class="button-flat" v-if="isVisible">
        导出Bot评分
      </div>
      <div @click="goToLogin" style="cursor: pointer" class="button-flat" v-if="isVisible">
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

.button-flat {
  padding: 16px 8px;
  font-size: 18px;
  background: rgba(85, 85, 85, 0.18);
  color: #0b0909;
  border-radius: 10px;
  cursor: pointer;
  border: slategray;
  transition: all 0.5s ease;
  opacity: 1;
  text-align: center;
  width: 90%;
  margin-top: 15px;
}
.button-flat:hover {
  background-color: #404145; /* 鼠标悬停时的背景颜色 */
}



.list {
  display: flex;
  flex-direction: column;
  gap: 2em; /* 这将在 flex 子项之间创建间隔 */
  opacity: 0.8;
  transition: opacity 0.5s ease; /* 平滑过渡效果 */

}

.menu-bar {
  position: fixed;
  left: -50%; /* 初始状态在屏幕外 */
  top: 50%;
  transform: translateY(-50%);
  transition: left 0.3s ease-in-out;
  background-color: #333;
  color: white;
  padding: 10px;
  z-index: 1000;
}
</style>