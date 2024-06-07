<template>
  <div class="contract-content">
    <div class="contract-list">
      <h1>영업기회 목록</h1>
    </div>
    <div class="contract-list-search">
      <div class="contract-dropdown">
        <button class="contract-dropdown-btn">{{ searchBy }} ▼</button>
        <div class="contract-dropdown-content">
          <a href="#" @click="setSearchBy('거래처명')">거래처명</a>
          <a href="#" @click="setSearchBy('거래처 담당자')">거래처 담당자</a>
        </div>
      </div>
      <input v-model="searchKeyword" type="text" class="contract-search-input" placeholder="검색어를 입력하세요">
      <button class="contract-search-btn" @click="search">검색</button>
    </div>
    <div class="contract-list-box">
      <table class="contract-table7">
        <thead>
          <tr class="header1">
            <th>번호</th>
            <th>{{ searchBy }}</th>
            <th>영업기회 작성일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(approval, index) in filteredapprovals" :key="index" @click="goTosalesOppContents(approval.salesOppId)">
            <td>{{ index + 1 }}</td>
            <td>{{ searchBy === '거래처명' ? approval.oppAccountName : approval.oppAccountPic }}</td>
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
const filteredapprovals = ref([]);
const searchKeyword = ref('');
const searchBy = ref('거래처명');

function setSearchBy(type) {
  searchBy.value = type;
}

function search() {
  const query = searchKeyword.value.trim().toLowerCase();
  if (!query) {
    filteredapprovals.value = approvals.value;
    return;
  }

  filteredapprovals.value = approvals.value.filter(approval => {
    const target = searchBy.value === '거래처명' ? approval.oppAccountName.toLowerCase() : approval.oppAccountPic.toLowerCase();
    return target.includes(query);
  });
}

function goTosalesOppContents(salesOppId) {
  router.push({ path: `/salesopp/${salesOppId}` });
}

onMounted(async () => {
  try {
    const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity');
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