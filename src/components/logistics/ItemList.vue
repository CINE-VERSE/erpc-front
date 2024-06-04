<template>
  <div class="contract-content">
    <div class="contract-list">
      <h1>품목 목록</h1>
    </div>
    <div class="contract-list-box7">
      <table class="contract-table7">
        <thead>
          <tr class="header1">
            <th>번호</th>
            <th>메인 카테고리</th>
            <th>서브 카테고리</th>
            <th>상품 코드</th>
            <th>상품 이름</th>
            <th>단위</th>
            <th>가격</th>
            <th>상태</th>
            <th>재고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedProductList" :key="product.productId">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ product.productMainCategory }}</td>
            <td>{{ product.productSubCategory }}</td>
            <td>{{ product.productCode }}</td>
            <td>{{ product.productName }}</td>
            <td>{{ product.productUnit }}</td>
            <td>{{ product.productPrice }}</td>
            <td>{{ product.productStatus }}</td>
            <td>{{ product.productInventory }}</td>
          </tr>
          <tr v-if="productList.length === 0">
            <td colspan="9" class="no-result">검색 결과가 없습니다.</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="prevPage">이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">다음</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      productList: [],
      currentPage: 1,
      pageSize: 15
    };
  },
  computed: {
    paginatedProductList() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = this.currentPage * this.pageSize;
      return this.productList.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.productList.length / this.pageSize);
    }
  },
  mounted() {
    this.fetchProductList();
  },
  methods: {
    async fetchProductList() {
      try {
        const response = await axios.get('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/product');
        this.productList = response.data;
      } catch (error) {
        console.error('품목 목록을 불러오는 중 에러 발생:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style>
@import url('@/assets/css/contract/ContractList.css');
</style>
