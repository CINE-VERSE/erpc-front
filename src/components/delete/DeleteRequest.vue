<template>
  <div class="delete-request-content">
    <div class="delete-request-search">
      <h1 class="delete-request-title">삭제요청관리</h1>
    </div>
    <div class="filter-box">
      <div class="filter-controls">
        <select v-model="selectedDeleteRequestType" @change="applyFilter" class="delete-type-select">
          <option value="opportunity">영업기회 삭제</option>
          <option value="shipment">수주 삭제</option>
          <option value="contract">계약서 삭제</option>
        </select>
        <input type="text" class="delete-request-search-input" v-model="searchQuery" :placeholder="placeholderText" @input="toUpperCase">
        <button class="delete-request-search-btn" @click="applyFilter">조회하기</button>
      </div>
    </div>

    <div class="delete-request-list">
      <!-- 영업기회 삭제 -->
      <template v-if="selectedDeleteRequestType === 'opportunity'">
        <h2>영업기회 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>영업기회 코드</th>
              <th>거래처명</th>
              <th>요청일자</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredOpportunityDeleteRequests" :key="request.opportunityDeleteRequestId">
              <td>{{ filteredOpportunityDeleteRequests.length - index }}</td>
              <td>{{ request.opportunity.opportunityCode }}</td>
              <td>{{ request.opportunity.account.accountName }}</td>
              <td>{{ request.requestDate }}</td>
              <td>{{ request.status }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- 수주 삭제 -->
      <template v-if="selectedDeleteRequestType === 'shipment'">
        <h2>수주 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>수주 코드</th>
              <th>거래처명</th>
              <th>요청일자</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredShipmentDeleteRequests" :key="request.shipmentDeleteRequestId">
              <td>{{ filteredShipmentDeleteRequests.length - index }}</td>
              <td>{{ request.shipment.shipmentCode }}</td>
              <td>{{ request.shipment.account.accountName }}</td>
              <td>{{ request.requestDate }}</td>
              <td>{{ request.status }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- 계약서 삭제 -->
      <template v-if="selectedDeleteRequestType === 'contract'">
        <h2>계약서 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>계약서 코드</th>
              <th>거래처명</th>
              <th>요청일자</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredContractDeleteRequests" :key="request.contractDeleteRequestId">
              <td>{{ filteredContractDeleteRequests.length - index }}</td>
              <td>{{ request.contract.contractCode }}</td>
              <td>{{ request.contract.account.accountName }}</td>
              <td>{{ request.requestDate }}</td>
              <td>{{ request.status }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

// 데이터 및 변수 선언
const opportunityDeleteRequests = ref([]); // 영업기회 삭제 데이터
const shipmentDeleteRequests = ref([]); // 수주 삭제 데이터
const contractDeleteRequests = ref([]); // 계약서 삭제 데이터
const searchQuery = ref(''); // 검색어
const selectedDeleteRequestType = ref('opportunity'); // 선택된 삭제 요청 유형
const filteredOpportunityDeleteRequests = ref([]); // 필터링된 영업기회 삭제 데이터
const filteredShipmentDeleteRequests = ref([]); // 필터링된 수주 삭제 데이터
const filteredContractDeleteRequests = ref([]); // 필터링된 계약서 삭제 데이터

// 플레이스홀더 텍스트를 동적으로 설정
const placeholderText = computed(() => {
  switch (selectedDeleteRequestType.value) {
    case 'opportunity':
      return '영업기회 코드로 조회';
    case 'shipment':
      return '수주 코드로 조회';
    case 'contract':
      return '계약서 코드로 조회';
    default:
      return '코드로 조회';
  }
});

// 검색어를 대문자로 변환
const toUpperCase = () => {
  searchQuery.value = searchQuery.value.toUpperCase();
};

// 컴포넌트가 마운트될 때 데이터를 가져옴
onMounted(async () => {
  await fetchOpportunityDeleteRequests(); // 영업기회 삭제 데이터 가져오기
  await fetchShipmentDeleteRequests(); // 수주 삭제 데이터 가져오기
  await fetchContractDeleteRequests(); // 계약서 삭제 데이터 가져오기
  applyFilter(); // 필터 적용
});

// 선택된 삭제 요청 유형이 변경될 때 필터 적용
watch([selectedDeleteRequestType], () => {
  applyFilter();
});

// 영업기회 삭제 데이터 가져오기
const fetchOpportunityDeleteRequests = async () => {
  try {
    const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/delete-request/opportunity');
    opportunityDeleteRequests.value = response.data;
    filteredOpportunityDeleteRequests.value = opportunityDeleteRequests.value;
  } catch (error) {
    console.error('Error fetching opportunity delete requests:', error);
  }
};

// 수주 삭제 데이터 가져오기
const fetchShipmentDeleteRequests = async () => {
  try {
    const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/delete-request/shipment');
    shipmentDeleteRequests.value = response.data;
    filteredShipmentDeleteRequests.value = shipmentDeleteRequests.value;
  } catch (error) {
    console.error('Error fetching shipment delete requests:', error);
  }
};

// 계약서 삭제 데이터 가져오기
const fetchContractDeleteRequests = async () => {
  try {
    const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/delete-request/contract');
    contractDeleteRequests.value = response.data;
    filteredContractDeleteRequests.value = contractDeleteRequests.value;
  } catch (error) {
    console.error('Error fetching contract delete requests:', error);
  }
};

// 필터링 로직
const applyFilter = () => {
  // 기본 필터링 로직
  let filteredOpportunity = opportunityDeleteRequests.value.filter(request => {
    const matchesQuery = !searchQuery.value || request.opportunity.opportunityCode.includes(searchQuery.value);
    return matchesQuery;
  });

  let filteredShipment = shipmentDeleteRequests.value.filter(request => {
    const matchesQuery = !searchQuery.value || request.shipment.shipmentCode.includes(searchQuery.value);
    return matchesQuery;
  });

  let filteredContract = contractDeleteRequests.value.filter(request => {
    const matchesQuery = !searchQuery.value || request.contract.contractCode.includes(searchQuery.value);
    return matchesQuery;
  });

  // 필터링된 결과를 저장
  filteredOpportunityDeleteRequests.value = filteredOpportunity;
  filteredShipmentDeleteRequests.value = filteredShipment;
  filteredContractDeleteRequests.value = filteredContract;
};
</script>

<style scoped>
/* 전체 스타일 */
.delete-request-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.delete-request-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.filter-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.filter-controls {
  display: flex;
  align-items: center;
}

.delete-type-select,
.delete-request-search-input {
  margin: 0 10px;
  padding: 5px;
}

.delete-request-search-btn {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.delete-request-list {
  width: 80%;
  margin: 20px 0;
}

.delete-request-table {
  width: 100%;
  border-collapse: collapse;
}

.delete-request-table th,
.delete-request-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.delete-request-table th {
  background-color: #f2f2f2;
}

.delete-request-table tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>