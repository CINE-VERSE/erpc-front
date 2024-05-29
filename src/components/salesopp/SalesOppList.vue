<template>
    <div class="contract-content">
      <div class="contract-list">
        <h1>영업기회 목록</h1>
      </div>
      <div class="contract-list-search">
        <div class="contract-dropdown">
          <button class="contract-dropdown-btn">거래처 명 </button>
        </div>
        <input type="text" class="contract-search-input" placeholder="검색어를 입력하세요">
        <button class="contract-search-btn">검색</button>
      </div>
      <div class="contract-list-box">
        <table class="contract-table7">
          <thead>
            <tr class="header1">
              <th>번호</th>
              <th>거래처 명</th>
              <th>영업기회 작성일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(approval, index) in filteredapprovals" :key="index" @click="goTosalesOppContents(approval.salesOppId)">
              <td>{{ index + 1 }}</td>
              <td>{{ approval.oppAccountName }}</td>
              <td>{{ approval.oppDate }}</td>
              <td>{{ approval.salesOppStatus.salesOppStatus }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  
  const approvals = ref([]);
  const startDate = ref('');
  const endDate = ref('');
  const filteredapprovals = ref([]);
  
  function applyFilter() {
    if (startDate.value && endDate.value) {
      filteredapprovals.value = approvals.value.filter(approval => {
        return approval.date >= startDate.value && approval.date <= endDate.value;
      });
    } else {
      filteredapprovals.value = approvals.value;
    }
  }
  
  function goTosalesOppContents(salesOppId) {
    router.push({ path: `/salesopp/${salesOppId}`});
}
  
  // 컴포넌트가 생성될 때 영업기회 목록을 가져옴
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:7775/sales_opportunity');
      approvals.value = response.data;
      filteredapprovals.value = approvals.value;
    } catch (error) {
      console.error('영업기회 목록을 불러오는 중 오류가 발생했습니다:', error);
      // 오류 처리 로직 추가
    }
  });
  </script>
  
  <style scoped>
    @import url('@/assets/css/contract/ContractList.css');
  </style>