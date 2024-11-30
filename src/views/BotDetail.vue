<template>
  <div style="position: absolute; left: 0; top: 0; width: 95vw; height: 95vh; display: flex; flex-direction: column; background-color: #f5f5f5;">
    <!-- 头部信息栏 -->
    <!-- 头部信息栏 -->
    <div style="width: 100%; padding: 20px; display: flex; justify-content: space-between; align-items: center; background-color: #fff; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);">
      <!-- 左侧：作者信息 -->
      <div style="display: flex; align-items: center; gap: 15px;">
        <!-- 返回按钮 -->
        <button @click="this.$router.push({path: '/BotShop'});"
                style="cursor: pointer;
         background-color: #f8f9fa;
         border: 2px solid #007bff;
         color: #007bff;
         border-radius: 30px;
         padding: 8px 20px;
         display: flex;
         align-items: center;
         gap: 8px;
         font-size: 16px;
         transition: all 0.3s ease;
         box-shadow: 0 2px 6px rgba(0, 123, 255, 0.2);">

          <i class="fa fa-arrow-left" style="font-size: 18px;"></i>
          <span>返回</span>
        </button>

        <!-- 作者头像和标题信息 -->
        <AvatarComponent
            :size="50"
            :name="author.name"
            :image="author.avatar"
            shape="square"
            @click="goToAuthorPage(author.id)" />

        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; cursor: pointer;" @click="goToAuthorPage(author.id)">
            {{ bot.title }}
          </h3>
          <div style="font-size: 14px; color: #888; margin-top: 5px;">
            {{ author.name }} 发布于 {{ bot.releaseDate }}
          </div>
        </div>
      </div>

      <!-- 右侧：收藏数和分享按钮 -->
      <div style="display: flex; align-items: center; gap: 20px;">
    <span style="font-size: 16px; cursor: pointer;" @click="collect">
      {{ bot.favorites }} 收藏
    </span>

        <!-- 分享按钮 -->
        <button style="padding: 8px 16px; border: none; background-color: #007bff; color: #fff; border-radius: 4px; cursor: pointer; font-size: 14px;">
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

        <Community></Community>
      </div>
    </div>
  </div>
</template>

<script>
import Home from "@/views/Home.vue";
import Community from "@/views/Community.vue";
import AvatarComponent from "@/views/AvatarComponent.vue";

export default {
  components: {
    Home,
    Community,
    AvatarComponent
  },
  data() {
    return {
      // 作者和机器人信息
      author: {
        // id: 1,
        // name: "PlayWithAI",
        // avatar: "https://via.placeholder.com/50"
      },
      bot: {
        id: 1,
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
        ],
      },
      likeData: null,
      collectData: null,
      botData: null,
    };
  },
  methods: {
    //todo: 是点作者头像跳转到作者的空间，而不是点评论 在另一个组件 已完成

    // todo: url:likebot POST 传botid（键名）,检查后端的返回信息 result:added, 如果是未添加，则是add, 出现弹窗提示
    //已完成
    async like() {
      try {
        await this.$post(
            'likebot/',
            { botid: this.bot.id },
            {},
            'likeData',
            '',
            ''
        );
        if (this.likeData.result === 'add') {
          alert('点赞失败！');
        } else {
          alert('点赞成功！');
        }
      } catch (error) {
        console.error(error);
      }
    },
    // todo: url:collectbot POST 传botid（键名）, 检查后端的返回信息 result:added, 如果是未添加，则是add, 出现弹窗提示
    // 已完成
    async collect(){
      try {
        await this.$post(
            'collectbot/',
            { botid: this.bot.id },
            {},
            'collectData',
            '',
            ''
        );
        if (this.collectData.result === 'add') {
          alert('收藏失败！');
        } else {
          alert('收藏成功！');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getBotMsg() {
      try {
        await this.$get(
            'get_bot_msg/',
            { botid: this.bot.id },
            'botData',
            '',
            ''
        );
        console.log("bot_detail")
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
          avatar: message.bot_avatar_url,
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
    goToAuthorPage(creatorId) {
      this.$router.push({ name: 'OthersPage', query: { creator_id: creatorId } });
    },
  },
  mounted() {
    //todo: 根据跳转传来的id，向后端请求机器人信息 url:get_bot_msg 已完成
    this.bot.id = this.$route.query.bot_id;
    this.getBotMsg();

  }
};
</script>

<style scoped>
/* 引入自定义图标字体库 */
.iconfont {
  font-family: "iconfont", serif;  /* 使用图标字体 */
  font-style: normal;              /* 确保字体是正常样式 */
  font-weight: normal;             /* 确保字体的粗细是正常的 */
  -webkit-font-smoothing: antialiased;  /* 让字体在 WebKit 浏览器上平滑显示 */
  -moz-osx-font-smoothing: grayscale;  /* 在 macOS 上平滑字体 */
  text-align: center;              /* 对齐图标 */
}

</style>
