<template>
  <div>
    <!-- 将父组件的数据传递给 PersonalPage 组件 -->
    <PersonalPage
        :user-avatar="userAvatar"
        :user-space-name="userSpaceName"
        :user-handle="userHandle"
        :user-description="userDescription"
        :following-count="followingCount"
        :follower-count="followerCount"
        :like-count="likeCount"
        :follow-button-text="followButtonText"
        :show-share-button="showShareButton"
        :show-more-options-button="showMoreOptionsButton"
        :create-button-text="createButtonText"
        :options="options"
        :filters="filters"
        @create-robot="handleCreateRobot"
        @select-option="handleSelectOption"
        @view-robot="handleViewRobot"
        @follow-user="handleFollowUser"
        @share-profile="handleShareProfile"
        @more-options="handleMoreOptions"
    />
  </div>
</template>

<script>
import PersonalPage from './PersonalPage.vue';

export default {
  components: {
    PersonalPage
  },
  data() {
    return {
      // 存储父组件的数据
      userAvatar: 'path/to/avatar.png',
      userSpaceName: '个人空间',
      userHandle: '@UserHandle',
      userDescription: '一个程序员，喜欢学习新技术。',
      followingCount: 120,
      followerCount: 3000,
      likeCount: 500,
      followButtonText: '关注',
      showShareButton: true,
      showMoreOptionsButton: true,
      createButtonText: '创建机器人',
      options: [
        { name: 'Bots' },
        { name: '作品' },
        { name: '评价' }
      ],
      filters: [
        { label: '全部', value: 'all' },
        { label: '最新', value: 'new' },
        { label: '热门', value: 'hot' }
      ]
    };
  },
  methods: {
    handleCreateRobot() {
      console.log("Create robot action triggered");
    },
    handleSelectOption(option) {
      console.log("Selected option:", option);
    },
    handleViewRobot(robot) {
      console.log("View robot:", robot);
    },
    handleFollowUser() {
      console.log("Follow user action triggered");
    },
    handleShareProfile() {
      console.log("Share profile action triggered");
    },
    handleMoreOptions() {
      console.log("More options triggered");
    },
    async getUserMsg(id) {
      try {
        await this.$get('get_user_msg', {id}, 'userData',);
        console.log(this.userData)
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
    this.getUserMsg(creator_id)
  },
};
</script>
