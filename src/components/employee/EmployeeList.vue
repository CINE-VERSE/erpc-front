<template>
  <div>
    <h2>직원 목록</h2>
    <div class="employee-grid">
      <router-link v-for="employee in employees" :key="employee.employeeId" :to="'/employees/' + employee.employeeId" class="employee-item">
        {{ employee.employeeName }}
      </router-link>
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
    axios.get('http://localhost:7775/employees')
      .then(response => {
        this.employees = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
</script>
<style scoped>
.employee-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5개의 열로 그리드를 만듭니다. */
  grid-gap: 10px; /* 열 사이의 간격을 조정합니다. */
}

.employee-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.employee-item:hover {
  background-color: #f1f1f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.router-link-exact-active {
  font-weight: bold;
}

.router-link-exact-active:hover {
  background-color: #f1f1f1;
}
div {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

li:hover {
  background-color: #f1f1f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  transition: color 0.3s ease;
}

a:hover {
  color: #0056b3;
}

a:active {
  color: #004080;
}
</style>