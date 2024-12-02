<script>
import AvatarComponent from "@/views/AvatarComponent.vue";

export default {
  name: "BotShop",
  components: {AvatarComponent},
  data() {
    return {
      dropdownOpen: false,
      currentFilter: "the latest bots",
      filters: ["the latest bots", "best of the month", "best of all time", "most visited"],
      bots: [],
      hoverEffect: -1,
      data: null,
      search: ''
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    async selectFilter(filter) {
      await this.$get('botlist/', {order: filter}, 'data');
      console.log("filter", filter);
      console.log(this.data);
      this.processBotsData(this.data.bots);
      this.currentFilter = filter;
      this.dropdownOpen = false;
    },
    async searchBot() {
      await this.$get('botlist/', {search: this.search}, 'data');
      console.log("search", this.search);
      console.log(this.data);
      this.processBotsData(this.data.bots);
    },
    recommend() {
      console.log("recommend");
    },
    // todo: 跳转时要传机器人的id
    // 跳转到机器人详细页面，传递机器人 ID
    goToDetails(botId) {
      this.$router.push({ name: 'BotDetail', query: { bot_id: botId } });
    },
    // todo: 跳转时要传作者的id 键名应该是creator_id
    // 跳转到作者个人主页，传递作者 ID
    goToAuthorPage(creatorId) {
      this.$router.push({ name: 'OthersPage', query: { creator_id: creatorId } });
    },


    async getBots() {
      // 获取机器人列表
      try {
        await this.$get('botlist/', {}, 'data');
        console.log(this.data);
        this.processBotsData(this.data.bots);
      } catch (error) {
        console.error("Error fetching bots:", error);
      }
    },
    processBotsData(rawBots) {
      // 遍历原始 bots 数据，并填充到本地 bots 数组
      this.bots = [];
      rawBots.forEach((item) => {
        this.bots.push({
          id: item.id,
          title: item.name || "未知标题", // 如果 name 为空，设置默认值
          description: item.description || "暂无描述", // 如果 description 为空，设置默认值
          views: item.visit_count || 0, // 替换为 visit_count
          likes: item.total_likes || 0, // 替换为 total_likes
          comments: item.collection_count || 0, // 替换为 collection_count
          month: item.mounth_rating || 0,
          image: item.bot_avatar || "", // 替换为 bot_avatar
          author: {
            id: item.creator?.id || 0, // 如果 creator 不存在，设置默认值
            name: item.creator?.username || "未知作者", // 如果 username 为空，设置默认值
            avatar: item.creator?.avatar || "", // 如果 avatar 不存在，设置默认值
            balance: item.creator?.balance || 0, // 如果 balance 不存在，设置默认值
            email: item.creator?.email || "", // 如果 email 不存在，设置默认值
          },
        });
      });
    },
  },
  mounted() {
    // todo: 获取Bot的列表 url:botlist method:GET 参数 search(用户所输入的关键词), order(bestofmonth/bestofalltime/mostvisited)
    this.getBots()
  }
};

</script>
<!--todo: 在社区旁边增加一个发帖键-->
//社区的功能在别的组件已经完成

<template>
  <div style="width: 100vw; height: 100vh; display: flex; flex-direction: column;">
    <!-- 固定顶部搜索栏 -->
    <div style="flex-shrink: 0; padding: 20px; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-weight: 700; color: #333; font-size: 24px; margin-left: 20px;">Bot 商店</h2>
        <div style="display: flex; align-items: center; gap: 10px;">
          <input
              v-model="search"
              type="text"
              placeholder="搜索"
              style="width: 400px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; outline: none;"
          />
          <button style="border: none; background: #007bff; color: #fff; padding: 10px 20px; border-radius: 4px; cursor: pointer; transition: background 0.3s;"
                  @click="searchBot">
          搜索
          </button>
        </div>
        <button style="border: none; background: #007bff; color: #fff; padding: 10px 20px; border-radius: 4px; cursor: pointer; transition: background 0.3s;">
          上架 Bot
        </button>
      </div>
    </div>

    <!-- 展示部分：占据剩余全部高度，并且内部可滚动 -->
    <div style="flex-grow: 1; overflow-y: auto; padding: 20px; background-color: #f8f8f8;">
      <!-- 灰色占位段位符 -->
    <div style="width: 100%; height: 200px; background-color: #e0e0e0; margin-bottom: 20px; display: flex; justify-content: center; align-items: center;">
        <img src="../assets/img.png" alt="hello" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>

      <!-- 推荐栏和选择栏（缩小高度，布局保持紧凑） -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <button class="recommend" @click="recommend">
          推荐
        </button>
<!--        <button class="recommend" @click="getBots">-->
<!--          获取-->
<!--        </button>-->
        <div style="position: relative;">
          <button
              @click="toggleDropdown"
              style="padding: 6px 12px; border: 1px solid #ddd; background: #fff; cursor: pointer; border-radius: 4px; font-size: 14px; transition: background 0.3s, color 0.3s;"
          >
            {{ currentFilter }} ▼
          </button>
          <!-- 下拉菜单 -->
          <div
              v-if="dropdownOpen"
              style="position: absolute; top: 100%; right: 0; background: #fff; border: 1px solid #ddd; width: 150px; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
          >
            <div
                v-for="(filter, index) in filters"
                :key="index"
                @click="selectFilter(filter)"
                class="filter"
            >
              {{ filter }}
            </div>
          </div>
        </div>
      </div>

      <!-- 网格展示部分 -->
      <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        <!-- 单个机器人卡片 -->
        <div
            v-for="(bot, index) in bots"
            :key="index"
            style="width: calc(33.3333% - 20px); padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: box-shadow 0.3s;"
            @mouseover="hoverEffect = index"
            @mouseleave="hoverEffect = -1"
            :style="hoverEffect === index ? 'box-shadow: 0 4px 12px rgba(0,0,0,0.2);' : ''"
        >
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <!-- 机器人图片（头像） -->
            <AvatarComponent
                :size="50"
                :name="bot.title"
                :image="bot.image"
                shape="square"
                bgColor="#FFD700"
                textColor="#333"
                initialSize="50"
                @click="goToDetails(bot.id)"
            />
            <!-- 标题和作者信息 -->
            <div style="flex-grow: 1;">
              <!-- 机器人标题 -->
              <h3
                  style="font-size: 18px; font-weight: 600; color: #333; margin: 0; cursor: pointer;"
                  @click.stop="goToDetails(bot.id)"
              >
                {{ bot.title }}
              </h3>
              <!-- 作者信息：头像 + 名称 -->
              <div style="display: flex; align-items: center; margin-top: 4px;">
                <AvatarComponent
                    :size="20"
                    :name="bot.author.name"
                    :image="bot.author.avatar"
                    shape="circle"
                    bgColor="#FFD700"
                    textColor="#333"
                    initialSize="50"
                    @click="goToAuthorPage(bot.author.id)"
                />
                <span
                    style="font-size: 14px; color: #555; cursor: pointer;"
                    @click.stop="goToAuthorPage(bot.author.id)"
                >
                    {{ bot.author.name }}
                  </span>
              </div>
            </div>
          </div>
          <!-- 机器人简介（省略长内容） -->
          <p
              style="font-size: 14px; color: #666; margin: 12px 0; line-height: 1.5em; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
          >
            {{ bot.description }}
          </p>

          <!-- 浅色分割线 -->
          <hr style="border: 0; border-top: 1px solid #ffff00; margin: 12px 0;" />

          <!-- 浏览量、收藏量、评论量 -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; color: #999;">
              {{ "浏览 "+bot.views }}
            </span>
            <span style="font-size: 14px; color: #999;">
              {{ "评分 "+bot.likes }}
            </span>
            <span style="font-size: 14px; color: #999;">
              {{ "本月评分 "+bot.month }}
            </span>
            <span style="font-size: 14px; color: #999;">
              {{ "评论 "+bot.comments }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.recommend {
  padding: 6px 12px; border: none; background: #007bff; color: #fff; border-radius: 4px; font-size: 14px; transition: background 0.3s;
}
.recommend:hover {
  background: #0056b3;
}
.filter {
  padding: 8px; cursor: pointer; font-size: 14px; transition: background 0.3s;
}
.filter:hover {
  background: #f0f0f0;
}
</style>



