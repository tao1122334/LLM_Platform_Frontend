<script>
import IconCommunity from '@/components/icons/IconCommunity.vue';
import IconSupport from '@/components/icons/IconSupport.vue';
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import IconEcosystem from "@/components/icons/IconEcosystem.vue";
import IconTooling from "@/components/icons/IconTooling.vue";

export default {
  name: 'Home',
  components: {
    IconTooling,
    IconEcosystem,
    IconDocumentation,
    IconCommunity,
    IconSupport
  },
  data() {
    return {
      showSettings: false, // 控制设置菜单显示
      isTempChatEnabled: false, // 控制临时聊天开关
      isAdmin: false, // 假设当前用户是管理员
      messages: [ // 示例消息数据
        { text: "你好！", sender: "me" },
        { text: "欢迎来到LLM ！", sender: "assistant" },
        { text: "以下是新消息", sender: "system" },
        { text: "这是一条新消息", sender: "assistant" }
      ],
      newMessage: "", // 新消息内容
      hoveredIcon: "" // 用于追踪悬停图标状态
    };
  },
  methods: {
    // 切换设置菜单显示
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    hideMenu() {
      this.showSettings = false;
    },
    handleOutsideClick(event) {
      // 使用 composedPath 获取事件传播路径
      const path = event.composedPath();

      // 通过检查路径中的 class 名称来判断是否在指定区域
      const isInsideButton = path.some(element => element.classList && element.classList.contains('settings-button'));
      const isInsideDropdown = path.some(element => element.classList && element.classList.contains('settings-dropdown'));

      // 如果点击的不是按钮或菜单区域，则关闭菜单
      if (!isInsideButton && !isInsideDropdown) {
        this.hideMenu();
      }
    }
    ,
    // 发送消息
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        // 将消息先暂时添加到本地消息列表中
        this.messages.push({ text: this.newMessage, sender: "me" });
        // 调用 API 发送消息
        try {
          const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: this.newMessage })
          });
          if (!response.ok) {
            throw new Error('Failed to send message');
          }
        } catch (error) {
          console.error("发送消息失败:", error);
        }
        // 清空输入框
        this.newMessage = "";
      }
    },

    // 接收来自服务器的新消息
    async receiveMessages() {
      try {
        const response = await fetch('/api/chat/receive');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        // 假设后端返回的是一个消息数组
        this.messages = [...this.messages, ...data.messages];
      } catch (error) {
        console.error("接收消息失败:", error);
      }
    },

    // 切换临时聊天开关
    toggleTempChat() {
      this.isTempChatEnabled = !this.isTempChatEnabled;
      if (this.isTempChatEnabled) {
        this.messages.push({ text: '临时聊天已经启动', sender: "system" });
      }else {
        this.messages.push({ text: '临时聊天已经关闭', sender: "system" });
      }
    },
    // 菜单项点击事件
    deleteChatHistory() {
      // 清空消息列表
      this.messages = [];
      this.messages.push({ text: '之前的聊天记录已清空，以下是新消息', sender: "system" });
      alert("对话记录已删除（模拟功能）");
      console.log("对话记录已删除");
      this.hideMenu();
    },
    addToDesktop() {
      alert("已添加到桌面（模拟功能）");
      console.log("已添加到桌面");
      this.hideMenu();
    },
    manageAuthorization() {
      alert("进入授权管理（模拟功能）");
      console.log("进入授权管理");
      this.hideMenu();
    },
    reportIssue() {
      alert("举报成功（模拟功能）");
      console.log("已举报");
      this.hideMenu();
    },
    copyLink() {
      // 模拟复制链接
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("链接已复制到剪贴板");
        console.log("链接已复制");
      }).catch(err => {
        console.error("复制链接失败", err);
      });
      this.hideMenu();
    },
    showTooltip(iconName) {
      this.hoveredIcon = iconName;
    },
    hideTooltip() {
      this.hoveredIcon = "";
    }
  },
  mounted() {
    // 页面加载时开始接收消息
    this.receiveMessages();
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // 每隔0.5秒检查一次新消息
   // this.messagePolling = setInterval(this.receiveMessages, 5000);
  },

  beforeDestroy() {
    //clearInterval(this.messagePolling);
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }
};
</script>

