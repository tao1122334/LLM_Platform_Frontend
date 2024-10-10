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
  },
};
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>