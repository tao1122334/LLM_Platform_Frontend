<template>
  <div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <!-- 顶部导航栏 -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f5f5f5; font-size: 10px">
      <h1>社区 (帖子数量: {{ postCount }})</h1>
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
          <img
              :src="comment.avatar"
              alt="头像"
              style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"
              @click="goToUserSpace(comment.username)">
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
            <button
                @click="likeComment(index)"
                style="background: none; border: none; cursor: pointer; margin-left: 8px;">
              👍 赞 {{ comment.likes }}
            </button>
            <button
                style="background: none; border: none; cursor: pointer; margin-left: 8px;">
              💬 {{ comment.replies }} 评论
            </button>
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
export default {
  data() {
    return {
      postCount: 2, // 初始帖子数量
      data:null,
      comments: [
        {
          username: 'tlz9703',
          content: 'good',
          likes: 1,
          replies: 0,
          avatar: 'https://via.placeholder.com/40'
        },
        {
          username: 'PlayWithAI',
          content: '精彩案例',
          likes: 3,
          replies: 1,
          avatar: 'https://via.placeholder.com/40'
        }
      ],
      isPostModalOpen: false, // 控制弹窗显示
      newPost: { // 存储新帖内容
        title: '',
        content: ''
      }
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
    async submitPost() {
      if ( this.newPost.content) {
        const form = new FormData();
        form.append('comment', this.newPost.content);
        form.append('id',this.$route.query.bot_id)
        await this.$post('comment4bot/', null, form, 'data');
        console.log(this.data)
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
    }
  },
  async mounted() {
    await this.$get('comments4bot', {id: this.$route.query.bot_id}, 'data');
    console.log(this.data)
  }
};
</script>