<template>
  <div class="home-container">
    <!-- 左边：临时聊天相关设置 -->
    <aside class="left-sidebar">
      <div class="switch-container">
        <span class="text">临时聊天开关</span>
        <label class="switch">
          <input type="checkbox" v-model="isTempChatEnabled" @click="toggleTempChat">
          <span class="slider"></span>
        </label>
      </div>
    </aside>

    <!-- 中间：聊天区域 -->
    <main class="chat-area">
      <section class="chat-box">
        <!-- 聊天消息列表 -->
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender === 'me' ? 'my-message' : message.sender === 'assistant' ? 'assistant-message' : 'center-message']">
          <!-- 左侧（assistant）头像 -->
          <IconEcosystem v-if="message.sender === 'assistant'" class="avatar"/>
          <p class="message-content" v-if="message.sender === 'assistant'||message.sender === 'me'">{{ message.text }}</p>
          <!-- 右侧（用户）头像 -->
          <IconTooling v-if="message.sender === 'me'" class="avatar"/>
          <!-- 居中消息（系统提示或分隔线） -->
          <template v-if="message.sender === 'system'">
            <div class="center-container">
              <div class="line"></div>
              <span class="center-text">{{ message.text }}</span>
              <div class="line"></div>
            </div>
          </template>
          <template v-if="message.sender === 'assistant'">
            <!-- 图标按钮组 -->
            <div class="icon-group">
              <div class="icon-item" @mouseover="showTooltip('volume')" @mouseleave="hideTooltip">
                <IconTooling class="icon-img"/>
                <div v-if="hoveredIcon === 'volume'" class="tooltip">朗读</div>
              </div>
              <div class="icon-item" @mouseover="showTooltip('copy')" @mouseleave="hideTooltip">
                <IconTooling class="icon-img"/>
                <div v-if="hoveredIcon === 'copy'" class="tooltip">复制</div>
              </div>
              <div class="icon-item" @mouseover="showTooltip('refresh')" @mouseleave="hideTooltip">
                <IconTooling class="icon-img"/>
                <div v-if="hoveredIcon === 'refresh'" class="tooltip">刷新</div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- 输入区域 -->
      <footer class="input-area">
        <textarea v-model="newMessage" placeholder="输入您的消息..." rows="2"></textarea>
        <button @click="sendMessage">发送</button>
      </footer>
    </main>

    <!-- 右边：设置菜单 -->
    <aside class="right-sidebar">
      <button class="settings-button" @click="toggleSettings">⋮</button>
      <div class="settings-dropdown" v-if="showSettings">
        <ul>
          <li @click="deleteChatHistory">
            <span class="menu-icon">🗑️</span>
            <span class="menu-text">删除对话记录</span>
          </li>
          <li @click="addToDesktop">
            <span class="menu-icon">➕</span>
            <span class="menu-text">添加到桌面</span>
          </li>
          <li @click="manageAuthorization">
            <span class="menu-icon">⚙️</span>
            <span class="menu-text">授权管理</span>
          </li>
          <li @click="reportIssue">
            <span class="menu-icon">⚠️</span>
            <span class="menu-text">举报</span>
          </li>
          <li @click="copyLink">
            <span class="menu-icon">🔗</span>
            <span class="menu-text">复制链接</span>
          </li>
          <li v-if="isAdmin" @click="">
            <span class="menu-icon"></span>
            <span class="menu-text">管理员设置</span>
          </li>
        </ul>
      </div>

    </aside>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* 左侧栏样式 */
