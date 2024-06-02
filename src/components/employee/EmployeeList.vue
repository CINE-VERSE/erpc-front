<template>
  <div>
    <h2>직원 목록</h2>
    <ul>
      <li v-for="employee in employees" :key="employee.employeeId">
        <router-link :to="'/employees/' + employee.employeeId">
          {{ employee.employeeName }}
        </router-link>
      </li>
    </ul>
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