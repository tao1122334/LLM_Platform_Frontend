<script>
import IconCommunity from '@/components/icons/IconCommunity.vue';
import IconSupport from '@/components/icons/IconSupport.vue';
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import IconEcosystem from "@/components/icons/IconEcosystem.vue";
import IconTooling from "@/components/icons/IconTooling.vue";
import FileRenderer from "@/views/FileRenderer.vue";

export default {
  name: 'Home',
  components: {
    IconTooling,
    IconEcosystem,
    IconDocumentation,
    IconCommunity,
    IconSupport,
    FileRenderer,
  },
  props: {
    msg: String,
    chatWidth: {
      type: String,
      default: '40vw'  // 默认宽度为100%
    },
    chatHeight: {
      type: String,
      default: '80vh'  // 默认高度为400px
    },
    homeWidth: {
      type: String,
      default: '95vw'  // 默认宽度为15vw
    },
    homeHeight: {
      type: String,
      default: '100vh'  // 默认高度为95vh
    },
    inputHeight: {
      type: String,
      default: '10vh'  // 默认高度为10vh
    }
  },
  data() {
    return {
      showSettings: false, // 控制设置菜单显示
      isTempChatEnabled: false, // 控制临时聊天开关
      isAdmin: true, // 假设当前用户是管理员
      showAdminSettings: false, // 控制管理员设置显示
      messages: [],
      newMessage: "",  // 新消息内容,
      uploadedFiles: [],
      hoveredIcon: "", // 用于追踪悬停图标状态
      attachFile: false,
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
      bots: [
        {id: 3, name: 'ChatGPT'},
        {id: 4, name: 'GPT 3.5'},
        {id: 5, name: 'GPT 4.0'},
      ],
      selectedBot: {id: 3, name: 'ChatGPT'},        // 选中的机器人
      showBotList: false,        // 控制机器人列表弹窗的显示
      messageData: null
    };
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

    addMessageMe(text, file){
      const newMsg = {
        id: this.messages.length + 1,
        text: text,
        sender: "me",
        file: file,
        photo: "src/assets/login.jpg",
        timestamp: new Date().toISOString(),
      };
      this.messages.push(newMsg);
    },
    addMessageAssistant(text, file){
      const newMsg = {
        id: this.messages.length + 1,
        text: text,
        sender: "assistant",
        file: file,
        timestamp: new Date().toISOString(),
      };
      this.messages.push(newMsg);
    },
    addMessageSystem(text){
      const newMsg = {
        id: this.messages.length + 1,
        text: text,
        sender: "system",
        timestamp: new Date().toISOString(),
      };
      this.messages.push(newMsg);
    },
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.addMessageMe(this.newMessage, this.uploadedFiles);
        await this.$nextTick(() => {
          const textarea = this.$refs.input;
          textarea.style.height = 'auto'; // 重置高度
        });
        this.uploadedFiles=[];
        this.url = 'chat/'+ this.bot_id + '/' + this.group_id + '/';
        const form = new FormData();
        form.append('chat_method', 'common');
        form.append('chat_content', this.newMessage);
        form.append('userfile', this.uploadedFiles);
        await this.$post(this.url, null, form, 'data');
        console.log(this.data)
        // 解析 JSON 数据
        const receive_data = JSON.parse(this.data.chat);

        // 提取 bot_text
        const botJson = receive_data[0].fields.bot_text;
        const botText = JSON.parse(botJson).response;
        const questions = JSON.parse(botJson).heuristic_questions;
        const Model = receive_data[0].model;
        console.log(botText)
        console.log(questions)
        this.messages.push({ text: botText +" | "+ Model, sender: "assistant" });
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
    // todo: 后端warnmsg如果有信息，就弹出来  已完成
    async receiveMessages() {
      try {
        await this.$get('warnmsg/', null, 'data');
        if (this.data.warnmsg) {
          alert(this.data.warnmsg);
        }
      } catch (error) {
        console.error("接收对话消息失败:", error);
      }
    },
    handleSubmit() {
      // 提交表单数据，并通过事件返回到父组件
      this.postAdminSettings();
      this.formData = {
        defaultBot: 'GPT 3.5',
        maxRate: 100000000,
        gpt35Cost: 0,
        gpt40Cost: 0,
        gpt40MiniCost: 0
      };
      this.closeModal();
    },
    showAttachment(e) {
      this.attachFile = true;
      e.target.style.backgroundColor = '#e0e0e0'
    },
    hideAttachment(e) {
      this.attachFile = false;
      e.target.style.backgroundColor = '#f1f1f1'
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        // 将文件逐个推入数组
        for (let i = 0; i < files.length; i++) {
          this.uploadedFiles.push(files[i]);
        }
      }
      event.target.value = ''; // 清空输入框以允许上传同样的文件
    },
    // 移除文件
    removeFile(index) {
      this.uploadedFiles.splice(index, 1); // 删除文件
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
    // TODO: url: del_messagelist method: DELETE 并且记得更新message 已完成
    deleteChatHistory() {
      // 清空消息列表
      this.messages = [];
      this.messages.push({ text: '之前的聊天记录已清空，以下是新消息', sender: "system" });
      this.$delete('del_messagelist/', null, 'data');
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
    },
    inputTextArea(){
      const textarea = this.$refs.input;
      textarea.style.height = 'auto'; // 重置高度
      textarea.style.height = Math.min(textarea.scrollHeight-15, 150) + 'px'; // 限制最大高度
    },
    handleInput(event) {
      this.inputTextArea();
      // 检查输入中是否出现 @，如果有就显示机器人列表
      this.showBotList = this.newMessage.includes('@');
    },
    selectBot(bot) {
      // 选择机器人后，将其设置为当前对话的机器人，并关闭弹窗
      this.selectedBot = bot;
      this.showBotList = false;

      // 清除 @ 符号，并将机器人的名字加入输入框内容
      this.newMessage = this.newMessage.replace('@', '') + bot.name;
    },
    async getMessageList() {
      try {
        await this.$get(
            'messagelist/',
            {},
            'messageData',
            '',
            ''
        );
        //处理发送回来的数据
        console.log(this.messageData)
        //this.messageData;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    //TODO: 向后端请求主页的消息记录，并且将message设置为请求的列表  method: GET url: messagelist 已完成
    this.getMessageList();
  },

  beforeDestroy() {
    //clearInterval(this.messagePolling);
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }
};
</script>

<!--TODO: 输入栏输入@的时候弹出弹窗，弹窗中有列表，选择之后在输入框上方显示正在对话的机器人名字  已完成-->

<template>
  <div
      class="home-container"
  >
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
    <main
        class="chat-area"
        style="display: flex; flex-direction: column; gap: 10px; padding: 10px; "
    >
      <section
          class="chat-box"
          :style="{
            width: chatWidth,
            height: chatHeight,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px'
          }">

        <!-- 使用 v-for 循环渲染每条消息 -->
        <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message', message.sender === 'me' ? 'my-message' : message.sender === 'assistant' ? 'assistant-message' : 'center-message']"
            style="display: flex; width: 100%; flex-direction: column">

          <!-- 文件展示（无论是用户还是机器人发送） -->
          <div style="display: flex; width: 100%; justify-content: center; margin-top: 5px;">
            <FileRenderer v-if="message.file" :files="message.file"/>
          </div>
          <!-- 用户消息在右侧 -->
          <div
              v-if="message.sender === 'me'"
              style="display: flex; justify-content: flex-end; width: 100%; align-items: center; gap: 10px;">
            <p
                style="background-color: #007bff; color: white; padding: 10px 15px; border-radius: 10px; max-width: 60%; word-wrap: break-word;">
              {{ message.text }}
            </p>
            <img
                :src="message.photo"
                alt="用户头像"
                class="avatar"
                style="width: 40px; height: 40px; border-radius: 50%;"/>
          </div>

          <!-- 机器人消息在左侧 -->
          <div
              v-else-if="message.sender === 'assistant'"
              style="display: flex; justify-content: flex-start; width: 100%; align-items: center; gap: 10px;">
            <img
                :src="message.photo"
                alt="机器人头像"
                class="avatar"
                style="width: 40px; height: 40px; border-radius: 50%;"/>
            <p
                style="background-color: #f1f1f1; color: black; padding: 10px 15px; border-radius: 10px; max-width: 60%; word-wrap: break-word;">
              {{ message.text }}
            </p>
          </div>

          <!-- 系统提示消息居中显示 -->
          <template v-else-if="message.sender === 'system'">
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; gap: 10px;">
              <div style="flex: 1; height: 1px; background-color: #ddd;"></div>
              <span style="padding: 0 10px; color: #666;">{{ message.text }}</span>
              <div style="flex: 1; height: 1px; background-color: #ddd;"></div>
            </div>
          </template>



        </div>
      </section>

      <!-- 输入区域 -->
      <footer
          :style="{
            width: chatWidth,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px'
          }">
        <!-- 显示选中的机器人名称 -->
        <div v-if="selectedBot"
             style="font-size: 12px; font-weight: bold; text-align: center; padding: 10px; border-bottom: 1px solid #ddd;">
          正在与: {{ selectedBot.name }}
        </div>
        <div style="display: flex; width: 100%;">
          <FileRenderer :files="uploadedFiles"/>
        </div>

        <div style="display: flex; width: 100%; flex-shrink: 0">

          <!-- 文件上传按钮 -->
          <label
              for="file-upload"
              style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f1f1f1; transition: background-color 0.3s;"
              @mouseover="showAttachment"
              @mouseleave="hideAttachment">

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
              <path d="M21.44 11.05l-8.84 8.84a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.19 9.19a2 2 0 0 1-2.83-2.83l8.84-8.84"/>
            </svg>
            <input
                id="file-upload"
                type="file"
                multiple
                style="display: none;"
                @change="handleFileUpload"
            />
            <span
                v-if="attachFile"
                style="position: relative; bottom: 100%; left: 50%; background: #000; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 12px; white-space: nowrap;">
              附加文件
            </span>
          </label>
          <!-- 输入框 -->
          <textarea
              v-model="newMessage"
              ref="input"
              placeholder="输入您的消息..."
              rows="1"
              style="flex-grow: 1; border: 1px solid #ddd; border-radius: 20px; padding: 10px 15px; resize: none; overflow-y: auto; max-height: 150px; font-size: 14px;"
              @input="handleInput"
          ></textarea>
          <!-- 发送按钮 -->
          <button
          style="height: 40px; padding: 10px 20px; margin-left: 10px; color: white; border: none; border-radius: 20px; cursor: pointer; transition: background-color 0.3s; background-color: #007bff;"
            :style="{ backgroundColor: newMessage.trim() ? '#007bff' : '#bbb', cursor: newMessage.trim() ? 'pointer' : 'not-allowed' }"
            @mouseover="(e) => { if (newMessage.trim()) e.target.style.backgroundColor = '#0056b3'; }"
            @mouseleave="(e) => { if (newMessage.trim()) e.target.style.backgroundColor = '#007bff'; }"
            @click="sendMessage"
          >
          发送
          </button>
          <!-- 机器人选择弹窗 -->
          <ul
              v-if="showBotList"
              style="position: absolute; max-width: 30%; background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 5px; list-style: none; margin: 0; max-height: 120px; overflow-y: auto; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); z-index: 10;">
            <li
                v-for="(bot, index) in bots"
                :key="index"
                @click="selectBot(bot)"
                style="padding: 8px 10px; cursor: pointer; font-size: 14px; transition: background-color 0.2s;"
                @mouseover="(e) => e.target.style.backgroundColor = '#f0f0f0'"
                @mouseleave="(e) => e.target.style.backgroundColor = 'white'">
              {{ bot.name }}
            </li>
          </ul>
        </div>
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
  max-height: 100vh;
  flex-grow: 1;
}
/*-------------------------------------------------------------------------------*/
/* 左侧栏样式 */
.left-sidebar {
  width: 30%;
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
