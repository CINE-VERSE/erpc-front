<template>
  <div>
    <div class="table-container">
      <router-link :to="{ path: '/employees/regist' }" class="writebutton">직원 등록</router-link>
    <table class="table">
      <thead>
        <tr class="header1">
          <th class="num">No</th>
          <th>이름</th>
          <th>팀</th>
          <th>직급</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(employee, index) in employees" :key="employee.employeeId" class="allpost">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link :to="'/employees/' + employee.employeeId" class="employee-item">
              {{ employee.employeeName }}
            </router-link>
          </td>
          <td>{{ mapTeamCode(employee.teamCode.teamCodeId) }}</td>
          <td>{{ mapEmployeeRank(employee.employeeRank.employeeRankId) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      employees: []
    };
  },
  created() {
    axios.get('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/employees')
      .then(response => {
        this.employees = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    mapEmployeeRank(employeeRankId) {
      switch (parseInt(employeeRankId)) {
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
      switch (parseInt(teamCodeId)) {
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
}
</script>

<style>
.table {
  width: 100%;
  min-width: 1000px;
  max-width: 1000px;
  border-collapse: separate;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.boardTitle {
  font-size: 32px;
  margin-top: 20px; 
  margin-bottom: 20px;
  text-align: center; 
}

.thing {
  text-align: right;
}

.header1 {
  background-color: #b8c4e4;
  height: 50px;
  font-size: 12px;
  text-align: center;
}

.header1 .num {
  width: 5%;
}

.allpost {
  text-align: center;
  padding: 10px 0;
}

.allpost .num {
  width: 5%;
}
.writebutton {
  background-color: #6c7aa1;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px; 
  font-weight: bold; 
  margin-top: 20px;
  margin-right: 20px;
  float: right; /* 오른쪽으로 정렬 */
}

.writebutton:hover {
  background-color: #b8c4e4;
}
</style>