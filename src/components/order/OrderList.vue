<template>
    <div class="order-content33">
        <div class="order-list33">
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
                        <th>결재상태</th>
                        <th>담당자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in filteredOrders" :key="order.orderRegistrationId" @click="goToOrderContents(order.orderRegistrationId)">
                        <td>{{ filteredOrders.length - index }}</td>
                        <td>{{ order.transaction.transactionCode }}</td>
                        <td>{{ order.orderTotalPrice.toLocaleString() }}</td>
                        <td>{{ order.orderDate }}</td>
                        <td>{{ order.approvalStatus || '' }}</td>
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
    await fetchOrders();
    await fetchApprovalStatuses();
    applyFilter();
});

const fetchOrders = async () => {
    try {
        const response = await axios.get('http://localhost:7775/order');
        orders.value = response.data.map(order => ({
            orderRegistrationId: order.orderRegistrationId,
            transaction: order.transaction,
            orderTotalPrice: order.orderTotalPrice,
            orderDate: order.orderDate,
            employee: order.employee
        })).sort((a, b) => b.orderRegistrationId - a.orderRegistrationId); // Sort by orderRegistrationId in descending order
        filteredOrders.value = orders.value;
    } catch (error) {
        console.error('Error fetching order data:', error);
    }
};

const fetchApprovalStatuses = async () => {
    try {
        const response = await axios.get('http://localhost:7775/approval/shipment');
        const approvals = response.data;
        approvals.forEach(approval => {
            const order = orders.value.find(ord => ord.orderRegistrationId === approval.order.orderRegistrationId);
            if (order) {
                order.approvalStatus = approval.approvalStatus.approvalStatus;
            }
        });
    } catch (error) {
        console.error('Error fetching approval statuses:', error);
    }
};

function setSearchBy(criteria) {
    searchBy.value = criteria;
}

function applyFilter() {
    if (!searchQuery.value) {
        filteredOrders.value = orders.value;
    } else {
        const query = searchQuery.value.toUpperCase(); // 검색어를 대문자로 변환
        filteredOrders.value = orders.value.filter(order => {
            if (searchBy.value === '프로젝트 코드') {
                return order.transaction.transactionCode.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            } else if (searchBy.value === '담당자') {
                return order.employee.employeeName.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            }
        });
    }
}

function goToOrderContents(orderId) {
    router.push({ path: `/order/${orderId}` });
}
</script>


<style>
    @import url('@/assets/css/order/OrderList.css');
</style>
