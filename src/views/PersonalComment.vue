
<script>
export default {
  data() {
    return {
      // 个人说明书信息
      botInfo: {
        id: 1,
        title: "个人评论区",
        favorites: 14,
        likes: 207,
        description: "这个人什么也没有留下",
      },
      // 作者信息
      authorInfo: {
        id: '',
        name: "",
        email:"",
        avatar: "https://via.placeholder.com/50"
      },

      comments:[],
      // 评论表单数据
      newComment: '',
      Rate: '',
      errorMessage: '' // 错误信息
    };
  },

  methods: {
    //控制星星评分
    controlElementById(Rate) {
      this.Rate = Rate;
      // 获取五个星星
      const star1 = document.getElementById('star1');
      const star2 = document.getElementById('star2');
      const star3 = document.getElementById('star3');
      const star4 = document.getElementById('star4');
      const star5 = document.getElementById('star5');

      // 清除之前的样式
      star1.style.backgroundColor = '';
      star2.style.backgroundColor = '';
      star3.style.backgroundColor = '';
      star4.style.backgroundColor = '';
      star5.style.backgroundColor = '';

      // 根据评分改变样式
      for (let i = 1; i <= Rate; i++) {
        const star = document.getElementById('star' + i);
        star.style.backgroundColor = 'yellow'; // 将元素背景色改为黄色
      }
    },
    // 提交评论
    async submitComment() {
      // 检查评论内容和评分是否为空
      if (this.newComment.trim() === '') {
        this.errorMessage = '评论内容不能为空';
        return;
      }
      if (this.Rate === null) {
        this.errorMessage = '评分不能为空';
        return;
      }

      // 清除错误信息
      this.errorMessage = '';

      const form = new FormData();
      form.append('comment', this.newComment);
      form.append('id', this.$route.query.creator_id);
      form.append('rating', this.Rate);

      try {
        await this.$post('comment4user/', null, form, 'data');
        console.log(this.data);
        this.newComment = ''; // 清空输入框.
        this.Rate = null;
        // 刷新评论列表
        const creator_id = this.$route.query.creator_id;
        await this.fetchComments(creator_id);
      } catch (error) {
        this.errorMessage = '提交评论失败';
        console.error(error);
      }
    },

    async fetchComments(creator_id) {
      try {
        await this.$get('comments4user', {id: creator_id}, 'data');
        console.log('获取评论成功:', this.data);
        // 在这里你可以根据获取到的评论数据更新 this.comments
    if (this.data.success && Array.isArray(this.data.comments)) {
      // 清空当前的评论列表
      this.comments = [];

      // 遍历获取到的评论数据，并将其添加到 this.comments 数组中
      this.data.comments.forEach(comment => {
        this.comments.push({
          id: comment.id,
          content: comment.content,
          createdAt: comment.created_at.substring(0,10), // 假设时间戳字段是 created_at
          author: comment. user_id__username, // 假设用户名字段是 user_id__username
          rating: comment.rating // 假设评分字段是 rating
        });
      });
    } else {
      console.error('获取到的评论数据格式不正确');
    }
      } catch (error) {
        console.error('获取评论失败:', error);
      }
    },
        async getUserMsg(id) {
      try {
        await this.$get('get_user_msg', {id}, 'userData',);
        let msg;
        msg=this.userData.user_dict;
        this.authorInfo.name =msg.username;
        this.authorInfo.email = msg.email;
        this.authorInfo.avatar = msg.avatar;
        this.authorInfo.id = msg.id;
        //这里需要对传回来的个人信息结构进行分析,处理this.userData
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    },
  },
  mounted() {
    const route = this.$route; // 获取当前路由对象
    console.log('当前路由参数：', route.query);
    const creator_id = route.query.creator_id; // 获取 query 参数
    this.fetchComments(creator_id);
    this.getUserMsg(creator_id)
  },

};
</script>

<template>
  <div class="comment-section">
    <!-- 个人说明书信息 -->
    <div class="bot-info">
      <img :src="authorInfo.avatar" alt="Avatar" class="avatar">
      <div class="bot-details">
        <h2>{{ botInfo.title }}</h2>
        <p>作者：{{ authorInfo.name }}</p>
        <p>ID：{{ authorInfo.id }}</p>
        <p>email：{{ authorInfo.email }}</p>
        <p>喜欢：{{ botInfo.likes }} 次</p>
        <p>收藏：{{ botInfo.favorites }} 次</p>
        <p>{{ botInfo.description }}</p>
      </div>
    </div>

    <!-- 评论列表 -->
    <h3 style="background-color: rgba(128,128,128,0.25); width:75px" >评论列表</h3>
    <div class="comments_ares">
      <div class="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <strong>用户:{{ comment.author }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;创建于：{{ comment.createdAt }}</strong>
          <p>评分：{{comment.rating }}</p>
          <p>内容：{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- 评论表单 -->
    <div class="comment-form">
        <h3 style="background-color: rgba(128,128,128,0.25); width:40px" >评分</h3>
  <div class="star-rating">
     <p>你的评分是{{ Rate===''?'':':'+'  '+Rate }}</p>
    <input type="radio" id="star5" value="5" v-model="Rate"  />
    <label for="star5" class="star" @click="controlElementById(5)">&#9733;</label>
    <input type="radio" id="star4" value="4" v-model="Rate" />
    <label for="star4" class="star" @click="controlElementById(4)">&#9733;</label>
    <input type="radio" id="star3" value="3" v-model="Rate" />
    <label for="star3" class="star" @click="controlElementById(3)">&#9733;</label>
    <input type="radio" id="star2" value="2" v-model="Rate" />
    <label for="star2" class="star" @click="controlElementById(2)">&#9733;</label>
    <input type="radio" id="star1" value="1" v-model="Rate" />
    <label for="star1" class="star" @click="controlElementById(1)">&#9733;</label>
  </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  <textarea v-model="newComment" placeholder="写下你的评论..."></textarea>
  <button @click="submitComment">提交评论</button>
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
  width: 700px; /* 固定宽度 */
  height: 400px; /* 固定高度 */
  overflow-y: auto; /* 当内容超出高度时显示垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
  border: 1px solid #ccc; /* 边框，可选 */
  padding: 10px; /* 内边距，可选 */
}

.comments_ares {
  margin-bottom: 1px; /* 评论之间的间距，可选 */
}


.comments {
  width: 100%;
  margin-bottom: 20px;
}

.comment {
  margin-bottom: 20px;
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

.star-rating {
  direction: rtl;
}

.star-rating label {
  display: inline-block;
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: filter 0.3s ease-in-out;
  opacity: 1;
}

.star-rating label:hover,
.star-rating label:hover:before {
  opacity: 1;
  filter: brightness(1.5); /* 增加亮度，模拟黄色高亮效果 */
}

.star-rating label:before {
  display: none;
  width: 30px;
  height: 30px;
  opacity: 1;
  transition: opacity 0.2s linear;
}

.star-rating input[type="radio"]:checked ~ label:before {
  opacity: 1;
}
</style>