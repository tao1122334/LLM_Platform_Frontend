<template>
  <div
      style="
      max-width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      box-sizing: border-box;
    "
  >
    <!-- 文件循环渲染 -->
    <div
        v-for="(file, index) in files"
        :key="index"
        style="
        display: inline-flex;
        align-items: center;
        padding: 5px;
        min-width: 100px;
        flex-shrink: 0;
      "
    >
      <template v-if="isImage(file)">
        <!-- 图片展示 -->
        <img
            :src="getImageSrc(file)"
            alt="Uploaded Image"
            style="
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: 10px;
          "
        />
      </template>

      <template v-else>
        <!-- 文件图标和名称展示 -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="margin-right: 10px;"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <span>{{ file.name }}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 判断文件是否为图片类型
    isImage(file) {
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return file && imageTypes.includes(file.type);
    },
    // 获取图片的 URL
    getImageSrc(file) {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating object URL:', error);
        return ''; // 如果出错，返回空字符串
      }
    }
  }
};
</script>
