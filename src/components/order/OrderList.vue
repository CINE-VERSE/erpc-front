<template>
    <div class="order-content">
        <div class="order-list">
            <h1>수주 목록</h1>
        </div>
        <div class="order-list-search">
            <div class="order-dropdown">
                <button class="order-dropdown-btn">{{ searchBy }} ▼</button>
                <div class="order-dropdown-content">
                    <a href="#" @click="setSearchBy('프로젝트 코드')">프로젝트 코드</a>
                    <a href="#" @click="setSearchBy('담당자')">담당자</a>
                </div>
            </div>
            <input type="text" class="order-search-input" v-model="searchQuery" placeholder="검색어를 입력하세요">
            <button class="order-search-btn" @click="applyFilter">검색</button>
        </div>
        <div class="order-list-box">
            <table class="order-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>프로젝트 코드</th>
                        <th>수주금액</th>
                        <th>작성일자</th>
                        <th>납기일자</th>
                        <th>결재상태</th>
                        <th>담당자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in filteredOrders" :key="order.orderRegistrationId" @click="goToOrderContents(order.orderRegistrationId)">
                        <td>{{ order.orderRegistrationId }}</td>
                        <td>{{ order.transaction.transactionCode }}</td>
                        <td>{{ order.orderTotalPrice.toLocaleString() }}</td>
                        <td>{{ order.orderDate }}</td>
                        <td>{{ order.depositDate || 'N/A' }}</td>
                        <td></td>
                        <!-- <td>{{ order.shipmentStatus.shipmentStatus }}</td> -->
                        <td>{{ order.employee.employeeName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const orders = ref([]);
const searchQuery = ref('');
const searchBy = ref('프로젝트 코드');
const filteredOrders = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:7775/order');
        orders.value = response.data;
        filteredOrders.value = orders.value;
    } catch (error) {
        console.error('Error fetching order data:', error);
    }
});

function setSearchBy(criteria) {
    searchBy.value = criteria;
}

function applyFilter() {
    if (!searchQuery.value) {
        filteredOrders.value = orders.value;
    } else {
        filteredOrders.value = orders.value.filter(order => {
            if (searchBy.value === '프로젝트 코드') {
                return order.transaction.transactionCode.includes(searchQuery.value);
            } else if (searchBy.value === '담당자') {
                return order.employee.employeeName.includes(searchQuery.value);
            }
        });
    }
}

function goToOrderContents(orderRegistrationId) {
    router.push({ path: `/order/contents`, query: { id: orderRegistrationId } });
}
</script>

<style>
    @import url('@/assets/css/order/OrderList.css');
</style>
