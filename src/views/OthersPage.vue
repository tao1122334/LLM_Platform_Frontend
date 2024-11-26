<template>
  <div style="display: flex; flex-grow: 1;">
    <PersonalPage
        :user-avatar="'path/to/new-avatar.png'"
        :user-space-name="'PlayWithAI'"
        :user-handle="'@PlayWithAI'"
        :user-description="'一个对万物充满好奇的程序员，喜欢分享和学习新技术。'"
        :following-count="120"
        :follower-count="3000"
        :like-count="500"
        :follow-button-text="'关注'"
        :show-share-button="true"
        :show-more-options-button="true"
        :create-button-text="'发帖'"
        :options="[{ name: 'Bots' }, { name: '作品' }, { name: '评价' }]"
        :filters="[{ label: '全部', value: 'all' }, { label: '最新', value: 'new' }, { label: '热门', value: 'hot' }]"
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
    PersonalPage,
  },
  data(){
    return {
      userData: null
    }
  },
  methods: {
    handleCreateRobot() {
      console.log('Creating a new robot...');
    },
    handleSelectOption(option) {
      console.log(`Option selected: ${option.name}`);
    },
    handleViewRobot(robot) {
      console.log(`Viewing details for robot: ${robot.name}`);
    },
    handleFollowUser() {
      console.log('Follow user clicked');
    },
    handleShareProfile() {
      console.log('Share profile clicked');
    },
    handleMoreOptions() {
      console.log('More options clicked');
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
    //   todo: 根据跳转传来的id，向后端请求个人信息 url:get_user_msg 已完成
    const id = this.$route.query.creator_id;
    this.getUserMsg(id);

  }
};
</script>

<style scoped>

</style>