.left-sidebar {
  width: 25%;
  padding: 20px;
  background-color: #f7f7f7;
  border-right: 1px solid #ddd;
}
/* 临时聊天开关容器 */
.switch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.text {
  margin-bottom: 10px;
  font-size: 16px;
}

/* 开关的基础样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* 滑块样式 */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px; /* 圆角 */
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  border-radius: 50%;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 中间聊天区域样式 */
.chat-area {
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;
}

.chat-box {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
}

/* 消息样式 */
.message {
  display: flex;
  margin: 10px 0;
}

/* 左侧的消息（assistant） */
.assistant-message {
  justify-content: flex-start;
}

.assistant-message .message-content {
  background-color: #e5e5ea;
  border-radius: 15px 15px 15px 0;
  padding: 10px;
  color: #000;
  max-width: 60%;
}

/* 右侧的消息（用户） */
.my-message {
  justify-content: flex-end;
}

.my-message .message-content {
  background-color: #007bff;
  border-radius: 15px 15px 0 15px;
  padding: 10px;
  color: white;
  max-width: 60%;
}

/* 系统提示消息（居中） */
.center-message {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

/* 居中消息容器 */
.center-container {
  display: flex;
  align-items: center;
  color: #a0a0a0;
  font-size: 14px; /* 较小字体 */
  width: 100%;
}

/* 居中消息左右两侧的分隔线 */
.line {
  height: 1px;
  background-color: #a0a0a0;
  flex-grow: 1; /* 自适应宽度 */
  margin: 0 10px; /* 间距 */
}

/* 居中消息的文字样式 */
.center-text {
  color: #a0a0a0;
  font-style: italic; /* 斜体显示 */
}

/* 头像样式 */
.avatar {
  width: 40px;
  height: 40px;
  margin: 0 10px;
  display: inline-flex; /* 确保组件对齐 */
  align-self: flex-start; /* 顶部对齐 */
}

/* 左侧（assistant）消息样式 */
.assistant-message {
  justify-content: flex-start;
  align-items: center; /* 确保头像与消息框垂直对齐 */
}

/* 右侧（用户）消息样式 */
.my-message {
  justify-content: flex-end;
  align-items: center; /* 确保头像与消息框垂直对齐 */
}

/* 图标组样式 */
.icon-group {
  display: flex;
  justify-content: flex-start; /* 图标左对齐 */
  margin-top: 5px; /* 与消息框之间的间距 */
  gap: 8px; /* 图标之间的间距 */
}

/* 单个图标容器 */
.icon-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer; /* 鼠标悬停时显示手型 */
}

/* 图标样式 */
.icon-img {
  width: 24px;
  height: 24px;
}

.tooltip {
  position: absolute;
  bottom: 30px; /* 位于图标上方 */
  left: 50%;
  transform: translateX(-50%); /* 居中对齐 */
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px; /* 较小的字体 */
  white-space: nowrap; /* 防止提示框内容换行 */
  z-index: 10; /* 显示在最上层 */
  opacity: 0;
  transition: opacity 0.3s ease; /* 添加淡入淡出效果 */
}

.icon-item:hover .tooltip {
  opacity: 1; /* 鼠标悬停时显示提示框 */
}

/* 输入框样式 */
.input-area {
  display: flex;
}

textarea {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  overflow-y: auto;
}

button {
  padding: 10px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 右侧栏样式 */
.right-sidebar {
  width: 25%;
  padding: 20px;
  background-color: #f7f7f7;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 固定设置按钮到右上角 */
.settings-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  color: black;
  border: none;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
}

/* 设置菜单弹出样式 */
.settings-dropdown {
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 200px;
}

.settings-dropdown ul {
  list-style-type: none;
  padding: 0;
}

.settings-dropdown li {
  margin: 5px 0;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu-icon {
  margin-right: 10px;
}

.settings-dropdown li:hover {
  background-color: #f0f0f0;
}
</style>
