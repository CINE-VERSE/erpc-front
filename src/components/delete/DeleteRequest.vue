<template>
  <div class="delete-requests">
    <h1>삭제 요청 관리</h1>

    <div v-if="salesOppDeleteRequests.length">
      <h2>영업기회 삭제 요청</h2>
      <ul>
        <li v-for="(request, index) in salesOppDeleteRequests" :key="request.salesOppDeleteRequestId" @click="openSingleView(request.salesOppDeleteRequestId, 'salesOpp')">
          {{ index + 1 }} - {{ request.salesOppDeleteRequestReason }}
          <button @click="processSalesOppDeleteRequest(request.salesOppDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="contractDeleteRequests.length">
      <h2>계약서 삭제 요청</h2>
      <ul>
        <li v-for="(request, index) in contractDeleteRequests" :key="request.contractDeleteRequestId">
          {{ index + 1 }} - {{ request.contractDeleteRequestReason }}
          <button @click="processContractDeleteRequest(request.contractDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <!-- 추가된 코드 -->
    <div v-if="quotationDeleteRequests.length">
      <h2>견적서 삭제 요청</h2>
      <ul>
        <li v-for="(request, index) in quotationDeleteRequests" :key="request.quotationDeleteRequestId">
          {{ index + 1 }} - {{ request.quotationDeleteRequestReason }}
          <button @click="processQuotationDeleteRequest(request.quotationDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="accountDeleteRequests.length">
      <h2>거래처 삭제 요청</h2>
      <ul>
        <li v-for="(request, index) in accountDeleteRequests" :key="request.accountDeleteRequestId">
          {{ index + 1 }} - {{ request.accountDeleteRequestReason }}
          <button @click="processAccountDeleteRequest(request.accountDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="orderDeleteRequests.length">
      <h2>수주 삭제 요청</h2>
      <ul>
        <li v-for="(request, index) in orderDeleteRequests" :key="request.orderDeleteRequestId">
          {{index + 1 }} - {{ request.orderDeleteRequestReason }}
          <button @click="processOrderDeleteRequest(request.orderDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="!salesOppDeleteRequests.length && !contractDeleteRequests.length && !quotationDeleteRequests.length && !accountDeleteRequests.length && !orderDeleteRequests.length">
      삭제 요청이 없습니다.
    </div>

    <!-- 팝업 부분 -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        {{ singleViewContent }}
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import DeleteService from '@/components/delete/DeleteService';  // 경로는 실제 프로젝트 구조에 맞게 조정

