<template>
  <div>
    <!-- 根据 mode 渲染内容 -->
    <p v-html="renderedText" class="message-text" v-if="mode === 'typewriter'"></p>
    <p v-html="renderMarkdown(message)" class="message-text" v-if="mode === 'direct'"></p>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  props: {
    message: { // 接收父组件传递的每个消息内容
      type: String,
      required: true
    },
    id: { // 接收父组件传递的消息 ID
      type: Number,
      required: false
    },
    mode: { // 接收父组件传递的模式，决定是打字机效果还是直接渲染
      type: String,
      default: 'typewriter', // 默认使用打字机效果
      validator(value) {
        return value === 'typewriter' || value === 'direct';
      }
    }
  },
  data() {
    return {
      renderedText: "", // 用于存储逐字渲染后的 HTML 内容
      interval: null, // 用于存储定时器的引用
    };
  },
  watch: {
    // 监听 message 属性的变化
    message(newMessage) {
      if (newMessage) {
        if (this.mode === 'typewriter') {
          this.typeText(newMessage); // 打字机模式下触发逐字输出
        } else {
          this.renderedText = this.renderMarkdown(newMessage); // 直接渲染模式下直接渲染
        }
      }
    }
  },
  mounted() {
    // 如果组件一开始就有 message，触发相应渲染方法
    if (this.message) {
      if (this.mode === 'typewriter') {
        this.typeText(this.message);
      } else {
        this.renderedText = this.renderMarkdown(this.message);
      }
    }
  },
  methods: {
    // Markdown 渲染方法
    renderMarkdown(text) {
      try {
        // 使用 marked 解析 Markdown 文本
        this.$emit('typing-finished', this.id);
        return marked(text);
      } catch (error) {
        console.error('Markdown 渲染失败:', error);
        this.$emit('typing-finished', this.id);
        return text; // 如果解析失败，返回原始文本
      }

    },
    // 逐字输出的效果
    typeText(text) {
      clearInterval(this.interval); // 清除之前的定时器，防止重复触发

      let index = 0;
      this.renderedText = ""; // 清空已渲染的文本

      // 使用 setInterval 每隔 50ms 渲染一个字符
      this.interval = setInterval(() => {
        // 将当前部分文本渲染为 HTML
        this.renderedText = this.renderMarkdown(text.substring(0, index));
        index++;

        // 如果所有字符都渲染完毕，清除定时器
        if (index > text.length) {
          clearInterval(this.interval);
          this.$emit('typing-finished', this.id);
        }
      }, Math.floor(Math.random()*51)); // 50ms 间隔
    }
  }
};
</script>

<style scoped>
.message-text {
  background-color: #f1f1f1;
  color: black;
  padding: 10px 15px;
  border-radius: 10px;
  word-wrap: break-word;
  max-width: 60%;
  width: 100%;
  margin: 10px auto;
  font-size: 1rem;
}
</style>
