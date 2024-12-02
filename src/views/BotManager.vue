<template>
  <div
      class="bot-manager"
      style="width: 100%; max-width: 2000px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; background-color: white;"
  >
    <header
        style="display: flex; justify-content: space-between; align-items: center; background-color: #ffffff; padding: 10px 20px; border-bottom: 1px solid #ddd;"
    >
      <!-- 左侧部分 -->
      <div style="display: flex; align-items: center; gap: 10px; opacity: 0.8;">
        <AvatarComponent
            :size="50"
            :name="bot.title"
            :bgColor="'#6eb2ea'"
            shape="square"
        />
        <span style="font-size: 18px; color: #6eb2ea; font-weight: bold; gap: 15px;">{{author.name}}</span>
        <span style="font-size: 14px; color: #fdfdfd; font-weight: bold; gap: 15px;" class="button" @click="goBack()">个人空间</span>
        <span style="font-size: 18px; color: #6eb2ea; font-weight: bold; gap: 15px;">自动保存 | 22:58:35</span>

        <!-- 中间部分：导航选项 -->
        <span @click="switchTab('edit')" :style="getOptionStyle('edit')">编辑</span>
        <span @click="switchTab('analysis')" :style="getOptionStyle('analysis')">分析</span>
      </div>
    </header>

    <!-- 主内容区域 -->

