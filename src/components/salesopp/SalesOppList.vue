<template>
  <div class="contract-content">
    <div class="contract-list">
      <h1>영업기회 목록</h1>
    </div>

    <!-- 검색 및 필터링 섹션 -->
    <div class="contract-list-search">
      <!-- 검색 기준 선택 드롭다운 -->
      <div class="contract-dropdown">
        <button class="contract-dropdown-btn">{{ searchBy }} ▼</button>
        <div class="contract-dropdown-content">
          <a href="#" @click.prevent="setSearchBy('거래처명')">거래처명</a>
          <a href="#" @click.prevent="setSearchBy('거래처 담당자')">거래처 담당자</a>
        </div>
      </div>
      
      <!-- 검색어 입력 -->
      <input v-model="searchKeyword" type="text" class="contract-search-input" placeholder="검색어를 입력하세요">
      
      <!-- 상태 필터링 드롭다운 -->
      <div class="contract-dropdown">
        <button class="contract-dropdown-btn">{{ statusFilter }} ▼</button>
        <div class="contract-dropdown-content">
          <a href="#" @click.prevent="setStatusFilter('전체')">전체</a>
          <a href="#" @click.prevent="setStatusFilter('등록')">등록</a>
          <a href="#" @click.prevent="setStatusFilter('진행중')">진행중</a>
          <a href="#" @click.prevent="setStatusFilter('불발')">불발</a>
          <a href="#" @click.prevent="setStatusFilter('성사')">성사</a>
        </div>
      </div>

      <!-- 검색 버튼 -->
      <button class="contract-search-btn" @click="filterApprovals">검색</button>
    </div>

    <!-- 영업기회 목록 테이블 -->
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
          <tr v-for="(approval, index) in paginatedApprovals" :key="approval.salesOppId" @click="goToSalesOppContents(approval.salesOppId)">
            <td>{{ filteredApprovals.length - ((currentPage - 1) * itemsPerPage + index) }}</td>
            <td>{{ searchBy === '거래처명' ? approval.oppAccountName : approval.oppAccountPic }}</td>
            <td>{{ approval.oppDate }}</td>
            <td>{{ approval.salesOppStatus.salesOppStatus }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
            <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
        </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const approvals = ref([]);
const filteredApprovals = ref([]);
const searchKeyword = ref('');
const searchBy = ref('거래처명');
const statusFilter = ref('전체');
const currentPage = ref(1); // 현재 페이지
const itemsPerPage = ref(10); // 페이지 당 항목 수

const paginatedApprovals = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredApprovals.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredApprovals.value.length / itemsPerPage.value);
});

function changePage(page) {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
}

// 검색 기준 설정 함수
function setSearchBy(type) {
  searchBy.value = type;
}

// 상태 필터 설정 함수
function setStatusFilter(status) {
  statusFilter.value = status;
}

// 검색 및 상태 필터링 함수
function filterApprovals() {
  const query = searchKeyword.value.trim().toLowerCase();
  const filterStatus = statusFilter.value;

  // 상태 비교를 위한 상태 값 매핑
  const statusMap = {
    '전체': '전체',
    '등록': '등록',
    '진행중': '진행중',
    '불발': '불발',
    '성사': '성사'
  };

  filteredApprovals.value = approvals.value.filter(approval => {
    // 검색어 필터링
    const target = searchBy.value === '거래처명' ? approval.oppAccountName.toLowerCase() : approval.oppAccountPic.toLowerCase();
    const matchesQuery = target.includes(query);

    // 상태 필터링
    const matchesStatus = filterStatus === '전체' || approval.salesOppStatus.salesOppStatus === statusMap[filterStatus];

    return matchesQuery && matchesStatus;
  });
}

// 상세 보기로 이동하는 함수
function goToSalesOppContents(salesOppId) {
  router.push({ path: `/salesopp/${salesOppId}` });
}

// 페이지 로드 시 영업기회 데이터 가져오기
onMounted(async () => {
  try {
    const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity');
    approvals.value = response.data;
    filteredApprovals.value = approvals.value;
  } catch (error) {
    console.error('영업기회 목록을 불러오는 중 오류가 발생했습니다:', error);
    // 오류 처리 로직 추가
  }
});
</script>

  
  <style scoped>
    @import url('@/assets/css/contract/ContractList.css');
  </style>