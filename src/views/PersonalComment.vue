<script setup>
import { ref } from 'vue';

// 个人说明书信息
const botInfo = ref({
  id: 1,
  title: "个人评论区",
  favorites: 14,
  likes: 207,
  description: "这个人什么也没有留下",
});

// 作者信息
const authorInfo = ref({
  id: 1,
  name: "PlayWithAI",
  avatar: "https://via.placeholder.com/50"
});

// 评论数据
const comments = ref([
  { id: 1, content: '这是一条评论', author: '用户A' },
  { id: 2, content: '这是另一条评论', author: '用户B' }
]);

// 评论表单数据
const newComment = ref('');

// 点赞和收藏状态
const likeData = ref(false);
const collectData = ref(false);

// 提交评论的函数
function submitComment() {
  if (newComment.value.trim() === '') return;
  comments.value.push({
    id: comments.value.length + 1,
    content: newComment.value,
    author: '用户C' // 这里可以替换为实际的用户名称
  });
  newComment.value = ''; // 清空输入框
}

// 点赞功能
function toggleLike() {
  likeData.value = !likeData.value;
}

// 收藏功能
function toggleCollect() {
  collectData.value = !collectData.value;
}
</script>

<template>
  <div class="comment-section">
    <!-- 个人说明书信息 -->
    <div class="bot-info">
      <img :src="authorInfo.avatar" alt="Avatar" class="avatar">
      <div class="bot-details">
        <h2>{{ botInfo.title }}</h2>
        <p>作者：{{ authorInfo.name }}</p>
        <p>喜欢：{{ botInfo.likes }} 次</p>
        <p>收藏：{{ botInfo.favorites }} 次</p>
        <p>{{ botInfo.description }}</p>
        <button @click="toggleLike">{{ likeData ? '已点赞' : '点赞' }}</button>
        <button @click="toggleCollect">{{ collectData ? '已收藏' : '收藏' }}</button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments_ares">
    <div class="comments">
      <h3>评论列表</h3>
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <strong>{{ comment.author }}:</strong>
        <p>{{ comment.content }}</p>
      </div>
    </div> </div>


    <!-- 评论表单 -->
    <div class="comment-form">
      <h3>发表评论</h3>
      <textarea v-model="newComment" placeholder="写下你的评论..."></textarea>
     <div>
  <button @click="submitComment">提交评论</button>
  <span style="display: inline-block; width: 400px;"></span>
  <button  @click="this.$router.push({path: '/PersonalPage'});">返回</button>
</div>
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  max-width: 2000px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.bot-info {
  width: 500px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 15px;
}

.bot-details {
  flex: 1;
}

.bot-details h2 {
  margin: 0 0 10px 0;
}

.bot-details p, .bot-details ul {
  margin: 5px 0;
}

.bot-details button {
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.bot-details button:hover {
  background-color: #0056b3;
}

.comments_ares {
    width: 500px; /* 固定宽度 */
    height: 400px; /* 固定高度 */
    overflow-y: auto; /* 当内容超出高度时显示垂直滚动条 */
    overflow-x: hidden; /* 隐藏水平滚动条 */
    border: 1px solid #ccc; /* 边框，可选 */
    padding: 10px; /* 内边距，可选 */
  }

.comments_ares {
  margin-bottom: 10px; /* 评论之间的间距，可选 */
}


.comments {
  margin-bottom: 20px;
}

.comment {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.comment-form textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.comment-form button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.comment-form button:hover {
  background-color: #1e7e34;
}
</style>