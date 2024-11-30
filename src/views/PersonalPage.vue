<template>
  <div class="dashboard-container" :style="dashboardStyles">
    <!-- 头部栏 -->
    <div class="header" :style="headerStyles">
      <div class="profile-section" :style="profileSectionStyles">
<!--        <img class="profile-avatar" :src="userAvatar" alt="User Avatar" :style="profileAvatarStyles"/>-->
        <AvatarComponent
            :size="50"
            :image="userAvatar"
            :name="userSpaceName"
        />
        <div class="user-info" :style="userInfoStyles">
          <div class="user-basic-info" :style="userBasicInfoStyles">
            <span :style="userNameStyles">{{ userSpaceName }}</span>
            <span v-if="userHandle" :style="userHandleStyles">{{ userHandle }}</span>
          </div>
          <p v-if="userDescription" :style="userDescriptionStyles">{{ userDescription }}</p>
          <div v-if="followingCount !== null && followerCount !== null && likeCount !== null" class="user-stats"
               :style="userStatsStyles">
            <span :style="statStyles">得分 {{ followingCount }}</span>
            <span :style="statStyles">排名 {{ followerCount }}</span>
            <span :style="statStyles">获赞 {{ likeCount }}</span>
          </div>
        </div>
      </div>
      <div class="header-actions" :style="headerActionsStyles">
        <button v-if="followButtonText" @click="followUser" :style="followButtonStyles">{{ followButtonText }}</button>
        <button v-if="showShareButton" @click="shareProfile" :style="shareButtonStyles">分享</button>
        <button v-if="showMoreOptionsButton" @click="moreOptions" :style="moreOptionsButtonStyles">...</button>
      </div>
    </div>

    <!-- 选项栏和搜索框 -->
    <div class="toolbar" :style="toolbarStyles">
      <div class="options" :style="optionsStyles">
        <button v-for="(option, index) in options" :key="index" @click="selectOption(option)"
                :style="optionButtonStyles">
          {{ option.name }}
        </button>
      </div>
      <div style="display: flex; flex-direction: column">
        <button @click="isModalVisible=!isModalVisible" :style="viewButtonStyles" style="margin-bottom: 10px">
          创建机器人
        </button>
        <div class="search-filter" :style="searchFilterStyles">
          <input type="text" v-model="searchQuery" :placeholder="searchPlaceholder" :style="searchInputStyles"/>
          <button @click="search" :style="searchButtonStyles">🔍搜索</button>
          <select v-model="selectedFilter" :style="filterSelectStyles">
            <option v-for="filter in filters" :key="filter.value" :value="filter.value">
              {{ filter.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 网格记录展示 -->
    <div class="robot-grid" :style="robotGridStyles">
      <div class="robot-card" v-for="robot in filteredRobots" :key="robot.id" :style="robotCardStyles">
        <div :style="robotHeaderStyles">
<!--          <img :src="robot.icon || defaultRobotIcon" alt="Robot Icon" :style="robotIconStyles"/>-->
          <AvatarComponent
              :size="40"
              :image="robot.icon || defaultRobotIcon"
              :name="robot.name"
          />
          <h3 :style="robotNameStyles">{{ robot.name }}</h3>
        </div>
        <p :style="robotDescriptionStyles">{{ robot.description }}</p>
        <button @click="setRobot(robot)" :style="viewButtonStyles">{{ viewButtonText }}</button>
      </div>
    </div>
    <!-- Element Plus Dialog -->
    <el-dialog
        v-model="isModalVisible"
        title="创建机器人"
        :before-close="handleClose"
        width="400px"
    >
      <!-- 表单内容 -->
      <el-form :model="form" ref="form" label-width="200px">
        <!-- 用例选择 -->
        <el-form-item label="您希望它可以用于：" required>
          <el-select v-model="form.useCase" placeholder="请选择">
            <el-option label="语音识别" value="transcription"></el-option>
            <el-option label="生成图片" value="image-generation"></el-option>
            <el-option label="图片识别" value="image-recognition"></el-option>
            <el-option label="文本生成" value="image-recognition"></el-option>
          </el-select>
        </el-form-item>

        <!-- 机器人名称 -->
        <el-form-item label="机器人名称：" required>
          <el-input v-model="form.robotName" placeholder="请输入机器人名称"></el-input>
        </el-form-item>

        <!-- 机器人描述 -->
        <el-form-item label="机器人描述：" required>
          <el-input
              v-model="form.robotDescription"
              placeholder="请输入机器人的描述"
              type="textarea"
              rows="4"
          ></el-input>
        </el-form-item>

        <!-- 底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>

</template>
<!--todo: 自定义机器人详情界面，不应该弹出对话，请参考figma或者再向我确认-->
//this.$router.push({ path: `/BotManager` });这里弹到机器人管理界面,具体功能并未详细设计
<script>
import AvatarComponent from "@/views/AvatarComponent.vue";

export default {
  name: 'PersonalPage',
  components: {AvatarComponent},
  props: {
    userAvatar: {
      type: String,
      default: 'path/to/avatar.png'
    },
    userSpaceName: {
      type: String,
      default: `个人空间`
    },
    userHandle: {
      type: String,
      default: ''
    },
    userDescription: {
      type: String,
      default: ''
    },
    followingCount: {
      type: Number,
      default: null
    },
    followerCount: {
      type: Number,
      default: null
    },
    likeCount: {
      type: Number,
      default: null
    },
    followButtonText: {
      type: String,
      default: ''
    },
    showShareButton: {
      type: Boolean,
      default: false
    },
    showMoreOptionsButton: {
      type: Boolean,
      default: false
    },
    createButtonText: {
      type: String,
      default: '创建 Bot'
    },
    searchPlaceholder: {
      type: String,
      default: '搜索'
    },
    viewButtonText: {
      type: String,
      default: '查看详情'
    },
    defaultRobotIcon: {
      type: String,
      default: 'path/to/icon.png'
    },
    options: {
      type: Array,
      default: () => [
        {name: 'Bots'},
        {name: '评价'},
      ]
    },
    filters: {
      type: Array,
      default: () => [
        {label: '全部', value: 'all'},
        {label: '激活的', value: 'active'},
        {label: '已禁用的', value: 'disabled'},
      ]
    },
    dashboardStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: '20px',
        backgroundColor: '#f4f5f7'
      })
    },
    headerStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      })
    },
    profileSectionStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        alignItems: 'center'
      })
    },
    profileAvatarStyles: {
      type: Object,
      default: () => ({
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '10px'
      })
    },
    userInfoStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        flexDirection: 'column'
      })
    },
    userBasicInfoStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        alignItems: 'center'
      })
    },
    userNameStyles: {
      type: Object,
      default: () => ({
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginRight: '10px'
      })
    },
    userHandleStyles: {
      type: Object,
      default: () => ({
        color: '#777'
      })
    },
    userDescriptionStyles: {
      type: Object,
      default: () => ({
        marginTop: '5px',
        color: '#555'
      })
    },
    userStatsStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        marginTop: '10px'
      })
    },
    statStyles: {
      type: Object,
      default: () => ({
        marginRight: '15px',
        color: '#333'
      })
    },
    headerActionsStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        alignItems: 'center'
      })
    },
    followButtonStyles: {
      type: Object,
      default: () => ({
        backgroundColor: '#7269ef',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold',
        marginRight: '10px'
      })
    },
    shareButtonStyles: {
      type: Object,
      default: () => ({
        backgroundColor: '#f4f5f7',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '5px',
        marginRight: '10px'
      })
    },
    moreOptionsButtonStyles: {
      type: Object,
      default: () => ({
        backgroundColor: '#f4f5f7',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '5px'
      })
    },
    toolbarStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      })
    },
    optionsStyles: {
      type: Object,
      default: () => ({
        display: 'flex'
      })
    },
    optionButtonStyles: {
      type: Object,
      default: () => ({
        marginRight: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#555'
      })
    },
    searchFilterStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      })
    },
    searchInputStyles: {
      type: Object,
      default: () => ({
        border: 'none',
        outline: 'none',
        fontSize: '0.9rem',
        marginRight: '5px'
      })
    },
    searchButtonStyles: {
      type: Object,
      default: () => ({
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        marginRight: '5px'
      })
    },
    filterSelectStyles: {
      type: Object,
      default: () => ({
        border: 'none',
        outline: 'none',
        fontSize: '1rem'
      })
    },
    robotGridStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'space-between',
        flexGrow: 1
      })
    },
    robotCardStyles: {
      type: Object,
      default: () => ({
        backgroundColor: '#fff',
        border: '1px solid #e3e4e8',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.05)',
        flex: '1 1 calc(33% - 20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      })
    },
    robotHeaderStyles: {
      type: Object,
      default: () => ({
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
      })
    },
    robotIconStyles: {
      type: Object,
      default: () => ({
        width: '40px',
        height: '40px',
        marginRight: '10px'
      })
    },
    robotNameStyles: {
      type: Object,
      default: () => ({
        fontSize: '1.2rem',
        fontWeight: 'bold',
        margin: '0'
      })
    },
    robotDescriptionStyles: {
      type: Object,
      default: () => ({
        color: '#777',
        marginBottom: '20px'
      })
    },
    viewButtonStyles: {
      type: Object,
      default: () => ({
        backgroundColor: '#7269ef',
        color: 'white',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold'
      })
    }
  },
  data() {
    return {
      botData: null,
      // 控制弹窗的显示与隐藏
      isModalVisible: false,
      // 表单数据
      form: {
        useCase: 'transcription', // 默认选择的用例
        robotName: '',
        robotDescription: '', // 新增的描述字段
      },
      id: 1,
      searchQuery: '',
      selectedFilter: 'all',
      robots: [

      ]
    };
  },
  computed: {
    filteredRobots() {
      let filtered = this.robots;
      if (this.searchQuery) {
        filtered = filtered.filter(robot => robot.name.includes(this.searchQuery));
      }
      if (this.selectedFilter !== 'all') {
        filtered = filtered.filter(robot => robot.status === this.selectedFilter);
      }
      return filtered;
    },
  },
  methods: {
    async submitForm() {
      // 你可以在这里处理表单提交的逻辑，例如通过 API 发送请求
      alert(
          `您选择了: ${this.form.useCase}，机器人名称: ${this.form.robotName}，描述: ${this.form.robotDescription}`
      );
      let typeid = 0;
      if(this.form.useCase === '语音识别'){
        typeid = 2;
      }else if (this.form.useCase === '图片识别'){
        typeid = 1;
      }else if (this.form.useCase === '生成图片'){
        typeid = 3;
      }
      const form = new FormData();
      form.append('typeid', typeid);
      form.append('bot_name', this.form.robotName);
      form.append('description', this.form.robotDescription);
      await this.$post('create_bot/', null, form, 'data');
      this.handleClose(); // 提交后关闭弹窗
    },
    handleClose() {
      this.form.robotName = ''; // 清空表单数据
      this.form.useCase = 'transcription'; // 重置默认值
      this.form.robotDescription = ''; // 清空描述字段
      this.isModalVisible = false;
    },
    createRobot() {

    },
    // 处理按钮点击的方法
    selectOption(option) {
      if (option.name === 'Bots') {
        // 处理Bots按钮的逻辑
        console.log('Bots按钮被点击');
        this.$router.push({path: '/BotShop'});
        // 例如：导航到Bots页面或显示Bots相关信息
      } else if (option.name === '作品') {
        // 处理作品按钮的逻辑
        console.log('作品按钮被点击');
      } else if (option.name === '评价') {
        // 处理评价按钮的逻辑
        console.log('评价按钮被点击');
        this.$router.push({
          path: '/PersonalComment',
          query: {creator_id: this.id}
        });

      } else if (option.name === '操作') {
        // 处理操作按钮的逻辑
        console.log('操作按钮被点击');
        // 例如：显示操作指导或执行某个操作
      } else if (option.name === '工作流') {
        // 处理工作流按钮的逻辑
        console.log('工作流按钮被点击');
        // 例如：显示工作流管理界面
      } else if (option.name === '图像流') {
        // 处理图像流按钮的逻辑
        console.log('图像流按钮被点击');
        // 例如：显示图像流分析工具
      } else if (option.name === '知识库') {
        // 处理知识库按钮的逻辑
        console.log('知识库按钮被点击');
        // 例如：导航到知识库页面或显示知识库内容
      } else if (option.name === '卡片') {
        // 处理卡片按钮的逻辑
        console.log('卡片按钮被点击');
        // 例如：显示卡片信息或执行与卡片相关的操作
      } else {
        // 如果没有匹配的选项，可以在这里处理默认逻辑
        console.log('未知按钮被点击');
      }
    },
    setRobot(robot) {
      this.$router.push({path: `/BotManager`});
    },
    async get_bot_list() {
      this.id = this.$route.query.creator_id;
      console.log(this.id);
      try {
        await this.$get('user_botlist/', {id:this.$route.query.creator_id}, 'botData');
        console.log(this.botData);
        this.robots = this.botData.bots;
      } catch (error) {
        console.error('Error fetching bot list: ', error);
      }
    },
    // 处理关注按钮点击
    followUser() {
      // 可以传递一些参数给父组件，例如 userHandle
      this.$emit('follow-user', this.userHandle);
    },

    // 处理分享按钮点击
    shareProfile() {
      // 同样传递给父组件一些参数（比如 userHandle 或者其他数据）
      this.$emit('share-profile', { userHandle: this.userHandle });
    },

    // 处理更多选项按钮点击
    moreOptions() {
      this.$emit('more-options', { userHandle: this.userHandle });
    },
    // 处理查看机器人
    viewRobot() {
      this.$emit('view-robot');
    }
  },
  mounted() {
    this.get_bot_list();
  }
};
</script>

<style scoped>
/* 样式已改为内联样式，通过props传递，删除此部分 */
</style>