export default {
  data() {
    return {
      salesOppDeleteRequests: [],
      contractDeleteRequests: [],
      quotationDeleteRequests: [],
      accountDeleteRequests: [],
      orderDeleteRequests: [],
      isModalOpen: false,
      singleViewContent: ''
    };
  },
  created() {
    this.fetchDeleteRequests();
  },
  methods: {
    async fetchDeleteRequests() {
      try {
        const [salesOppResponse, contractResponse, quotationResponse, accountResponse, orderResponse] = await Promise.all([
          DeleteService.getSalesOppDeleteRequests(),
          DeleteService.getContractDeleteRequests(),
          DeleteService.getQuotationDeleteRequests(),
          DeleteService.getAccountDeleteRequests(),
          DeleteService.getOrderDeleteRequests()
        ]);

        this.salesOppDeleteRequests = salesOppResponse.data.filter(request => request.salesOppDeleteRequestStatus !== 'Y');
        this.contractDeleteRequests = contractResponse.data.filter(request => request.contractDeleteRequestStatus !== 'Y');
        this.quotationDeleteRequests = quotationResponse.data.filter(request => request.quotationDeleteRequestStatus !== 'Y');
        this.accountDeleteRequests = accountResponse.data.filter(request => request.accountDeleteRequestStatus !== 'Y');
        this.orderDeleteRequests = orderResponse.data.filter(request => request.orderDeleteRequestStatus !== 'Y');
      } catch (error) {
        console.error('삭제 요청을 불러오는 중 오류가 발생했습니다:', error);
      }
    },
    async processSalesOppDeleteRequest(salesOppDeleteRequestId) {
  try {
    const requestData = { 
      salesOppDeleteRequestId: salesOppDeleteRequestId,
    };
    console.log('Request Data:', requestData); 

    await DeleteService.updateSalesOppDeleteRequestProcess(requestData);
    alert('영업기회 삭제 요청이 성공적으로 처리되었습니다.');
    this.fetchDeleteRequests();
  } catch (error) {
    console.error('영업기회 삭제 요청 처리 중 오류가 발생했습니다:', error);
  }
},
async processContractDeleteRequest(contractDeleteRequestId) {
  try {
    const requestData = { 
      contractDeleteRequestId: contractDeleteRequestId,
    };
    console.log('Request Data:', requestData); 

    await DeleteService.updateContractDeleteRequestStatus(requestData);
    alert('계약서 삭제 요청이 성공적으로 처리되었습니다.');
    this.fetchDeleteRequests();
  } catch (error) {
    console.error('계약서 삭제 요청 처리 중 오류가 발생했습니다:', error);
  }
},
async processQuotationDeleteRequest(QuotationDeleteRequestId) {
  try {
    const requestData = { 
      QuotationDeleteRequestId: QuotationDeleteRequestId,
    };
    console.log('Request Data:', requestData); 

    await DeleteService.processQuotationDeleteRequest(requestData);
    alert('견적서 삭제 요청이 성공적으로 처리되었습니다.');
    this.fetchDeleteRequests();
  } catch (error) {
    console.error('견적서 삭제 요청 처리 중 오류가 발생했습니다:', error);
  }
},
async processAccountDeleteRequest(accountDeleteRequestsId) {
  try {
    const requestData = { 
      accountDeleteRequestsId: accountDeleteRequestsId,
    };
    console.log('Request Data:', requestData); 

    await DeleteService.processAccountDeleteRequest(requestData);
    alert('거래처 삭제 요청이 성공적으로 처리되었습니다.');
    this.fetchDeleteRequests();
  } catch (error) {
    console.error('거래처 삭제 요청 처리 중 오류가 발생했습니다:', error);
  }
},
async processOrderDeleteRequest(OrderDeleteRequestId) {
  try {
    const requestData = { 
      OrderDeleteRequestId: OrderDeleteRequestId,
    };
    console.log('Request Data:', requestData); 

    await DeleteService.processOrderDeleteRequest(requestData);
    alert('수주 삭제 요청이 성공적으로 처리되었습니다.');
    this.fetchDeleteRequests();
  } catch (error) {
    console.error('수주 삭제 요청 처리 중 오류가 발생했습니다:', error);
  }
},
    openSingleView(requestId, type) {
      // 단일 조회 팝업을 열기 위한 메서드
      this.isModalOpen = true;
      // 단일 조회 페이지의 내용을 가져오는 비동기 함수 호출
      this.fetchSingleViewContent(requestId, type);
    },

    async fetchSingleViewContent(requestId, type) {
      try {
        let response;
        if (type === 'salesOpp') {
          response = await DeleteService.findSalesOppDeleteRequestById(requestId);
        } else if (type === 'contract') {
          response = await DeleteService.findContractDeleteRequestById(requestId);
        } else if (type === 'quotation') {
          response = await DeleteService.findQuotationDeleteRequestById(requestId);
        } else if (type === 'account') {
          response = await DeleteService.findAccountDeleteRequestById(requestId);
        } else if (type === 'order') {
          response = await DeleteService.findOrderDeleteRequestById(requestId);
        }
        this.singleViewContent = response.data;
      } catch (error) {
        console.error('단일 조회 페이지를 불러오는 중 오류가 발생했습니다:', error);
      }
    },

    closeModal() {
      // 모달을 닫는 메서드
      this.isModalOpen = false;
      // 단일 조회 페이지의 내용 초기화
      this.singleViewContent = '';
    }
  }
};
</script>
<style scoped>
.delete-requests {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-requests h1 {
  color: #333;
  margin-bottom: 20px;
}

.delete-requests h2 {
  color: #555;
  margin-top: 20px;
}

.delete-requests ul {
  list-style-type: none;
  padding: 0;
}

.delete-requests li {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-requests button {
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-requests button:hover {
  background-color: #0056b3;
}

.delete-requests button:active {
  background-color: #004080;
}

.delete-requests div {
  margin-bottom: 20px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 배경을 어둡게 하여 모달 효과를 줌 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* 그림자 효과 추가 */
}
</style>