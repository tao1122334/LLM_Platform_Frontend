<script>
export default {
  name: "BotShop",
  data() {
    return {
      dropdownOpen: false,
      currentFilter: "best of the month",
      filters: ["best of the month", "best of all time", "most visited"],
      bots: [
        {
          title: "个人说明书",
          description: "创建属于你的个人说明书，并展示给他人使用。",
          views: 207,
          likes: 345,
          comments: 14,
          image: "https://via.placeholder.com/50", // 机器人头像
          author: {
            name: "PlayWithAI",
            avatar: "https://via.placeholder.com/24", // 作者头像
          }
        },
        {
          title: "合成新元素",
          description: "通过不同元素合成，探索新的组合和用途。",
          views: 620,
          likes: 543,
          comments: 22,
          image: "https://via.placeholder.com/50",
          author: {
            name: "SpaceKid",
            avatar: "https://via.placeholder.com/24",
          }
        }
      ],
      hoverEffect: -1,
      data: null,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectFilter(filter) {
      this.currentFilter = filter;
      this.dropdownOpen = false;
    },
    recommend() {
      console.log("recommend");
    },
    // todo: 跳转时要传机器人的id
    goToDetails(title) {
      // 跳转到机器人详细页面
      this.$router.push({ path: `/BotDetail` });
    },
    // todo: 跳转时要传作者的id 键名应该是creator_id
    goToAuthorPage(author) {
      // 跳转到作者个人主页
      this.$router.push({ path: `/PersonalPage` });
    },
    async getBots() {
      // 获取机器人列表
      try {
        await this.$get('get_bot_msg/3/', {}, 'data');
        console.log(this.data);
      } catch (error) {
        console.error("Error fetching bots:", error);
      }
    },
  },
  mounted() {
    // todo: 获取Bot的列表 url:botlist method:GET 参数 search(用户所输入的关键词), order(bestofmonth/bestofalltime/mostvisited)
    this.getBots()
  }
};

</script>
<!--todo: 在社区旁边增加一个发帖键-->

<template>
  <div style="width: 100vw; height: 100vh; display: flex; flex-direction: column;">
    <!-- 固定顶部搜索栏 -->
    <div style="flex-shrink: 0; padding: 20px; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-weight: 700; color: #333; font-size: 24px; margin-left: 20px;">Bot 商店</h2>
        <div style="display: flex; align-items: center; gap: 10px;">
          <input
              type="text"
              placeholder="搜索"
              style="width: 400px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; outline: none;"
          />
        </div>
        <button style="border: none; background: #007bff; color: #fff; padding: 10px 20px; border-radius: 4px; cursor: pointer; transition: background 0.3s;">
          上架 Bot
        </button>
      </div>
    </div>

    <!-- 展示部分：占据剩余全部高度，并且内部可滚动 -->
    <div style="flex-grow: 1; overflow-y: auto; padding: 20px; background-color: #f8f8f8;">
      <!-- 灰色占位段位符 -->
      <div style="width: 100%; height: 150px; background-color: #e0e0e0; margin-bottom: 20px;"></div>

      <!-- 推荐栏和选择栏（缩小高度，布局保持紧凑） -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <button class="recommend" @click="recommend">
          推荐
        </button>
        <button class="recommend" @click="getBots">
          获取
        </button>
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
            <img
                :src="bot.image"
                alt="Bot Image"
                loading="lazy"
                style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 12px;cursor: pointer;"
            />
            <!-- 标题和作者信息 -->
            <div style="flex-grow: 1;">
              <!-- 机器人标题 -->
              <h3
                  style="font-size: 18px; font-weight: 600; color: #333; margin: 0; cursor: pointer;"
                  @click.stop="goToDetails(bot.title)"
              >
                {{ bot.title }}
              </h3>
              <!-- 作者信息：头像 + 名称 -->
              <div style="display: flex; align-items: center; margin-top: 4px;">
                <img
                    :src="bot.author.avatar"
                    alt="Author Image"
                    style="width: 20px; height: 20px; border-radius: 50%; cursor: pointer; margin-right: 6px;"
                    @click.stop="goToAuthorPage(bot.author)"
                />
                <span
                    style="font-size: 14px; color: #555; cursor: pointer;"
                    @click.stop="goToAuthorPage(bot.author)"
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
              <i class="iconfont">&#xe600;</i> {{ bot.views }}
            </span>
            <span style="font-size: 14px; color: #999;">
              <i class="iconfont">&#xe601;</i> {{ bot.likes }}
            </span>
            <span style="font-size: 14px; color: #999;">
              <i class="iconfont">&#xe602;</i> {{ bot.comments }}
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



