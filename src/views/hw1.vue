<template>
  <div style="background-color: rgba(152,255,80,0.38)">
  <div style="background-color: rgba(255,255,255,0.5);" class="header">
    <div style="font-weight: bold; font-size: 2em; display: flex; justify-content: center; font-family: cursive;">
      Hotel List
    </div>
    <div
        style="display: flex; flex-direction: row; justify-content: center; align-content: center; width: 100vw; gap: 5em; margin-top: 2em">
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold; display: flex; flex-direction: row; justify-content: center">
          Hotel Name
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em;margin: 0.1em">
          <div>{{ h.hotel_name }}</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold;display: flex; flex-direction: row; justify-content: center">
          City
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em;margin: 0.1em">
          <div>{{ h.city }}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold;display: flex; flex-direction: row; justify-content: center">
          District
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em; margin: 0.1em">
          <div>{{ h.district }}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold;display: flex; flex-direction: row; justify-content: center">
          Date
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em; margin: 0.1em">
          <div>{{ h.date }}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold;display: flex; flex-direction: row; justify-content: center">
          Earliest check-in time
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em; margin: 0.1em">
          <div>{{ h.earliest_check_in_time }}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold;display: flex; flex-direction: row; justify-content: center">
          Price
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em;margin: 0.1em">
          <div>{{ h.price }}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold;display: flex; flex-direction: row; justify-content: center">
          Room Type
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em;margin: 0.1em">
          <div>{{ h.room_type }}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="header" style="font-weight: bold;display: flex; flex-direction: row; justify-content: center">
          Operation
        </div>
        <div v-for="(h, index) in hotel" :key="index"
             style="display: flex; flex-direction: row; justify-content: center; gap: 5em;margin: 0.1em">
          <div style="cursor: pointer; font-weight: bold; color: #8f2c24" @click="HandleDelete(h.id)">delete</div>
        </div>
      </div>
    </div>

  <div style="display: flex; flex-direction: row; justify-content: center;">
    <div style="width: 10vw; display: flex; flex-direction: row; justify-content: center;  margin: 3em; cursor: pointer;border: 2px solid blue; color: blue; background: transparent; padding: 0.5em 1em;  border-radius: 5px;"
         @click="toggleForm">
      Add Hotel
    </div>
  </div>


    <div v-if="showForm" class="header" style="padding-bottom: 3em; background-color: white; position: absolute;top: 50%; left: 50%; width: 40vw;transform: translate(-50%, -50%); ">
      <h3 style="display: flex;flex-direction: row; justify-content: center">Add New Hotel</h3>
      <form @submit.prevent="addHotel" style="display: flex; flex-direction: column; max-width: 400px; margin: 0 auto;">
        <input class="header" v-model="newHotel.hotel_name" placeholder="Hotel Name" required style="margin-bottom: 1em;"/>
        <select class="header" v-model="newHotel.city" @change="updateDistricts" required style="margin-bottom: 1em;">
          <option value="" disabled>Select City</option>
          <option value="GUANG ZHOU">GUANG ZHOU</option>
          <option value="SHEN ZHEN">SHEN ZHEN</option>
        </select>
        <select class="header" v-model="newHotel.district" required style="margin-bottom: 1em;">
          <option v-for="district in availableDistricts" :key="district" :value="district">{{ district }}</option>
        </select>
        <input class="header" v-model="newHotel.date" type="date" required style="margin-bottom: 1em;"/>
        <input class="header" v-model="newHotel.earliest_check_in_time" type="time" required style="margin-bottom: 1em;"/>
        <input class="header" v-model="newHotel.price" placeholder="Price" required style="margin-bottom: 1em;"/>
        <select class="header" v-model="newHotel.room_type" required style="margin-bottom: 1em;">
          <option value="Standard Room">Standard Room</option>
          <option value="King Bed Room">King Bed Room</option>
          <option value="Family Room">Family Room</option>
          <option value="Presidential Suite">Presidential Suite</option>
        </select>
        <div style="display: flex; justify-content: space-between;">
          <button type="submit"
                  style="border: 2px solid blue; color: blue; background: transparent; padding: 0.5em 1em; cursor: pointer; border-radius: 5px;">
            Submit
          </button>
          <button type="button" @click="toggleForm"
                  style="border: 2px solid blue; color: blue; background: transparent; padding: 0.5em 1em; cursor: pointer; border-radius: 5px;">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Hw1',
  data() {
    return {
      data: null,
      hotel: null,
      showForm: false, // 控制表单显示的状态
      newHotel: { // 用于存储新酒店数据
        hotel_name: '',
        city: '',
        district: '',
        date: '',
        earliest_check_in_time: '',
        price: '',
        room_type: ''
      },
      availableDistricts: [] // 可用的地区选项
    }
  },
  async mounted() {
    this.getHotel();
  },
  methods: {
    async getHotel() {
      await this.$get('getHotels/', {}, 'data');
      this.hotel = this.data.hotels;
      console.log(this.hotel);
    },
    async HandleDelete(id) {
      await this.$delete(`deleteHotel/${id}`, {}, 'data');
      this.getHotel();
    },
    toggleForm() { // 切换表单的显示状态
      this.showForm = !this.showForm;
    },
    async addHotel() { // 提交新酒店数据
      await this.$post('addHotel/', {}, this.newHotel, 'data');
      this.newHotel = {
        hotel_name: '',
        city: '',
        district: '',
        date: '',
        earliest_check_in_time: '',
        price: '',
        room_type: ''
      }; // 重置表单
      this.toggleForm(); // 隐藏表单
      this.getHotel(); // 刷新酒店列表
    },
    updateDistricts() { // 根据选择的城市更新地区选项
      if (this.newHotel.city === 'SHEN ZHEN') {
        this.availableDistricts = ['FU TIAN', 'NAN SHAN', 'LUO HU', 'LONG GANG', 'PING SHAN', 'LONG HUA', 'GUANG MING', 'YAN TIAN'];
      } else if (this.newHotel.city === 'GUANG ZHOU') {
        this.availableDistricts = ['YUE XIU', 'LI WAN', 'HAI ZHU', 'TIAN HE', 'BAI YUN', 'HUANG PU', 'FAN YU', 'HUA DU', 'NAN SHA', 'CONG HUA', 'ZENG CHENG'];
      } else {
        this.availableDistricts = [];
      }
    }
  }
}
</script>

<style scoped>
.header {
  border: 1px solid #ccc; /* Add border */
  border-radius: 8px; /* Add rounded corners */
  padding: 10px; /* Add some padding for better appearance */
  text-align: center; /* Center the text */
  background-color: #f9f9f9; /* Optional: background color for headers */
  margin: 1em
}
</style>
