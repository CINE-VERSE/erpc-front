<template>
  <div class="delete-request-content">
    <div class="delete-request-search">
      <h1 class="delete-request-title">삭제요청관리</h1>
    </div>
    <div class="filter-box">
      <div class="filter-controls">
        <select v-model="selectedDeleteRequestType" @change="applyFilter" class="delete-type-select">
          <option value="salesOpp">영업기회 삭제</option>
          <option value="contract">계약서 삭제</option>
          <option value="quotation">견적서 삭제</option>
          <option value="account">거래처 삭제</option>
          <option value="order">수주 삭제</option>
        </select>
        <input type="text" class="delete-request-search-input" v-model="searchQuery" :placeholder="placeholderText" @input="toUpperCase">
        <button class="delete-request-search-btn" @click="applyFilter">조회하기</button>
      </div>
    </div>

    <div class="delete-request-list">
      <template v-if="selectedDeleteRequestType === 'salesOpp'">
        <h2>영업기회 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>거래처명</th>
              <th>거래처 담당자</th>
              <th>작성 일자</th>
              <th>요청 사유</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredsalesOppDeleteRequests" :key="request.salesOppDeleteRequestId" @click="goToSalesOppDetail(request.salesOppDeleteRequestId)">
              <td>{{ filteredsalesOppDeleteRequests.length - index }}</td>
              <td>{{ request.salesOpp.oppAccountName }}</td>
              <td>{{ request.salesOpp.oppAccountPic }}</td>
              <td>{{ request.salesOpp.oppDate }}</td>
              <td>{{ request.salesOppDeleteRequestReason }}</td>
            </tr>
          </tbody>
        </table>
      </template>


      <template v-if="selectedDeleteRequestType === 'contract'">
        <h2>계약서 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>계약서 코드</th>
              <th>거래처명</th>
              <th>요청일자</th>
              <th>요청 사유</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredContractDeleteRequests" :key="request.contractDeleteRequestId" @click="goToContractDetail(request.contractDeleteRequestId)">
              <td>{{ filteredContractDeleteRequests.length - index }}</td>
              <td>{{ request.contract.contractCode }}</td>
              <td>{{ request.contract.account.accountName }}</td>
              <td>{{ request.contract.contractDueDate }}</td>
              <td>{{ request.contractDeleteRequestReason }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- 추가된 삭제 요청 유형들 -->
      <template v-if="selectedDeleteRequestType === 'quotation'">
        <h2>견적서 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>견적서 코드</th>
              <th>거래처명</th>
              <th>요청일자</th>
              <th>요청 사유</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredQuotationDeleteRequests" :key="request.quotationDeleteRequestId" @click="goToQuotationDetail(request.quotationDeleteRequestId)">
        <td>{{ filteredQuotationDeleteRequests.length - index }}</td>
        <td>{{ request.quotation.quotationCode }}</td>
        <td>{{ request.quotation.account.accountName }}</td>
        <td>{{ request.requestDate }}</td>
        <td>{{ request.quotationDeleteRequestReason }}</td>
      </tr>
          </tbody>
        </table>
      </template>

      <template v-if="selectedDeleteRequestType === 'account'">
        <h2>거래처 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>거래처 코드</th>
              <th>거래처명</th>
              <th>대표자명</th>
              <th>요청 사유</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredAccountDeleteRequests" :key="request.accountDeleteRequestId"  @click="goToAccountDetail(request.accountDeleteRequestId)">
              <td>{{ filteredAccountDeleteRequests.length - index }}</td>
              <td>{{ request.account.accountCode }}</td>
              <td>{{ request.account.accountName }}</td>
              <td>{{ request.account.accountRepresentative }}</td>
              <td>{{ request.accountDeleteRequestReason }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="selectedDeleteRequestType === 'order'">
        <h2>수주 삭제 요청</h2>
        <table class="delete-request-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>프로젝트 코드</th>
              <th>거래처명</th>
              <th>마감 일자</th>
              <th>요청 사유</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in filteredOrderDeleteRequests" :key="request.orderDeleteRequestId" @click="goToOrderDetail(request.orderDeleteRequestId)">
              <td>{{ filteredOrderDeleteRequests.length - index }}</td>
              <td>{{ request.order.transaction.transactionCode  }}</td>
              <td>{{ request.order.account.accountName }}</td>
              <td>{{ request.order.orderDueDate }}</td>
              <td>{{ request.orderDeleteRequestReason }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import DeleteService from '@/components/delete/DeleteService';
import { useRouter } from 'vue-router';

const router = useRouter();
// 데이터 및 변수 선언
const salesOppDeleteRequests = ref([]);
const contractDeleteRequests = ref([]);
const quotationDeleteRequests = ref([]);
const accountDeleteRequests = ref([]);
const orderDeleteRequests = ref([]);
const searchQuery = ref('');
const selectedDeleteRequestType = ref('salesOpp');
const filteredsalesOppDeleteRequests = ref([]);
const filteredContractDeleteRequests = ref([]);
const filteredQuotationDeleteRequests = ref([]);
const filteredAccountDeleteRequests = ref([]);
const filteredOrderDeleteRequests = ref([]);

// 플레이스홀더 텍스트를 동적으로 설정
const placeholderText = computed(() => {
  switch (selectedDeleteRequestType.value) {
    case 'salesOpp':
      return '영업기회 코드로 조회';
    case 'contract':
      return '계약서 코드로 조회';
    case 'quotation':
      return '견적서 코드로 조회';
    case 'account':
      return '거래처 코드로 조회';
    case 'order':
      return '수주 코드로 조회';
    default:
      return '코드로 조회';
  }
});

// 검색어를 대문자로 변환
const toUpperCase = () => {
  searchQuery.value = searchQuery.value.toUpperCase();
};

// 데이터 가져오기 및 필터링 적용
onMounted(async () => {
  await fetchDeleteRequests();
  applyFilter();
});

// 선택된 삭제 요청 유형이 변경될 때 필터 적용
watch([selectedDeleteRequestType, searchQuery], () => {
  applyFilter();
});

// 각 삭제 요청 데이터 가져오기
const fetchDeleteRequests = async () => {
  try {
    // Fetch all delete requests using DeleteService
    salesOppDeleteRequests.value = (await DeleteService.getSalesOppDeleteRequests()).data;
    contractDeleteRequests.value = (await DeleteService.getContractDeleteRequests()).data;
    quotationDeleteRequests.value = (await DeleteService.getQuotationDeleteRequests()).data;
    accountDeleteRequests.value = (await DeleteService.getAccountDeleteRequests()).data;
    orderDeleteRequests.value = (await DeleteService.getOrderDeleteRequests()).data;
    
    // Initialize filtered data with the full data
    filteredsalesOppDeleteRequests.value = salesOppDeleteRequests.value;
    filteredContractDeleteRequests.value = contractDeleteRequests.value;
    filteredQuotationDeleteRequests.value = quotationDeleteRequests.value;
    filteredAccountDeleteRequests.value = accountDeleteRequests.value;
    filteredOrderDeleteRequests.value = orderDeleteRequests.value;
    console.log('Loaded contract delete requests:', contractDeleteRequests.value);
  } catch (error) {
    console.error('Error fetching delete requests:', error);
  }
};

// 필터링 로직
const applyFilter = () => {
  const filterQuery = searchQuery.value;

  filteredsalesOppDeleteRequests.value = salesOppDeleteRequests.value.filter(request =>
    !filterQuery || request.salesOpp.salesOppCode.includes(filterQuery)
  );

  filteredContractDeleteRequests.value = contractDeleteRequests.value.filter(request =>
    !filterQuery || request.contract.contractCode.includes(filterQuery)
  );

  filteredQuotationDeleteRequests.value = quotationDeleteRequests.value.filter(request =>
    !filterQuery || request.quotation.quotationCode.includes(filterQuery)
  );

  filteredAccountDeleteRequests.value = accountDeleteRequests.value.filter(request =>
    !filterQuery || request.account.accountCode.includes(filterQuery)
  );

  filteredOrderDeleteRequests.value = orderDeleteRequests.value.filter(request =>
    !filterQuery || request.order.orderCode.includes(filterQuery)
  );
};
const goToQuotationDetail = (quotationDeleteRequestsId) => {
  router.push({ path: `/delete/quotation/${quotationDeleteRequestsId}` });
};
const goToOrderDetail = (orderDeleteRequestsId) => {
  router.push({ path: `/delete/order/${orderDeleteRequestsId}` });
};
const goToSalesOppDetail = (salesOppDeleteRequestId) => {
  router.push({ path: `/delete/salesOpp/${salesOppDeleteRequestId}` });
};
const goToAccountDetail = (accountDeleteRequestId) => {
  router.push({ path: `/delete/account/${accountDeleteRequestId}` });
};
const goToContractDetail = (contractDeleteRequestsId) => {
  router.push({ path: `/delete/contract/${contractDeleteRequestsId}` });
};
</script>

<style scoped>
/* Styles for the component */
.delete-request-content {
  padding: 20px;
}

.delete-request-search {
  margin-bottom: 20px;
}

.delete-request-title {
  font-size: 24px;
  font-weight: bold;
}

.filter-box {
  margin-bottom: 20px;
}

.filter-controls {
  display: flex;
  align-items: center;
}

.delete-type-select {
  margin-right: 10px;
  padding: 5px;
}

.delete-request-search-input {
  margin-right: 10px;
  padding: 5px;
  width: 200px;
}

.delete-request-search-btn {
  padding: 5px 10px;
}

.delete-request-list {
  margin-top: 20px;
}

.delete-request-table {
  width: 100%;
  border-collapse: collapse;
}

.delete-request-table th, .delete-request-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.delete-request-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>
