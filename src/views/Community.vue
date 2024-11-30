<template>
  <div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <!-- 顶部导航栏 -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f5f5f5; font-size: 10px">
      <h1>社区 (帖子数量: {{ comments.length }})</h1>
      <div>
        <button
            @click="refreshPage"
            style="padding: 4px 8px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
          刷新
        </button>
        <button
            @click="openPostModal"
            style="padding: 4px 8px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
          发帖
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div>
      <div
          v-for="(comment, index) in comments"
          :key="index"
          style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
        <!-- 点击头像跳转到作者空间 -->
        <div style="display: flex; align-items: center; cursor: pointer;">
<!--          <img-->
<!--              :src="comment.avatar"-->
<!--              alt="头像"-->
<!--              style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"-->
<!--              @click="goToUserSpace(comment.username)">-->
          <AvatarComponent :size="40"
                           :name="comment.username"
                           @click="goToUserSpace(comment.username)"/>
          <span style="font-weight: bold;cursor: pointer;"
                @click="goToUserSpace(comment.username)">
            @{{ comment.username }}
          </span>
        </div>
        <!-- 评论内容 -->
        <div style="margin-top: 5px;">{{ comment.content }}</div>
        <!-- 评论的操作按钮 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <div></div> <!-- 用于占位对齐 -->
          <div>
<!--            <button-->
<!--                @click="likeComment(index)"-->
<!--                style="background: none; border: none; cursor: pointer; margin-left: 8px;">-->
<!--              👍 赞 {{ comment.likes }}-->
<!--            </button>-->
<!--            <button-->
<!--                style="background: none; border: none; cursor: pointer; margin-left: 8px;">-->
<!--              💬 {{ comment.replies }} 评论-->
<!--            </button>-->
            <span>评分: {{ comment.rating }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 发帖弹窗 -->
    <div v-if="isPostModalOpen"
         style="position: fixed; top: 20%; left: 50%; transform: translateX(-50%); width: 400px; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <h2>创建新帖</h2>
<!--      <input v-model="newPost.title" placeholder="请输入标题"-->
<!--             style="width: 100%; padding: 8px; margin-bottom: 10px;"/>-->
      <textarea v-model="newPost.content" placeholder="请输入内容" rows="5"
                style="width: 100%; padding: 8px; margin-bottom: 10px;"></textarea>
      <!-- 五星好评按钮组 -->
      <div style="display: flex; justify-content: flex-start; margin-bottom: 10px;">
        <span v-for="index in 5" :key="index" @click="setStar(index)"
              :style="{'cursor': 'pointer', 'color': index <= this.newPost.star ? '#FFD700' : '#D3D3D3', 'font-size': '24px'}">
          ★
        </span>
      </div>
      <div style="display: flex; justify-content: flex-end;">
        <button @click="closePostModal"
                style="padding: 8px 16px; margin-right: 10px; cursor: pointer;">
          取消
        </button>
        <button @click="submitPost"
                style="padding: 8px 16px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarComponent from "@/views/AvatarComponent.vue";
export default {
  components: {
    AvatarComponent
  },
  data() {
    return {
      data:null,
      comments: [

      ],
      isPostModalOpen: false, // 控制弹窗显示
      newPost: { // 存储新帖内容
        title: '',
        content: '',
        star: 0
      },
      addData: null
    };
  },
  methods: {
    refreshPage() {
      alert('页面已刷新');
    },
    openPostModal() {
      this.isPostModalOpen = true; // 打开发帖弹窗
      this.newPost = { title: '', content: '' }; // 重置新帖内容
    },
    closePostModal() {
      this.isPostModalOpen = false; // 关闭发帖弹窗
    },
    // 设置评分
    setStar(starValue) {
      this.newPost.star = starValue;  // 更新评分
    },
    async submitPost() {
      if (this.newPost.content) {
        const form = new FormData();
        form.append('comment', this.newPost.content);
        form.append('id',this.$route.query.bot_id)
        form.append('star',this.newPost.star)
        // 使用 forEach 遍历 FormData 内容
        form.forEach((value, key) => {
          console.log(key, value); // 打印每个键值对
        });
        await this.$post('comment4bot/', null, form, 'addData');
        console.log(this.addData)
        // 将新帖添加到评论数组
        this.comments.push({
          username: '新用户', // 默认用户名，可根据实际需求更改
          content: this.newPost.content,
          likes: 0,
          replies: 0,
          avatar: 'https://via.placeholder.com/40'
        });
        this.postCount++; // 更新帖子数量
        this.closePostModal(); // 关闭弹窗
        alert('发帖成功！帖子已更新。');
      } else {
        alert('请输入内容');
      }
    },
    likeComment(index) {
      this.comments[index].likes++;
    },
    goToUserSpace(username) {
      this.$router.push({ path: '/OthersPage' }); // 模拟跳转到作者的空间
    },
    async getComments() {
      await this.$get('comments4bot', {id: this.$route.query.bot_id}, 'data');
      console.log("comments")
      console.log(this.data)
      this.data.comments.forEach(item => {
        this.comments.push({
          avatar: item.avatar || null,
          bot: item.bot,
          id: item.id,
          created_at: item.created_at,
          username: item.user__username,
          content: item.content,
          rating: item.rating,
          // likes: item.likes,
          // replies: item.replies,
          // avatar: item.avatar
        });

      })
    }
  },

  async mounted() {
    await this.getComments();
  }
};
</script>
