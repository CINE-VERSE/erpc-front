<template>
  <div class="delete-requests">
    <h1>삭제 요청 관리</h1>

    <div v-if="salesOppDeleteRequests.length">
      <h2>영업기회 삭제 요청</h2>
      <ul>
        <li v-for="request in salesOppDeleteRequests" :key="request.salesOppDeleteRequestId">
          {{ request.salesOppDeleteRequestId }} - {{ request.salesOppDeleteRequestReason }}
          <button @click="processSalesOppDeleteRequest(request.salesOppDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="contractDeleteRequests.length">
      <h2>계약서 삭제 요청</h2>
      <ul>
        <li v-for="request in contractDeleteRequests" :key="request.contractDeleteRequestId">
          {{ request.contractDeleteRequestId }} - {{ request.contractDeleteRequestReason }}
          <button @click="processContractDeleteRequest(request.contractDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <!-- 추가된 코드 -->
    <div v-if="quotationDeleteRequests.length">
      <h2>견적서 삭제 요청</h2>
      <ul>
        <li v-for="request in quotationDeleteRequests" :key="request.quotationDeleteRequestId">
          {{ request.quotationDeleteRequestId }} - {{ request.quotationDeleteRequestReason }}
          <button @click="processQuotationDeleteRequest(request.quotationDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="accountDeleteRequests.length">
      <h2>거래처 삭제 요청</h2>
      <ul>
        <li v-for="request in accountDeleteRequests" :key="request.accountDeleteRequestId">
          {{ request.accountDeleteRequestId }} - {{ request.accountDeleteRequestReason }}
          <button @click="processAccountDeleteRequest(request.accountDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="orderDeleteRequests.length">
      <h2>수주 삭제 요청</h2>
      <ul>
        <li v-for="request in orderDeleteRequests" :key="request.orderDeleteRequestId">
          {{ request.orderDeleteRequestId }} - {{ request.orderDeleteRequestReason }}
          <button @click="processOrderDeleteRequest(request.orderDeleteRequestId)">삭제 처리</button>
        </li>
      </ul>
    </div>

    <div v-if="!salesOppDeleteRequests.length && !contractDeleteRequests.length && !quotationDeleteRequests.length && !accountDeleteRequests.length && !orderDeleteRequests.length">
      삭제 요청이 없습니다.
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
      orderDeleteRequests: []
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
        console.log('contract_delete_request:', this.contractDeleteRequests);
        console.log('salesOpp_delete_request:', this.salesOppDeleteRequests);
        console.error('삭제 요청을 불러오는 중 오류가 발생했습니다:', error);
      }
    },
    async processSalesOppDeleteRequest(salesOppDeleteRequestId) {
      try {
        await DeleteService.updateSalesOppDeleteRequestStatus(salesOppDeleteRequestId, { salesOppDeleteRequestStatus: 'Y' });
        alert('영업기회 삭제 요청이 성공적으로 처리되었습니다.');
        this.fetchDeleteRequests();
      } catch (error) {
        console.error('영업기회 삭제 요청 처리 중 오류가 발생했습니다:', error);
      }
    },
    async processContractDeleteRequest(contractDeleteRequestId) {
      try {
        await DeleteService.updateContractDeleteRequestStatus(contractDeleteRequestId, { contractDeleteRequestStatus: 'Y' });
        alert('계약서 삭제 요청이 성공적으로 처리되었습니다.');
        this.fetchDeleteRequests();
      } catch (error) {
        console.error('계약서 삭제 요청 처리 중 오류가 발생했습니다:', error);
      }
    },
    async processQuotationDeleteRequest(quotationDeleteRequestId) {
      try {
        await DeleteService.processQuotationDeleteRequest(quotationDeleteRequestId, {});
        alert('견적서 삭제 요청이 성공적으로 처리되었습니다.');
        this.fetchDeleteRequests();
      } catch (error) {
        console.error('견적서 삭제 요청 처리 중 오류가 발생했습니다:', error);
      }
    },
    async processAccountDeleteRequest(accountDeleteRequestId) {
      try {
        await DeleteService.processAccountDeleteRequest(accountDeleteRequestId, {});
        alert('거래처 삭제 요청이 성공적으로 처리되었습니다.');
        this.fetchDeleteRequests();
      } catch (error) {
        console.error('거래처 삭제 요청 처리 중 오류가 발생했습니다:', error);
      }
    },
    async processOrderDeleteRequest(orderDeleteRequestId) {
      try {
        await DeleteService.processOrderDeleteRequest(orderDeleteRequestId, {});
        alert('수주 삭제 요청이 성공적으로 처리되었습니다.');
        this.fetchDeleteRequests();
      } catch (error) {
        console.error('수주 삭제 요청 처리 중 오류가 발생했습니다:', error);
      }
    }
  }
};
</script>