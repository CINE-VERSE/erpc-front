<template>
  <div>
    <h1>사원 상세 정보</h1>
    <p>사원 코드: {{ employee.employeeCode }}</p>
    <p>이름: {{ employee.employeeName }}</p>
    <p>이메일: {{ employee.employeeEmail }}</p>
    <p>전화번호: {{ employee.employeeHp }}</p>
    <p>사원 번호: {{ employee.employeeNumber }}</p>
    <p>입사일: {{ employee.employmentDate }}</p>
    <p>직급: {{ mapEmployeeRank(employee.employeeRank.employeeRankId) }}</p>
    <p>팀: {{ mapTeamCode(employee.teamCode.teamCodeId) }}</p>

    
  <div class="button-container">
    <router-link :to="{ path: '/employees/modify', query: { employeeId: employee.employeeId }}" class="edit-button">수정</router-link>
      <router-link :to="{ path: '/employees/regist' }" class="register-button">등록</router-link>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7775/employees', // Spring Boot 서버의 URL
});

export default {
  data() {
    return {
      employee: {},
    };
  },
  async created() {
    try {
      const employeeId = this.$route.params.employeeId;
      const response = await axiosInstance.get(`/${employeeId}`);
      this.employee = response.data;
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  },
  methods: {
    mapEmployeeRank(rankId) {
      switch(parseInt(rankId)) {
        case 1:
          return '사원';
        case 2:
          return '대리';
        case 3:
          return '과장';
        case 4:
          return '팀장';
        case 5:
          return '관리자';
        default:
          return '직급 미정';
      }
    },
    mapTeamCode(teamCodeId) {
  switch(parseInt(teamCodeId)) {
        case 1:
          return '영업 1팀';
        case 2:
          return '영업 2팀';
        case 3:
          return '영업 3팀';
        case 4:
          return '영업 4팀';
        case 5:
          return '영업 5팀';
        case 6:
          return '관리자';
        default:
          return '팀 미정';
      }
    }
  }
};
</script>