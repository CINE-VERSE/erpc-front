<template>
  <div class="access-request-container">
    <!-- 권한 신청 상태 조회 섹션 -->
    <div class="section access-status">
      <h2>권한 신청 상태 조회</h2>
      <div class="form-group">
        <input v-model="accessRequestId" placeholder="권한 신청 ID">
        <button @click="getAccessRequestById">조회</button>
      </div>
      <div v-if="accessRequest" class="access-details">
        <p>이름: {{ accessRequest.employee.employeeName }}</p>
        <p>권한내용: {{ accessRequest.accessRight.accessRight }}</p>
      </div>
    </div>
    
    <!-- 모든 권한 신청 조회 섹션 -->
    <div class="section all-requests">
      <h2>모든 권한 신청 조회</h2>
      <button @click="getAllAccessRequests">조회</button>
      <ul v-if="showAllAccessRequests" class="request-list">
        <li v-for="request in allAccessRequests" :key="request.accessRequestId">
          {{ request.accessRequestId }} - {{ request.employee.employeeName }} - {{ request.accessRight.accessRight }}
        </li>
      </ul>
    </div>

    <!-- 권한 관리 섹션 -->
    <div class="section access-management">
      <!-- 추가 권한 등록 섹션 -->
      <div class="access-panel">
        <h2>추가 권한 등록</h2>
        <form @submit.prevent="submitAddAccess">
          <div class="form-group">
            <label for="employeeId">사원 ID:</label>
            <input v-model="addAccess.employee.employeeId" id="employeeId" required>
          </div>
          <div class="form-group access-rights">
            <label for="accessRights">권한 목록:</label>
            <div v-for="i in 22" :key="i" class="access-checkbox">
              <input type="checkbox" :value="i" v-model="selectedAccessRights">
              {{ accessRightsMap[i] }}
            </div>
          </div>
          <button type="submit">등록</button>
        </form>
      </div>

      <!-- 보유 권한 조회 섹션 -->
      <div class="access-panel">
        <h2>보유 권한 조회</h2>
        <div class="form-group">
          <input v-model="employeeId" placeholder="사원 ID">
          <button @click="getEmployeesAccess">조회</button>
        </div>
        <div v-if="employeeAccess.length">
          <h3>사원 정보</h3>
          <p>이름: {{ employeeAccess[0]?.employee?.employeeName }}</p>
          <h3>권한 목록</h3>
          <div v-for="right in allAccessRights" :key="right.accessId">
            <input type="checkbox" :value="right.accessId" v-model="employeeCheckedAccessRights" disabled>
            {{ right.accessRight }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const accessRequestId = ref('');
const accessRequest = ref(null);

const employeeId = ref('');
const employeeAccess = ref([]);
const employeeCheckedAccessRights = ref([]);

const allAccessRights = ref([]);
const allAccessRequests = ref([]);
const showAllAccessRequests = ref(false);  // 조회 결과 표시 여부를 나타내는 변수

const addAccess = ref({
  employee: {
    employeeId: ''
  },
  accessRight: []
});
const selectedAccessRights = ref([]);

const accessRightsMap = {
  1: "자유게시판 읽기",
  2: "자유게시판 쓰기",
  3: "영업기회 읽기",
  4: "영업기회 쓰기",
  5: "영업기회 참고사항 쓰기",
  6: "거래처 읽기",
  7: "거래처 쓰기",
  8: "거래처 참고사항 쓰기",
  9: "견적서 읽기",
  10: "견적서 쓰기",
  11: "견적서 참고사항 쓰기",
  12: "계약서 읽기",
  13: "계약서 쓰기",
  14: "수주 읽기",
  15: "수주 쓰기",
  16: "수주 참고사항 쓰기",
  17: "수금 읽기",
  18: "수금 쓰기",
  19: "결재 읽기",
  20: "결재 처리",
  21: "품목 읽기",
  22: "관리자"
};

const aggregateAllAccessRights = (data) => {
  const rightsSet = new Set();
  data.forEach(item => rightsSet.add(JSON.stringify(item.accessRight)));
  allAccessRights.value = Array.from(rightsSet).map(item => JSON.parse(item));
};

const getAccessRequestById = async () => {
  try {
    const response = await axios.get(`http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/access/${accessRequestId.value}`);
    accessRequest.value = response.data;
    aggregateAllAccessRights([response.data]);
  } catch (error) {
    console.error('권한 신청 조회 중 에러 발생:', error);
  }
};

const getEmployeesAccess = async () => {
  try {
    const response = await axios.get(`http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/access/find_access/${employeeId.value}`);
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
    const response = await axios.get('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/access/list');
    allAccessRequests.value = response.data;
    showAllAccessRequests.value = true; // 조회 버튼을 눌렀을 때만 표시
  } catch (error) {
    console.error('모든 권한 신청 조회 중 에러 발생:', error);
  }
};

const submitAddAccess = async () => {
  try {
    addAccess.value.accessRight = selectedAccessRights.value.map(accessId => ({ accessId }));
    await axios.post('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/access/add_access', addAccess.value);
    alert('추가 권한이 성공적으로 등록되었습니다.');
    addAccess.value.employee.employeeId = '';
    selectedAccessRights.value = [];
  } catch (error) {
    console.error('추가 권한 등록 중 에러 발생:', error);
  }
};
</script>
  
  <style>
  .access-request-container {
    display: flex;
    justify-content: space-between;
    flex-direction: row-direction;
    margin-top: 60px;
  }
  
  .section {
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: #e0f0ff; /* 파란색 배경 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  }
  
  h2 {
    color: #007bff; /* 파란색 텍스트 */
    margin-bottom: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
  }
  
  button[type="submit"] {
    background-color: #007bff; /* 파란색 버튼 */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
  }
  
  button[type="submit"]:hover {
    background-color: #0056b3; /* 진한 파란색 */
  }
  
  .access-management {
    display: flex;
    flex-direction: row;
  }
  
  .access-panel {
    margin-bottom: 20px;
  }
  
  .access-checkbox input[type="checkbox"] {
    margin-right: 5px;
  }
  
  .access-form,
  .access-status,
  .all-requests {
    display: block;
  }
  </style>