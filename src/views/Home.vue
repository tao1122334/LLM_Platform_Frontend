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
      isAdmin: true, // 假设当前用户是管理员
      showAdminSettings: false, // 控制管理员设置显示
      messages: [ // 修改后的消息数据结构
        {
          text: "你好！",
          image: "src/assets/login.jpg",
          file: "",
          sender: "me"
        },
        {
          text: "欢迎来到LLM ！",
          image: "",
          file: "",
          sender: "assistant"
        },
        {
          text: "以下是新消息",
          image: "src/assets/login.jpg",
          file: "",
          sender: "system"
        }
      ],
      newMessage: "",  // 新消息内容
      uploadedFile: null,
      hoveredIcon: "", // 用于追踪悬停图标状态
      formData: {
        defaultBot: 'GPT 3.5',  // 默认选项
        maxRate: 100000000,  // 最大频率
        gpt35Cost: 0,  // GPT 3.5 花费
        gpt40Cost: 0,  // GPT 4.0 花费
        gpt40MiniCost: 0  // GPT 4.0 mini 花费
      },
      data: null,
      bot_id: 3,
      group_id: 1,
      url: '',
      user_id: null,

    };
  },

  created() {
    this.userId = this.$route.query.id;
  },
  watch: {
    '$route'(newQuery) {
      this.userId = newQuery.id;
    }
  },
  methods: {
    // 切换设置菜单显示
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    toggleAdminSettings() {
      this.showAdminSettings = !this.showAdminSettings;
      this.hideMenu();
    },
    closeModal() {
      this.showAdminSettings = false;
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
    },
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({ text:this.newMessage, sender: "me" });
        this.url = 'chat/'+ this.bot_id + '/' + this.group_id + '/';
        const form = new FormData();
        form.append('chat_method', 'common');
        form.append('chat_content', this.newMessage);
        form.append('userfile', this.uploadedFile);
        await this.$post(this.url, null, form, 'data');
        this.messages.push({ text: this.data.fields.bot_text+" | "+this.data.chat_method, sender: "assistant" });
        this.newMessage = "";
      }else {
        alert("消息不能为空");
      }
    },
    async getAdminSettings() {
      try {
        await this.$get('admin/settings/', null, 'data');
      } catch (error) {
        console.error("获取管理员设置失败:", error);
      }
    },
    async postAdminSettings() {
      try {
        await this.$post('post_user_rating/', null, this.formData, 'data');
      } catch (error) {
        console.error("提交管理员设置失败:", error);
      }
    },
    async receiveMessages() {
      try {
        await this.$get('home/', null, 'data');
      } catch (error) {
        console.error("接收对话消息失败:", error);
      }
    },
    isImage(filePath) {
      return filePath && (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.gif'));
    },
    // api
    handleSubmit() {
      // 提交表单数据，并通过事件返回到父组件
      this.$post('submit', null, this.formData, 'data');
      this.formData = {
        defaultBot: 'GPT 3.5',
        maxRate: 100000000,
        gpt35Cost: 0,
        gpt40Cost: 0,
        gpt40MiniCost: 0
      };
      this.closeModal();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFile = file;
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
    // TODO: url: del_messagelist method: DELETE 并且记得更新message
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
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    //TODO: 向后端请求主页的消息记录，并且将message设置为请求的列表  method: GET url: messagelist
  },

  beforeDestroy() {
    //clearInterval(this.messagePolling);
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }
};
</script>

