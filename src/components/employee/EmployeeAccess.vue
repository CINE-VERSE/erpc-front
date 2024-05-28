<template>
    <div>
      <h2>권한 신청</h2>
      <form @submit.prevent="submitAccessRequest">
        <div>
          <label for="employeeId">사원 ID:</label>
          <input v-model="requestAccess.employee.employeeId" id="employeeId" required>
        </div>
        <div>
          <label for="accessId">권한 ID:</label>
          <input v-model="requestAccess.accessRight.accessId" id="accessId" required>
        </div>
        <button type="submit">신청</button>
      </form>
  
      <h2>권한 신청 상태 조회</h2>
      <input v-model="accessRequestId" placeholder="권한 신청 ID">
      <button @click="getAccessRequestById">조회</button>
      <div v-if="accessRequest">
        <p>이름: {{ accessRequest.employee.employeeName }}</p>
        <p>권한내용: {{ accessRequest.accessRight.accessRight }}</p>
      </div>
  
      <h2>보유 권한 조회</h2>
      <input v-model="employeeId" placeholder="사원 ID">
      <button @click="getEmployeesAccess">조회</button>
      <div v-if="employeeAccess.length">
        <h3>사원 정보</h3>
        <p>이름: {{ employeeAccess[0]?.employee?.employeeName }}</p>
        <h3>권한 목록</h3>
        <div v-for="right in allAccessRights" :key="right.accessId">
          <input type="checkbox" :value="right.accessId" v-model="employeeCheckedAccessRights" disabled>
          {{ right.accessRight }}
        </div>
      </div>
  
      <h2>모든 권한 신청 조회</h2>
      <button @click="getAllAccessRequests">조회</button>
      <ul v-if="allAccessRequests.length">
        <li v-for="request in allAccessRequests" :key="request.accessRequestId">
          {{ request.accessRequestId }} - {{ request.employee.employeeName }} - {{ request.accessRight.accessRight }}
        </li>
      </ul>
  
      <h2>추가 권한 등록</h2>
    <form @submit.prevent="submitAddAccess">
      <div>
        <label for="employeeId">사원 ID:</label>
        <input v-model="addAccess.employee.employeeId" id="employeeId" required>
      </div>
      <div>
        <label for="accessRights">권한 목록:</label>
        <div v-for="i in 21" :key="i">
          <input type="checkbox" :value="i" v-model="selectedAccessRights">
          권한 {{ i }} - {{ getAccessRight(i) }}
        </div>
      </div>
      <button type="submit">등록</button>
    </form>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const requestAccess = ref({
    accessRight: {
      accessId: ''
    },
    employee: {
      employeeId: ''
    }
  });
  
  const accessRequestId = ref('');
  const accessRequest = ref(null);
  
  const employeeId = ref('');
  const employeeAccess = ref([]);
  const employeeCheckedAccessRights = ref([]);
  
  const allAccessRights = ref([]);
  const allAccessRequests = ref([]);
  
  const addAccess = ref({
    employee: {
      employeeId: ''
    },
    accessRight: []
  });
  const selectedAccessRights = ref([]);
  const getAccessRight = (accessId) => {
  return `권한 ${accessId}`;
};

  // Function to aggregate all access rights from existing API responses
  const aggregateAllAccessRights = (data) => {
    const rightsSet = new Set();
    data.forEach(item => rightsSet.add(JSON.stringify(item.accessRight)));
    allAccessRights.value = Array.from(rightsSet).map(item => JSON.parse(item));
  };
  
  const submitAccessRequest = async () => {
    try {
      await axios.post('http://localhost:7775/access/access_request', requestAccess.value);
      alert('권한 신청이 완료되었습니다.');
      requestAccess.value.accessRight.accessId = '';
      requestAccess.value.employee.employeeId = '';
    } catch (error) {
      console.error('권한 신청 중 에러 발생:', error);
    }
  };
  
  const getAccessRequestById = async () => {
    try {
      const response = await axios.get(`http://localhost:7775/access/${accessRequestId.value}`);
      accessRequest.value = response.data;
      aggregateAllAccessRights([response.data]);
    } catch (error) {
      console.error('권한 신청 조회 중 에러 발생:', error);
    }
  };
  
  const getEmployeesAccess = async () => {
    try {
      const response = await axios.get(`http://localhost:7775/access/find_access/${employeeId.value}`);
      employeeAccess.value = response.data;
      aggregateAllAccessRights(response.data);
  
      // Populate the checked access rights
      employeeCheckedAccessRights.value = employeeAccess.value.map(access => access.accessRight.accessId);
    } catch (error) {
      console.error('보유 권한 조회 중 에러 발생:', error);
    }
  };
  
  const getAllAccessRequests = async () => {
    try {
      const response = await axios.get('http://localhost:7775/access/list');
      allAccessRequests.value = response.data;
      aggregateAllAccessRights(response.data);
    } catch (error) {
      console.error('모든 권한 신청 조회 중 에러 발생:', error);
    }
  };
  
  const submitAddAccess = async () => {
    try {
      addAccess.value.accessRight = selectedAccessRights.value.map(accessId => ({ accessId }));
      await axios.post('http://localhost:7775/access/add_access', addAccess.value);
      alert('추가 권한이 성공적으로 등록되었습니다.');
      addAccess.value.employee.employeeId = '';
      selectedAccessRights.value = [];
    } catch (error) {
      console.error('추가 권한 등록 중 에러 발생:', error);
    }
  };
  
 
  const fetchInitialAccessRights = async () => {
    await getAllAccessRequests(); 
  };
  
  onMounted(fetchInitialAccessRights);
  
  </script>
  
  <style scoped>
  /* 스타일 시트 */
  </style>