<script>
export default {

}
</script>

<template>
  <div style="display: flex; flex-direction: column; width: 15vw; height: 95vh">

    <div style="font-size: 1.5em; margin-bottom: 1em">
      LLM Platform
    </div>

    <div style="display: flex; flex-direction: column; gap: 1em">
      <div @click="this.$router.push({path: '/'});" style="cursor: pointer">
        主页
      </div>
      <div @click="this.$router.push({path: '/PersonalPage'});" style="cursor: pointer">
        个人空间
      </div>
      <div @click="this.$router.push({path: '/BotShop'});" style="cursor: pointer">
        Bot 商店
      </div>
      <div>
        导出用户入账流水
      </div>
      <div>
        导出Bot评分
      </div>
    </div>

    <div style="margin-top: auto;">
      <div>
        用户头像
      </div>
      <div>
        用户名
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>