<!--TODO: 输入栏输入@的时候弹出弹窗，弹窗中有列表，选择之后在输入框上方显示正在对话的机器人名字-->
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
        <!-- 聊天消息列表区域 -->
        <section class="chat-box">
          <!-- 使用 v-for 循环渲染每条消息 -->
          <div v-for="(message, index) in messages"
               :key="index"
               :class="['message', message.sender === 'me' ? 'my-message' : message.sender === 'assistant' ? 'assistant-message' : 'center-message']">

            <!-- 左侧（机器人 assistant）头像使用内联 <img> 标签渲染 -->
            <img v-if="message.sender === 'assistant'"
                 :src="message.image"
                 alt="机器人头像"
                 class="avatar"
                 style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"
                 loading="lazy" />

            <!-- 聊天内容 -->
            <p class="message-content" v-if="message.sender === 'assistant' || message.sender === 'me'">{{ message.text }}</p>

            <!-- 右侧（用户 me）头像使用内联 <img> 标签渲染 -->
            <img v-if="message.sender === 'me'"
                 :src="message.image"
                 alt="用户头像"
                 class="avatar"
                 style="width: 40px; height: 40px; border-radius: 50%; margin-left: 10px;"
                 loading="lazy" />

            <!-- 居中（系统提示 system）消息 -->
            <template v-if="message.sender === 'system'">
              <div class="center-container">
                <div class="line"></div>
                <span class="center-text">{{ message.text }}</span>
                <div class="line"></div>
              </div>
            </template>

            <!-- 显示用户上传的文件（如果是图片格式） -->
            <img v-if="isImage(message.file)&&message.sender === 'me'"
                 :src="message.file"
                 alt="用户上传的图片"
                 class="message-file"
                 style="max-width: 200px; margin: 10px 0;"
                 loading="lazy" />

            <!-- 显示机器人回复的文件（如果是图片格式） -->
            <img v-if="isImage(message.file)&&message.sender === 'assistant'"
                 :src="message.file"
                 alt="机器人回复的图片"
                 class="message-file"
                 style="max-width: 200px; margin: 10px 0;"
                 loading="lazy" />
          </div>
        </section>

      <!-- 输入区域 -->
      <footer style="display: flex; align-items: center; border-top: 1px solid #ddd; padding: 10px; background-color: #f7f7f7; position: sticky; bottom: 0; width: 100%;">
        <label for="file-upload" style="cursor: pointer; margin-right: 10px; position: relative;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
            <path d="M21.44 11.05l-8.84 8.84a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.19 9.19a2 2 0 0 1-2.83-2.83l8.84-8.84"/>
          </svg>
          <input id="file-upload" type="file" @change="handleFileUpload" style="display: none;" />
          <span style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #000; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 12px; visibility: hidden; white-space: nowrap;" class="tooltip">附加文件</span>
        </label>
        <textarea v-model="newMessage"
                placeholder="输入您的消息..."
                rows="2"
                style="flex-grow: 1; border: 1px solid #ddd; border-radius: 4px; padding: 10px; resize: none; overflow-y: auto;"></textarea>
        <button @click="sendMessage"
                style="padding: 10px 20px; margin-left: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.3s;">
          发送
        </button>
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
          <li v-if="isAdmin" @click="toggleAdminSettings">
            <span class="menu-icon"></span>
            <span class="menu-text">管理员设置</span>
          </li>
        </ul>
      </div>
    </aside>

    <div v-if="showAdminSettings" class="modal-background">
      <div class="modal-content">
        <h3>管理员设置窗口</h3>

        <!-- 默认 BOT 选择 -->
        <div class="form-group">
          <label for="defaultBot">默认BOT:</label>
          <select id="defaultBot" v-model="formData.defaultBot">
            <option value="GPT 3.5">GPT 3.5</option>
            <option value="GPT 4.0">GPT 4.0</option>
            <option value="GPT 4.0 mini">GPT 4.0 mini</option>
          </select>
        </div>

        <!-- 使用最大频率 -->
        <div class="form-group">
          <label for="maxRate">使用最大频率:</label>
          <input type="number" id="maxRate" v-model="formData.maxRate" />
        </div>

        <!-- 每次问答 token 花费 -->
        <h4>每次问答 token 花费</h4>
        <div class="form-group">
          <label for="gpt35">GPT 3.5:</label>
          <input type="number" id="gpt35" v-model="formData.gpt35Cost" />
        </div>
        <div class="form-group">
          <label for="gpt40">GPT 4.0:</label>
          <input type="number" id="gpt40" v-model="formData.gpt40Cost" />
        </div>
        <div class="form-group">
          <label for="gpt40mini">GPT 4.0 mini:</label>
          <input type="number" id="gpt40mini" v-model="formData.gpt40MiniCost" />
        </div>

        <!-- 按钮组 -->
        <div class="button-group">
          <button @click="handleSubmit">确定</button>
          <button @click="closeModal">取消</button>
        </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  height: 100%;
  width: 100%;
  flex-grow: 1;
}
/*-------------------------------------------------------------------------------*/
/* 左侧栏样式 */
.left-sidebar {
  width: 20%;
  padding: 20px;
  background-color: #f7f7f7;
  border-right: 1px solid #ddd;
  flex-grow: 1;
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
/*-------------------------------------------------------------------------------*/
/* 中间聊天区域样式 */
.chat-area {
  width: 60%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;
  flex-grow: 1;
}
.chat-box {
  height: calc(100% - 60px);
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

.message-content {
  background-color: #007bff;
  border-radius: 15px 15px 0 15px;
  padding: 10px;
  color: white;
  max-width: 60%;
}

/* 图片消息样式 */
.message-image {
  margin: 10px 0;
  max-width: 200px;
  border-radius: 8px;
}

/* 文件消息样式 */
.message-file {
  color: #007bff;
  text-decoration: underline;
  margin: 10px 0;
  cursor: pointer;
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

/*-------------------------------------------------------------------------------*/
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

.sendButton {
  padding: 10px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.sendButton:hover {
  background-color: #888; /* 鼠标悬停时按钮颜色 */
}

/*-------------------------------------------------------------------------------*/
/* 右侧栏样式 */
.right-sidebar {
  width: 25%;
  padding: 20px;
  background-color: #f7f7f7;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 子元素水平方向靠右对齐 */
  justify-content: flex-start;  /* 子元素水平方向靠右对齐 */
  flex-grow: 1;
}

/* 固定设置按钮到右上角 */
.settings-button {
  background: none;
  color: black;
  border: none;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
}

/* 设置菜单弹出样式 */
.settings-dropdown {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 10px;
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

/* 模态框背景 */
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 模态框内容 */
.modal-content {
  background: #ddd; /* 灰色背景 */
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
}

/* 表单组 */
.form-group {
  margin: 10px 0;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #888; /* 鼠标悬停时按钮颜色 */
}
</style>