<div v-show="activeTab === 'analysis'" class="analysis-section">
  <div style="max-width: 50%">
    <el-row style="justify-content: center; gap: 20px;">
      <el-col :span="8" v-for="(value, key) in bot" :key="key">
        <el-card shadow="hover">
          <div class="content" style="text-align: center;">
            <h3 style="font-size: 16px; font-weight: bold;">{{ formatLabel(key) }}:</h3>
            <el-tag :type="getTagType(key)" style="font-size: 16px; font-weight: normal;">
              {{ value }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
    </div>
    <div style="overflow-y: auto; margin-top: 20px; width: 60%">
      <Community/>
    </div>
  </div>

    <div v-show="activeTab === 'edit'" class="edit-section">
      <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">

        <!-- Header 部分 -->
        <header style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #ddd;">
          <div style="font-size: 24px; text-align: center; font-weight: bold; color: #007bff">{{ bot.title }}</div>
          <div>
            <button style="background-color: transparent; border: none; cursor: pointer;">隐私设置</button>
          </div>
        </header>

        <!-- 主体内容部分 -->
        <div style="display: flex; flex: 1; width: 100%; padding: 20px; box-sizing: border-box;">

          <!-- 左侧：功能导航区域 -->
          <div class="function-navigation" style="flex: 0 0 200px; padding-right: 20px; font-size: 14px; ">
            <div class="content" style="margin-top: 40px; text-align: center;">
              <h3 class="section-title">输入与回复逻辑编辑</h3>
              <p class="section-description">
                使用自然语言编写 Bot 的外观设置、功能和工作流程。
              </p>
            </div>

            <!-- 插件区域 -->
            <div class="function-navigation" style="margin-top: 40px;">
              <div class="plugins-section">
                <div class="content" style="margin-top: 40px; text-align: center;">
                  <h4 class="section-title">插件</h4>
                  <div class="plugin-item">
                    <span class="plugin-name">必应搜索 / BingWebSearch</span>
                  </div>
                </div>
                <div class="content" style="margin-top: 40px; text-align: center;">
                  <h4 class="section-title">知识</h4>
                  <p>上传知识库</p>
                </div>
                <div class="content" style="margin-top: 40px; text-align: center;">
                  <h4 class="section-title">预训练</h4>
                  <p>让模型更加符合您的使用</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：展示和调试区域 -->
          <div style="flex: 1; display: flex; flex-direction: column; padding-left: 20px; overflow: hidden; background-color: #fff; ">
            <div style="flex-grow: 1;">
              <!-- Home 组件展示 -->
              <Home />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import Home from "@/views/Home.vue";
import Community from "@/views/Community.vue";
import AvatarComponent from "@/views/AvatarComponent.vue";

export default {
  name: 'BotManager',
  components: {
    AvatarComponent,
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
      botData: null,
      bot: {
      },
      author: {
      },
    };
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      this.$nextTick(() => {
        console.log('Tab switched to:', tab);
      });
    },
    getOptionStyle(tab) {
      return {
        cursor: 'pointer',
        fontSize: '16px',
        color: this.activeTab === tab ? '#407894' : '#555',
        fontWeight: this.activeTab === tab ? 'bold' : 'normal',
        transition: 'color 0.3s',
      };
    },
    goBack() {
      this.$router.push('/PersonalPage');
    },
    formatLabel(key) {
      const labels = {
        title: 'Bot 名',
        price_per_use: '单次使用耗额',
        usage_limit: '当天使用限制',
        use_count: '已被使用次数',
        average_mouth_rating: '当月评分',
        average_rating: '总评分',
        ratings_count: '已获评论数'
      };
      return labels[key] || key;
    },
    getTagType(key) {
      if (key === 'average_mouth_rating' || key === 'average_rating') {
        return 'success';
      } else if (key === 'use_count') {
        return 'info';
      }
      return 'primary';
    },
    async getBotMsg_() {
      try {
        await this.$get(
            'get_bot_msg/',
            { botid: this.bot.id },
            'botData',
            '',
            ''
        );
        console.log("bot_manager")
        console.log(this.botData)
        //这里做一个对数据的检查和处理
        if (this.botData === null) {
          alert('获取机器人信息失败！');
          return;
        }
        let message = this.botData.bot_dict;
        this.author = {
          id: message.creator.id,
          name: message.creator.username,
          avatar: message.creator_avatar || null,
          email: message.creator.email,
          balance: message.creator.balance,
        }
        this.bot = {
          id: message.id,
          title: message.name,
          price_per_use: message.price_per_use,
          usage_limit: message.usage_limit,
          is_default: message.is_default,
          use_count: message.usageCount,
          like_count: message.likes,
          average_mouth_rating: message.mounth_rating,
          average_rating:message.total_likes,
          ratings_count:message.collection_count
          // releaseDate: message.release_date,
          // favorites: message.favorites,
          // likes: message.likes,
          // usageCount: message.usage_count,
          // dialogCount: message.dialog_count,
          // description: message.description,
          // configurations: message.configurations,
          // 返回数据中暂时没有这些信息
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.bot.id = this.$route.query.bot_id;
    this.getBotMsg_();
  }
};
</script>

<style scoped>

.analysis-section h2 {
  font-size: 24px;
  text-align: center;
  color: #867777;
  margin-bottom: 30px;
}

.section-title {
  color: #007bff;
  font-size: 18px;
  margin-bottom: 10px;
}

:root {
  --main-bg-color: #ffffff; /* 白色背景 */
  --main-text-color: #333333; /* 更深的文本颜色 */
  --button-bg-color: #007bff;
  --button-hover-color: #0056b3;
  --section-bg-color: #ffffff; /* 统一设置为白色背景 */
  --border-color: #ddd; /* 边框颜色 */
}

.button {
  background-color: #5b9bdc; /* 初始背景颜色 */
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
  background-color:  #f8f8f8;; /* 初始背景颜色 */
  color: #090707; /* 文字颜色 */
  padding: 10px 10px; /* 内边距 */
  border: 1px solid #ddd; /* 边框 */
  border-bottom-width: medium;
  border-radius: 5px; /* 圆角边框 */

  cursor: pointer; /* 鼠标样式 */
  transition: background-color 0.3s; /* 过渡效果，用于背景颜色变化 */
}
.content:hover {
  background-color: #e0e0e0; /* 鼠标悬停时的背景颜色 */
}



.bot-manager {
  background-color: #ffffff;
  color: var(--main-text-color);
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  box-shadow: none; /* 去掉阴影 */
}

header {
  background-color: var(--main-bg-color);
  color: #333;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-color);
}

.edit-section, .analysis-section {
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  color: #101010;
  display: flex;
  padding: 20px;
  height: 75vh;
}

.analysis{
  flex-direction: column;
  align-items: center;
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
  padding: 0;
  opacity: 1;
}

}
</style>
