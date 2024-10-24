<template>
  <div
      class="bot-manager"
      style="width: 100%; max-width: 1200px; margin: 0 auto; height: 100%; display: flex; flex-direction: column;"
  >
    <header
        style="display: flex; justify-content: space-between; align-items: center; background-color: #f5f5f5; padding: 10px 20px; border-bottom: 1px solid #ddd;"
    >
      <!-- 左侧部分 -->
      <div style="display: flex; align-items: center; gap: 10px;">
        <img
            src=""
            alt="logo"
            style="width: 32px; height: 32px; border-radius: 50%;"
        />
        <span style="font-size: 18px; font-weight: bold;">123</span>
        <span style="font-size: 14px; color: #666;">个人空间</span>
        <span style="font-size: 14px; color: #666;">草稿 | 自动保存 22:58:35</span>
      </div>

      <!-- 中间部分：导航选项 -->
      <div style="display: flex; gap: 15px;">
      <span
          @click="switchTab('edit')"
          :style="getOptionStyle('edit')"
      >
        编辑
      </span>
        <span
            @click="switchTab('analysis')"
            :style="getOptionStyle('analysis')"
        >
        分析
      </span>
      </div>

      <!-- 右侧部分：发布按钮 -->
      <div style="display: flex; align-items: center;">
        <button
            style="background-color: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: background-color 0.3s;"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            :style="{ backgroundColor: hover ? '#0056b3' : '#007bff' }"
        >
          发布
        </button>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div v-if="activeTab === 'edit'" class="edit-section">
      <div style="display: flex; height: 100%; overflow: hidden;">
        <!-- 左侧：功能导航 -->
        <div style="width: 300px; padding: 20px; border-right: 1px solid #ddd;">
          <h3 style="margin-bottom: 20px;">输入与回复逻辑编辑</h3>
          <p style="color: #666; margin-bottom: 30px;">
            使用自然语言编写 Bot 的外观设置、功能和工作流程。
          </p>
          <div>
            <h4>插件</h4>
            <div style="margin: 10px 0;">
              <img src="" alt="plugin" style="width: 24px; vertical-align: middle;" />
              <span style="margin-left: 10px;">必应搜索 / BingWebSearch</span>
            </div>
            <h4 style="margin-top: 20px;">工作流</h4>
            <p>图像流、触发器等功能配置。</p>
            <h4 style="margin-top: 20px;">知识</h4>
            <ul style="list-style: none; padding-left: 0;">
              <li>文本</li>
              <li>表格</li>
              <li>照片</li>
            </ul>
          </div>
        </div>

        <!-- 右侧：预览与调试 -->
        <div style="flex: 1; display: flex; flex-direction: column;">
          <header
              style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #ddd;"
          >
            <div style="font-size: 18px; font-weight: bold;">豆包 · Function call 模型</div>
            <div>
              <button style="background-color: transparent; border: none; cursor: pointer;">隐私设置</button>
            </div>
          </header>

          <div style="flex: 1; display: flex; overflow: hidden;">
            <!-- 中间：功能调试区域 -->
            <div style="flex: 1; padding: 20px;">
              <h2 style="font-weight: normal;">预览与调试</h2>
              <div
                  style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"
              >
                <img src="" alt="123" style="width: 64px;" />
              </div>
            </div>
          </div>

          <!-- 底部：输入框 -->
          <footer style="padding: 15px; border-top: 1px solid #ddd; display: flex; align-items: center;">
            <input
                type="text"
                placeholder="请输入内容..."
                style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px;"
            />
            <button
                style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              发送
            </button>
          </footer>
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
    </div>

  </div>
</template>

<script>
export default {
  name: 'BotManager',
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
        color: this.activeTab === tab ? '#4CAF50' : '#555',
        fontWeight: this.activeTab === tab ? 'bold' : 'normal',
        transition: 'color 0.3s',
      };
    },
  },
};
</script>

<style scoped>
</style>
