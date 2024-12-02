<script>
import {ElMessageBox, ElMessage} from "element-plus";
import axios from "axios";

export default {
  data() {
    return {
      userData: null, // 用于存储从 login 组件返回的用户数据
      botTable: null,
      userTable: null,
      data: null
    };
  },
  methods: {
    // 处理充值
    handleRecharge() {
      // 使用 ElMessageBox.prompt 显示输入弹窗
      ElMessageBox.prompt("请输入充值金额", "充值", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputPattern: /^[1-9]\d*$/, // 限制只能输入正整数
        inputErrorMessage: "请输入有效的金额",
      })
          .then(async ({value}) => {
            try {
              // 构造请求体
              const formData = new FormData();
              formData.append("amount", value); // 添加充值金额

              // 发送 POST 请求
              const response = await this.$post("addbalance/", null, formData, 'data');
              console.log(this.data)
              // // 根据后端返回的内容处理逻辑
              if (this.data.success) {
                // 支付成功后的处理
                window.location.href = this.data.link; // 跳转到支付链接
                ElMessage({
                  type: "success",
                  message: `充值链接已生成，请完成支付！金额：${value} 元`,
                });
              } else {
                // 支付失败的提示
                ElMessage({
                  type: "error",
                  message: response.data.message || "充值失败，请稍后再试",
                });
              }
            } catch (error) {
              console.error(error);
              ElMessage({
                type: "error",
                message: "充值失败，服务器异常",
              });
            }
          })
          .catch(() => {
            // 用户取消时的逻辑
            ElMessage({
              type: "info",
              message: "充值已取消",
            });
          });
    },

    // 跳转到登录页面
    goToLogin() {
      this.$router.push({path: "/login"});
    },
    async SendTooken() {
      try {
        axios.get('api/SendTooken/')
            .then(response => {
              alert(response.data.msg)
              console.log(response.data); // 处理响应数据
            })
            .catch(error => {
              alert(error)
              console.error('Error:', error);
            });
      } catch (error) {
        console.error('获取机器人表失败:', error);
      }
    },
    async getChartTable() {
      try {
        axios.get('api/admin_chart/', {
          responseType: 'blob', // 关键：指定响应类型为 blob
        })
            .then((response) => {
              // 创建一个 Blob 对象
              const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });

              // 创建一个下载链接
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;

              // 设置下载文件名
              link.setAttribute('download', 'OrderTable.xlsx');

              // 触发下载
              document.body.appendChild(link);
              link.click();

              // 清理链接
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
              alert(error);
              console.error('Error downloading the file:', error);
            });
      } catch (error) {

        console.error('获取机器人表失败:', error);
      }
    },
    async getBotCommentTable() {
      try {
        axios.get('api/export_bot_comments/', {
          responseType: 'blob', // 关键：指定响应类型为 blob
        })
            .then((response) => {
              // 创建一个 Blob 对象
              const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });

              // 创建一个下载链接
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;

              // 设置下载文件名
              link.setAttribute('download', 'export_bot_comments.xlsx');

              // 触发下载
              document.body.appendChild(link);
              link.click();

              // 清理链接
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
              alert(error);
              console.error('Error downloading the file:', error);
            });
      } catch (error) {
        console.error('获取机器人表失败:', error);
      }
    },
    // TODO: url:admin_bot  接收返回的文件，并且直接让用户下载 已完成
    // 发送请求获取机器人表，并让用户下载返回的文件
    async getBotTable() {
      try {
        axios.get('api/admin_bot/', {
          responseType: 'blob', // 关键：指定响应类型为 blob
        })
            .then((response) => {
              // 创建一个 Blob 对象
              const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });

              // 创建一个下载链接
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;

              // 设置下载文件名
              link.setAttribute('download', 'bots_dashboard.xlsx');

              // 触发下载
              document.body.appendChild(link);
              link.click();

              // 清理链接
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
              alert(error);
              console.error('Error downloading the file:', error);
            });
      } catch (error) {
        console.error('获取机器人表失败:', error);
      }
    },
    // TODO: url:admin_user  接收返回的文件，并且直接让用户下载 已完成
    // 发送请求获取用户表，并让用户下载返回的文件
    async getUserTable() {
      try {
        // 发起 GET 请求，确保设置 responseType 为 blob
        const response = await axios.get('api/admin_user/', {
          responseType: 'blob', // 必须设置为 blob 以获取二进制文件
        });

        // 创建 Blob 对象
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 设置下载文件名
        link.setAttribute('download', 'users_dashboard.xlsx');

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理链接
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('File downloaded successfully!');
      } catch (error) {
        alert(error);
        console.error('Error downloading the file:', error);
      }
    },

    downloadFile(data, filename) {
      try {
        // 处理文件下载
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 设置文件名
        link.setAttribute('download', filename);

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理 DOM
        document.body.removeChild(link);
      } catch (error) {
        console.error('文件下载失败:', error);
      }
    },

  }
}
</script>

<template>
<div style="display: flex; flex-direction: column; width: 15vw; height: 95vh; background-color: #f4f6f9; padding: 1em; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
  <div style="font-size: 1.5em; margin-bottom: 2em; color: #1e90ff; font-weight: bold; text-align: center;">
    LLM Platform
  </div>

  <div style="display: flex; flex-direction: column; gap: 1.5em; font-family: 'Arial', sans-serif;">
    <a @click="this.$router.push({path: '/'});" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      主页
    </a>
    <a @click="this.$router.push({path: '/PersonalPage'});" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      个人空间
    </a>
    <a @click="this.$router.push({path: '/BotShop'});" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      Bot 商店
    </a>
    <a @click="handleRecharge" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      充值
    </a>
    <a @click="goToLogin" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      登录
    </a>
    <a @click="getUserTable" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      导出用户
    </a>
    <a @click="getBotTable" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      导出Bot
    </a>
    <a @click="getChartTable" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      导出充值记录
    </a>
    <a @click="getBotCommentTable" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      导出bot评论
    </a>
    <a @click="SendTooken" style="cursor: pointer; color: #1e90ff; padding: 0.5em; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
      发放奖励
    </a>
  </div>
</div>



</template>

<style scoped>
a:hover {
  color: #fff;                /* 文字变白 */
  font-weight: bold;          /* 加粗文字 */
  transform: scale(1.05);     /* 轻微放大按钮 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); /* 阴影效果 */
}
</style>