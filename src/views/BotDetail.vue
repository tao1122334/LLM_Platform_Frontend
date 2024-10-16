<template>
  <div style="position: absolute; left: 0; top: 0; width: 95vw; height: 95vh; display: flex; flex-direction: column; background-color: #f5f5f5;">
    <!-- 头部信息栏 -->
    <div style="width: 100%; padding: 20px; display: flex; justify-content: space-between; align-items: center; background-color: #fff; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);">
      <!-- 左侧：作者信息 -->
      <div style="display: flex; align-items: center;">
        <button @click="this.$router.push({path: '/BotShop'});" style="cursor: pointer;">
          <i class="iconfont">&#xe605;</i>
        </button>
        <img :src="author.avatar" alt="Author Avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 12px;" />
        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">{{ bot.title }}</h3>
          <div style="font-size: 14px; color: #888;">{{ author.name }} 发布于 {{ bot.releaseDate }}</div>
        </div>
      </div>
      <!-- 右侧：收藏数和分享按钮 -->
      <div style="display: flex; align-items: center; gap: 20px;">
        <span style="font-size: 16px; cursor: pointer;" @click="collect">
          <i class="iconfont">&#xe600;</i> {{ bot.favorites }} 收藏
        </span>
        <button style="padding: 8px 16px; border: none; background: #007bff; color: #fff; border-radius: 4px; cursor: pointer;">
          分享
        </button>
      </div>
    </div>

    <!-- 主体区域：左侧聊天区域 + 右侧评论信息栏 -->
    <div style="display: flex; flex-grow: 1;">
      <!-- 左侧：聊天区域，占3/4宽度 -->
      <div style="width: 75%; padding: 20px; background: #f9f9f9;">
        <Home></Home>
      </div>
      <!-- 右侧：评论信息栏，占1/4宽度 -->
      <div style="width: 25%; padding: 20px; background: #fff; box-shadow: -1px 0 4px rgba(0, 0, 0, 0.1);">
        <!-- 点赞数、使用量、对话数统计栏 -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center;">
          <span style="font-size: 14px; color: #666;cursor: pointer" @click="like"><i class="iconfont">&#xe601;</i> {{ bot.likes }} 赞</span>
          <span style="font-size: 14px; color: #666;"><i class="iconfont">&#xe602;</i> {{ bot.usageCount }} 使用</span>
          <span style="font-size: 14px; color: #666;"><i class="iconfont">&#xe603;</i> {{ bot.dialogCount }} 对话</span>
        </div>

        <!-- 简介部分 -->
        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">简介</h4>
        <p style="font-size: 14px; color: #333; line-height: 1.6;">{{ bot.description }}</p>

        <!-- 配置项展示 -->
        <h4 style="font-size: 16px; font-weight: 600; margin: 20px 0 10px;">配置项</h4>
        <div v-for="(config, index) in bot.configurations" :key="index" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;">
          <strong>{{ config.name }}</strong>: {{ config.value }}
        </div>

        <!-- 社区内容（展示社区帖子）-->
        <h4 style="font-size: 16px; font-weight: 600; margin: 20px 0 10px;">社区</h4>
        <div v-for="(post, index) in communityPosts" :key="index" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" @click="goToPost(post.id)">
          <div style="font-size: 14px; font-weight: 600; color: #333;">{{ post.title }}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">{{ post.author }} · {{ post.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Home from "@/views/Home.vue";

export default {
  components: {
    Home
  },
  data() {
    return {
      // 作者和机器人信息
      author: {
        name: "PlayWithAI",
        avatar: "https://via.placeholder.com/50"
      },
      bot: {
        title: "个人说明书",
        releaseDate: "2024-09-19 08:54",
        favorites: 14,
        likes: 207,
        usageCount: 345,
        dialogCount: 22,
        description: "创建属于你的个人说明书，并展示给他人使用。",
        configurations: [
          { name: "配置项 1", value: "功能 X 已开启" },
          { name: "配置项 2", value: "支持语音输入" }
        ]
      },
      // 社区帖子示例
      communityPosts: [
        { id: 1, title: "如何使用该机器人？", author: "AI Lover", date: "2024-09-20" },
        { id: 2, title: "分享我的使用心得", author: "Tech Geek", date: "2024-09-21" }
      ]
    };
  },
  methods: {
    //todo: 是点作者头像跳转到作者的空间，而不是点评论
    goToPost(postId) {
      console.log("跳转到社区帖子：", postId);
      this.$router.push({ path: `/OthersPage` });
    },
    // todo: url:likebot POST 传botid（键名）, 检查后端的返回信息 result:added, 如果是未添加，则是add, 出现弹窗提示
    like(){},
    // todo: url:collectbot POST 传botid（键名）, 检查后端的返回信息 result:added, 如果是未添加，则是add, 出现弹窗提示
    collect(){}
  },
  mounted() {
  //   todo: 根据跳转传来的id，向后端请求机器人信息 url:get_bot_msg
  }
};
</script>

<style scoped>
/* 引入自定义图标字体库 */
.iconfont {
  font-family: "iconfont";
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
