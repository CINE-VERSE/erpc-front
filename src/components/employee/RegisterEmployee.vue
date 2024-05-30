<template>
  <div>
    <h1>Register Employee</h1>
    <form @submit.prevent="registerEmployee">
      <div>
        <label for="employeeCode">Employee Code:</label>
        <input type="text" v-model="employee.employeeCode" required>
      </div>
      <div>
        <label for="employeeName">Name:</label>
        <input type="text" v-model="employee.employeeName" required>
      </div>
      <div>
        <label for="employeePassword">Password:</label>
        <input type="password" v-model="employee.employeePassword" required>
      </div>
      <div>
        <label for="employeeEmail">Email:</label>
        <input type="email" v-model="employee.employeeEmail" required>
      </div>
      <div>
        <label for="employeeHp">Phone:</label>
        <input type="text" v-model="employee.employeeHp" required>
      </div>
      <div>
        <label for="employeeNumber">Employee Number:</label>
        <input type="text" v-model="employee.employeeNumber" required>
      </div>
      <div>
        <label for="employmentDate">Employment Date:</label>
        <input type="date" v-model="employee.employmentDate" required>
      </div>
      <div>
        <label for="employeeRank">Employee Rank:</label>
        <select v-model="employee.employeeRank.employeeRankId" required>
          <option value="1">사원</option>
          <option value="2">대리</option>
          <option value="3">과장</option>
          <option value="4">팀장</option>
          <option value="5">관리자</option>
        </select>
      </div>
      <div>
        <label for="teamCode">Team Code:</label>
        <select v-model="employee.teamCode.teamCodeId" required>
          <option value="1">영업 1팀</option>
          <option value="2">영업 2팀</option>
          <option value="3">영업 3팀</option>
          <option value="4">영업 4팀</option>
          <option value="5">영업 5팀</option>
          <option value="6">관리자</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      employee: {
        employeeCode: '',
        employeeName: '',
        employeePassword: '',
        employeeEmail: '',
        employeeHp: '',
        employeeNumber: '',
        employmentDate: '',
        employeeRank: { employeeRankId: '' },
        teamCode: { teamCodeId: '' }
      },
    };
  },
  methods: {
    async registerEmployee() {
      try {
        const response = await axios.post('http://localhost:7775/employees/regist', this.employee);
        this.$router.push('/employees');
      } catch (error) {
        console.error('Error registering employee:', error);
      }
    },
  },
};
</script>