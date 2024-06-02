<!-- ModifyEmployee.vue -->
<template>
    <div>
      <h1>회원 정보 수정</h1>
      <form @submit.prevent="modifyEmployee">
        <div>
          <label for="employeeName">이름:</label>
          <input type="text" id="employeeName" v-model="employee.employeeName">
        </div>
        <div>
          <label for="employeeEmail">이메일:</label>
          <input type="email" id="employeeEmail" v-model="employee.employeeEmail">
        </div>
        <!-- 나머지 필드도 동일하게 추가 -->
        <button type="submit">수정</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        employee: {},
      };
    },
    async created() {
      const employeeId = this.$route.params.employeeId;
      try {
        const response = await axios.get(`http://localhost:7775/employees/${employeeId}`);
        this.employee = response.data;
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    },
    methods: {
      async modifyEmployee() {
        const employeeId = this.$route.params.employeeId;
        try {
          const response = await axios.patch(`http://localhost:7775/employees/modify`, this.employee);
          alert('회원 정보가 수정되었습니다.');
          // 수정 후 어떤 페이지로 이동할지 결정
        } catch (error) {
          console.error('Error modifying employee:', error);
          alert('회원 정보 수정에 실패했습니다.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 스타일링 */
  </style>