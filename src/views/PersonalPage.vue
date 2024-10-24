<template>
  <div class="dashboard-container" :style="dashboardStyles">
    <!-- 头部栏 -->
    <div class="header" :style="headerStyles">
      <div class="profile-section" :style="profileSectionStyles">
        <img class="profile-avatar" :src="userAvatar" alt="User Avatar" :style="profileAvatarStyles" />
        <div class="user-info" :style="userInfoStyles">
          <div class="user-basic-info" :style="userBasicInfoStyles">
            <span :style="userNameStyles">{{ userSpaceName }}</span>
            <span v-if="userHandle" :style="userHandleStyles">{{ userHandle }}</span>
          </div>
          <p v-if="userDescription" :style="userDescriptionStyles">{{ userDescription }}</p>
          <div v-if="followingCount !== null && followerCount !== null && likeCount !== null" class="user-stats" :style="userStatsStyles">
            <span :style="statStyles">关注 {{ followingCount }}</span>
            <span :style="statStyles">粉丝 {{ followerCount }}</span>
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
        <button v-for="(option, index) in options" :key="index" @click="selectOption(option)" :style="optionButtonStyles">
          {{ option.name }}
        </button>
      </div>
      <div class="search-filter" :style="searchFilterStyles">
        <input type="text" v-model="searchQuery" :placeholder="searchPlaceholder" :style="searchInputStyles" />
        <button @click="search" :style="searchButtonStyles">🔍搜索</button>
        <select v-model="selectedFilter" :style="filterSelectStyles">
          <option v-for="filter in filters" :key="filter.value" :value="filter.value">
            {{ filter.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 网格记录展示 -->
    <div class="robot-grid" :style="robotGridStyles">
      <div class="robot-card" v-for="robot in filteredRobots" :key="robot.id" :style="robotCardStyles">
        <div :style="robotHeaderStyles">
          <img :src="robot.icon || defaultRobotIcon" alt="Robot Icon" :style="robotIconStyles" />
          <h3 :style="robotNameStyles">{{ robot.name }}</h3>
        </div>
        <p :style="robotDescriptionStyles">{{ robot.description }}</p>
        <button @click="setRobot(robot)" :style="viewButtonStyles">{{ viewButtonText }}</button>
      </div>
    </div>
  </div>
</template>
<!--todo: 自定义机器人详情界面，不应该弹出对话，请参考figma或者再向我确认-->
//this.$router.push({ path: `/BotManager` });这里弹到机器人管理界面,具体功能并未详细设计
<script>
export default {
  name: 'PersonalPage',
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
        { name: 'Bots' },
        { name: '操作' },
        { name: '工作流' },
        { name: '图像流' },
        { name: '知识库' },
        { name: '卡片' },
      ]
    },
    filters: {
      type: Array,
      default: () => [
        { label: '全部', value: 'all' },
        { label: '激活的', value: 'active' },
        { label: '已禁用的', value: 'disabled' },
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
      id: 1,
      searchQuery: '',
      selectedFilter: 'all',
      robots: [
        { id: 1, name: '123', description: '功能 - Function call模型，使用频率 211次', icon: '' },
        { id: 2, name: '机器人2', description: '描述2', icon: '' },
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
    createRobot() {

    },
    selectOption(option) {

    },
    setRobot(robot) {
      this.$router.push({ path: `/BotManager` });
    },
    search() {

    },
    followUser() {

    },
    shareProfile() {

    },
    moreOptions() {

    }
  },
  mounted() {
    this.id = this.$route.query.creator_id;
    console.log(this.id);
  }
};
</script>

<style scoped>
/* 样式已改为内联样式，通过props传递，删除此部分 */
</style>