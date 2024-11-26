<template>
  <div
      class="bot-manager"
      style="width: 100%; max-width: 2000px; margin: 0 auto; height: 100%; display: flex; flex-direction: column;"
  >
    <header
        style="display: flex; justify-content: space-between; align-items: center; background-color: #f5f5f5; padding: 10px 20px; border-bottom: 1px solid #ddd;"
    >
      <!-- 左侧部分 -->
      <div style="display: flex; align-items: center; gap: 10px;opacity: 0.8">
        <img
            src=""
            alt="logo"
            style="width: 32px; height: 32px; border-radius: 50%;"
        />
        <span style="font-size: 18px; color: #666;font-weight: bold ;gap: 15px">123</span>
        <span style="font-size: 14px; color: #666;font-weight: bold; gap: 15px" class="button">个人空间</span>
        <span style="font-size: 14px; color: #666;font-weight: bold;gap: 15px" class="button">草稿</span>
        <span style="font-size: 18px; color: #666;font-weight: bold;gap: 15px" >自动保存 | 22:58:35</span>

        <!-- 中间部分：导航选项 -->
      <div style="display: flow; gap: 20px;" class="button">
      <span
          @click="switchTab('edit')"
          :style="getOptionStyle('edit')"
      >
        编辑
      </span>

      </div>
      <div style="display: flow; gap: 20px; color:#5e010c" class="button">
        <span
            @click="switchTab('analysis')"
            :style="getOptionStyle('analysis')"
        >
        分析
      </span>
      </div>
        <!-- 右侧部分：发布按钮 -->
      <div style="display: flex; align-items: center;gap: 20px;">
        <button
            style="background-color: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: background-color 0.3s;"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            :style="{ backgroundColor: hover ? '#0056b3' : '#007bff' }"
        >
          发布
        </button>
      </div>


      </div>




    </header>
    <!-- 主内容区域 -->
    <div v-if="activeTab === 'edit'" class="edit-section">

      <div style="display: flex; height: 100%; overflow: hidden;color: #121010;  justify-content: center;" >
        <!-- 左侧：功能导航 -->
      <div class="function-navigation" style=" margin-top: 40px; justify-content: center;">
         <div class="content" style=" margin-top: 40px;margin-right:15px;text-align: center;">
      <h3 class="section-title">输入与回复逻辑编辑</h3>
      <p class="section-description">
        使用自然语言编写 Bot 的外观设置、功能和工作流程。
      </p></div>
        <div class="function-navigation" style=" margin-top: 40px;">
      <div class="plugins-section">
         <div class="content" style=" margin-top: 40px;margin-right:15px;text-align: center;">
        <h4>插件</h4>
        <div class="plugin-item">
          <img src="" alt="plugin" class="plugin-icon" />
          <span class="plugin-name">必应搜索 / BingWebSearch</span>
        </div></div>
        <div class="content" style=" margin-top: 40px;margin-right:15px;text-align: center;">
        <h4 class="section-title">工作流</h4>
        <p>图像流、触发器等功能配置。</p>
          </div>
         <div class="content" style=" margin-top: 40px;margin-right:15px;text-align: center;">
        <h4 class="section-title">知识</h4>
        <ul class="knowledge-list">
          <li>文本</li>
          <li>表格</li>
          <li>照片</li>
        </ul></div>
        </div></div></div>

          <!-- 右侧：预览与调试 -->
        <div style="flex: 1; display: flex; flex-direction: column;">
            <header
                style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #ddd;"
            >
              <div style="font-size: 28px;text-align: center; font-weight: bold;">豆包 · Function call 模型</div>
              <div>
                <button style="background-color: transparent; border: none; cursor: pointer;">隐私设置</button>
              </div>
            </header>
            <Home/>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'analysis'" class="analysis-section">
      <h2>Bot 分析</h2>
      <div class="analytics">
        <div class="card">对话人数: <span>-</span></div>
        <div class="card">全国排名: <span>-</span></div>
        <div class="card">用户来源: <span>暂无数据</span></div>
      </div>
      <Community/>
    </div>
  </div>
</template>

<script>
import Home from "@/views/Home.vue";
import Community from "@/views/Community.vue";

export default {
  name: 'BotManager',
  components: {
    Home,
    Community,
  },
  data() {
    return {
      activeTab: 'edit', // 控制当前显示的选项卡
      messages: [
        { user: 'tlz9703', text: 'good' },
        { user: 'PlayWithAI', text: '精彩案例' },
      ],
      hover: false,
    };
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    getOptionStyle(tab) {
      return {
        cursor: 'pointer',
        fontSize: '16px',
        color: this.activeTab === tab ? '#235125' : '#555',
        fontWeight: this.activeTab === tab ? 'bold' : 'normal',
        transition: 'color 0.3s',
      };
    },
  },
};
</script>

<style scoped>
:root {
  --main-bg-color: #f5f5f5;
  --main-text-color: #bcbcbc;
  --active-color: #4CAF50;
  --button-bg-color: #007bff;
  --button-hover-color: #0056b3;
}

.button {
  background-color: #d1d8df; /* 初始背景颜色 */
  color: #090707; /* 文字颜色 */
  padding: 10px 20px; /* 内边距 */
  border: none; /* 边框 */
  border-radius: 5px; /* 圆角边框 */
  cursor: pointer; /* 鼠标样式 */
  transition: background-color 0.3s; /* 过渡效果，用于背景颜色变化 */
}
.button:hover {
  background-color: #404145; /* 鼠标悬停时的背景颜色 */
}


.content {
  background-color: rgb(197, 195, 195); /* 初始背景颜色 */
  color: #090707; /* 文字颜色 */
  padding: 10px 10px; /* 内边距 */
  border: #070707; /* 边框 */
  border-bottom-width: medium;
  border-radius: 5px; /* 圆角边框 */

  cursor: pointer; /* 鼠标样式 */
  transition: background-color 0.3s; /* 过渡效果，用于背景颜色变化 */
}
.content:hover {
  background-color: #888787; /* 鼠标悬停时的背景颜色 */
}



.bot-manager {
  background-color: rgba(216, 216, 216, 0.42);
  color: var(--main-text-color);
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
}

header {
  background-color: var(--main-bg-color);
  color: white;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
}

.button-flat {
  background-color: var(--button-bg-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;

}


.edit-section, .analysis-section {
  font-family: 'Arial', sans-serif;
  background-color: rgba(14, 13, 13, 0.13);
  color: #101010;
  display: flex;
  padding: 20px;
}



.card {
  background-color: #070707;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
}

.card:last-child {
  margin-bottom: 0;


  .edit-section {
  display: flex;
  height: 100%;
  overflow: hidden;
    opacity: 1;
}

.function-navigation {
  margin-top: 100px;
  width: 300px;
  padding: 20px;
  border-right: 1px solid #121010;
  background: #007BFF;
  opacity: 1;
}


.section-title {
  margin-bottom: 20px;
  opacity: 1;
}

.section-description {
  color: #666;
  margin-bottom: 30px;
  opacity: 1;
}

.plugins-section {
  margin-top: 20px;
  opacity: 1;
}

.plugin-item {
  margin: 10px 0;
  display: flex;
  align-items: center;
  opacity: 1;
}

.plugin-icon {
  width: 24px;
  vertical-align: middle;
  opacity: 1;
}

.plugin-name {
  margin-left: 10px;
  opacity: 1;
}

.knowledge-list {
  list-style: none;
  padding-left: 0;
  opacity: 1;
}

}
</style>
