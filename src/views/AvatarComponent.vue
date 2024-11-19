<template>
  <div
      :style="avatarStyle"
      :class="['avatar', shape]"
      @click="handleClick"
      @mouseover="handleHover(true)"
      @mouseleave="handleHover(false)"
  >
    <!-- 如果有头像路径，则显示图片 -->
    <img
        v-if="src"
        :src="src"
        :alt="alt"
        :style="imageStyle"
        @error="handleImageError"
    />
    <!-- 如果没有头像路径，则显示名称首字母 -->
    <span v-else :style="initialStyle">
      {{ displayInitial }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "", // 头像路径
    },
    alt: {
      type: String,
      default: "Avatar", // 图片的替代文字
    },
    name: {
      type: String,
      default: "", // 用户名称，用于占位字符
    },
    size: {
      type: [Number, String],
      default: 50, // 头像大小（宽度和高度）
    },
    shape: {
      type: String,
      default: "circle", // 头像形状，支持 "circle" 和 "square"
      validator: (value) => ["circle", "square"].includes(value), // 限定形状
    },
    bgColor: {
      type: String,
      default: "#ccc", // 占位字符背景颜色
    },
    textColor: {
      type: String,
      default: "#fff", // 占位字符颜色
    },
    initialSize: {
      type: [Number, String],
      default: 50, // 占位字符相对于组件大小的百分比（默认 50%）
    },
  },
  data() {
    return {
      isHovered: false, // 用于处理悬停状态
    };
  },
  computed: {
    avatarStyle() {
      return {
        width: this.size + "px",
        height: this.size + "px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: this.bgColor,
        color: this.textColor,
        cursor: this.isHovered ? "pointer" : "default",
        borderRadius: this.shape === "circle" ? "50%" : "4px", // 动态设置形状
        overflow: "hidden",
        position: "relative",
      };
    },
    imageStyle() {
      return {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      };
    },
    initialStyle() {
      return {
        fontSize: (this.size * this.initialSize) / 100 + "px", // 根据百分比计算字体大小
        fontWeight: "bold",
        textTransform: "uppercase", // 转为大写
      };
    },
    displayInitial() {
      // 如果名称存在，则返回首字母；否则返回 "?" 作为占位
      return this.name ? this.name.charAt(0) : "?";
    },
  },
  methods: {
    handleImageError() {
      console.error("头像图片加载失败，显示占位字符。");
      this.$emit("error"); // 触发错误事件
    },
    handleClick() {
      console.log("头像被点击");
      this.$emit("click"); // 触发点击事件
    },
    handleHover(isHovered) {
      this.isHovered = isHovered;
      this.$emit("hover", isHovered); // 触发悬停事件
    },
  },
};
</script>

<style scoped>
.avatar {
  text-align: center;
  line-height: 1;
}
</style>
