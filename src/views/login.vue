<template>
  <section>

    <img src="../assets/login.jpg" class="bg" alt=""/>
    <div class="login" v-show="!reset">
      <h2>Login</h2>
      <div class="inputBoxa">
        <input id="userid" type="text" placeholder="User id" v-model="userData.userId">
      </div>
      <div class="inputBoxa" id='pass'>
        <input id="password" type="password" placeholder="Password" v-model="userData.userPassword">
      </div>
      <div class="inputBoxa">
        <input type="submit" value="Login" style="cursor: pointer; background: #8f2c24; color: #f2f2f2" id="btn1" @click="login">
      </div>
      <div class="inputBoxa">
        <input type="submit" value="Reset Password" style="cursor: pointer; background: rgba(143,44,36,0.67); color: #f2f2f2" id="btn2" @click="()=>{reset=true}">
      </div>
    </div>

    <div class="login" v-show="reset">
      <h2>Reset Passward</h2>
      <div class="inputBoxa">
        <input id="userid2" type="text" placeholder="User id" v-model="userData.userId">
      </div>
      <div class="inputBoxa" id='pass'>
        <input id="password2" type="password" placeholder="Password" v-model="userData.userPassword">
      </div>
      <div class="inputBoxa" id='pass'>
        <input id="newpassword" type="password" placeholder="New Password" v-model="newPassword">
      </div>
      <div class="inputBoxa">
        <input type="submit" value="Confirm reset" style="cursor: pointer; background: #8f2c24; color: #f2f2f2" id="btn1" @click="changePassword">
      </div>
      <div class="inputBoxa">
        <input type="submit" value="<-" style="cursor: pointer; background: rgba(143,44,36,0.67); color: #f2f2f2" id="btn2" @click="()=>{reset=false}">
      </div>
    </div>


    <div class="flower">
      <img src="../assets/R.png" alt=""/>
      <img src="../assets/Q.png" alt=""/>
      <img src="../assets/Q.png" alt=""/>
      <img src="../assets/Q.png" alt=""/>
      <img src="../assets/R.png" alt=""/>
      <img src="../assets/Q.png" alt=""/>
      <img src="../assets/R.png" alt=""/>
      <img src="../assets/R.png" alt=""/>
    </div>
  </section>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      send: true,
      resetUid: '',
      newPassword: '',
      checkCode: '',
      see: true,
      reset: false,
      userData: {
        userId: '',
        userPassword: '',
      },
      data:null,
    };
  },
  methods: {
    async login() {
      await this.$post('login/',null,{username: this.userData.userId, password: this.userData.userPassword},'data');
      if (this.data){
        this.$router.push(`/?id=${this.userData.userId}`);
      }
    },
    async changePassword(){
      await this.$post('changePassword/',null,{username: this.userData.userId, password: this.userData.userPassword,newPassword: this.newPassword},'data','success','success');
    }
  },

  mounted() {
  }
};
</script>

<style scoped>
.login .inputBoxa i {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 28px;
  color: #8f2c24;
  cursor: pointer;
}

.login .inputBoxa.see .icon-see {
  display: none;
}

.login .inputBoxa.see .icon-nosee {
  display: block;
}

.login .inputBoxa .icon-see {
  display: block;
}

.login .inputBoxa .icon-nosee {
  display: none;
}

.flower {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.flower img {
  position: absolute;
}

@keyframes animate {
  0% {
    opacity: 0;
    top: -10px;
    transform: translateX(20px) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  20% {
    transform: translateX(-20px) rotate(45deg);
  }
  40% {
    transform: translateX(-20px) rotate(90deg);
  }
  60% {
    transform: translateX(20px) rotate(180deg);
  }
  80% {
    transform: translateX(-20px) rotate(45deg);
  }
  100% {
    top: 110%;
    transform: translateX(20px) rotate(225deg);
  }
}

.flower img:nth-child(1) {
  left: 20%;
  animation: animate 20s linear infinite;
}

.flower img:nth-child(2) {
  left: 50%;
  animation: animate 14s -2s linear infinite;
}

.flower img:nth-child(3) {
  left: 70%;
  animation: animate 12s -3s linear infinite;
}

.flower img:nth-child(4) {
  left: 5%;
  animation: animate 15s -2s linear infinite;
}

.flower img:nth-child(5) {
  left: 85%;
  animation: animate 18s -1s linear infinite;
}

.flower img:nth-child(6) {
  left: 90%;
  animation: animate 12s -1s linear infinite;
}

.flower img:nth-child(7) {
  left: 15%;
  animation: animate 14s -2s linear infinite;
}

.flower img:nth-child(8) {
  left: 60%;
  animation: animate 15s -1s linear infinite;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Calibri, serif;
}

section {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}

section .bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login {
  position: relative;
  width: 500px;
  min-height: 300px;
  padding: 60px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.login h2 {
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 2.5em;
  font-weight: 600;
  color: #c74e8a;
  margin-bottom: 10px;
}

.login .inputBoxa {
  position: relative;
}

.login .inputBoxa input {
  position: relative;
  width: 100%;
  padding: 15px 20px;
  outline: none;
  font-size: 1.25em;
  color: #8f2c24;
  border-radius: 5px;
  background: #fff;
  border: none;
  margin-bottom: 10px;
}

.login .inputBoxa ::placeholder {
  color: #8f2c24;
}

.login .inputBoxa #btn {
  position: relative;
  border: none;
  outline: none;

  color: #fff;
  cursor: pointer;
  font-size: 1.25em;
  font-weight: 500;
}

</style>
