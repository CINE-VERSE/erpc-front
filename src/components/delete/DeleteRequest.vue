<template>
    <div>
      <h1>삭제 요청 관리</h1>
  
      <div v-if="salesOppDeleteRequests.length">
        <h2>영업기회 삭제 요청</h2>
        <ul>
          <li v-for="request in salesOppDeleteRequests" :key="request.id">
            {{ request.salesOppDeleteRequestId }} - {{ request.salesOppDeleteRequestReason }}
            <button @click="processSalesOppDeleteRequest(request.id)">삭제 처리</button>
          </li>
        </ul>
      </div>
  
      <div v-if="contractDeleteRequests.length">
        <h2>계약서 삭제 요청</h2>
        <ul>
          <li v-for="request in contractDeleteRequests" :key="request.id">
            {{ request.name }}  {{ request }} -
            <button @click="processContractDeleteRequest(request.id)">삭제 처리</button>
          </li>
        </ul>
      </div>
  
      <!-- 추가된 코드 -->
      <div v-if="quotationDeleteRequests.length">
        <h2>견적서 삭제 요청</h2>
        <ul>
          <li v-for="request in quotationDeleteRequests" :key="request.id">
            {{ request.name }} - {{ request.status }}
            <button @click="processQuotationDeleteRequest(request.id)">삭제 처리</button>
          </li>
        </ul>
      </div>
  
      <div v-if="accountDeleteRequests.length">
        <h2>거래처 삭제 요청</h2>
        <ul>
          <li v-for="request in accountDeleteRequests" :key="request.id">
            {{ request.name }} - {{ request.status }}
            <button @click="processAccountDeleteRequest(request.id)">삭제 처리</button>
          </li>
        </ul>
      </div>
  
      <div v-if="orderDeleteRequests.length">
        <h2>수주 삭제 요청</h2>
        <ul>
          <li v-for="request in orderDeleteRequests" :key="request.id">
            {{ request.name }} - {{ request.status }}
            <button @click="processOrderDeleteRequest(request.id)">삭제 처리</button>
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
  
          this.salesOppDeleteRequests = salesOppResponse.data;
          this.contractDeleteRequests = contractResponse.data;
          this.quotationDeleteRequests = quotationResponse.data;
          this.accountDeleteRequests = accountResponse.data;
          this.orderDeleteRequests = orderResponse.data;
        } catch (error) {
            console.log('contract_delete_request:', this.contractDeleteRequests);
            console.log('salesOpp_delete_request:', this.salesOppDeleteRequests);
          console.error('삭제 요청을 불러오는 중 오류가 발생했습니다:', error);
        }
      },
      async processSalesOppDeleteRequest(id) {
        try {
          const response = await DeleteService.updateSalesOppDeleteRequestStatus(id, { salesOppDeleteRequestStatus: 'Y' });
          console.log('영업기회 삭제 요청 처리 완료:', response.data);
          this.fetchDeleteRequests();
        } catch (error) {
          console.error('영업기회 삭제 요청 처리 중 오류가 발생했습니다:', error);
        }
      },
      async processContractDeleteRequest(id) {
        try {
          const response = await DeleteService.updateContractDeleteRequestStatus(id, { contractDeleteRequestStatus: 'Y' });
          console.log('계약서 삭제 요청 처리 완료:', response.data);
          this.fetchDeleteRequests();
        } catch (error) {
            console.error('계약서 삭제 요청 처리 중 오류가 발생했습니다:', error);
        }
      },
  
      // 추가된 메서드
      async processQuotationDeleteRequest(id) {
        try {
          const response = await DeleteService.processQuotationDeleteRequest(id, {});
          console.log('견적서 삭제 요청 처리 완료:', response.data);
          this.fetchDeleteRequests();
        } catch (error) {
          console.error('견적서 삭제 요청 처리 중 오류가 발생했습니다:', error);
        }
      },
      async processAccountDeleteRequest(id) {
        try {
          const response = await DeleteService.processAccountDeleteRequest(id, {});
          console.log('거래처 삭제 요청 처리 완료:', response.data);
          this.fetchDeleteRequests();
        } catch (error) {
          console.error('거래처 삭제 요청 처리 중 오류가 발생했습니다:', error);
        }
      },
      async processOrderDeleteRequest(id) {
        try {
          const response = await DeleteService.processOrderDeleteRequest(id, {});
          console.log('수주 삭제 요청 처리 완료:', response.data);
          this.fetchDeleteRequests();
        } catch (error) {
          console.error('수주 삭제 요청 처리 중 오류가 발생했습니다:', error);
        }
      }
    }
  };
  </script>