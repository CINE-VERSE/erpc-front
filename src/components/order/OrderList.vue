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
            <button class="order-search-btn" @click="applyFilter">조회하기</button>
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
                    <tr v-for="(order, index) in paginatedOrders" :key="order.orderRegistrationId" @click="goToOrderContents(order.orderRegistrationId)">
                        <td>{{ filteredOrders.length - ((currentPage - 1) * itemsPerPage + index) }}</td>
                        <td>{{ order.transaction.transactionCode }}</td>
                        <td>{{ order.orderTotalPrice.toLocaleString() }}</td>
                        <td>{{ order.orderDate }}</td>
                        <td>{{ order.approvalStatus || '' }}</td>
                        <td>{{ order.employee.employeeName }}</td>
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
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const orders = ref([]);
const searchQuery = ref('');
const searchBy = ref('프로젝트 코드');
const filteredOrders = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(async () => {
    await fetchOrders();
    await fetchApprovalStatuses();
    applyFilter();
});

const fetchOrders = async () => {
    try {
        const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/order');
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
        const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/approval/shipment');
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
    currentPage.value = 1; // 필터 적용 시 첫 페이지로 이동
}

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredOrders.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredOrders.value.length / itemsPerPage.value);
});

function changePage(page) {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
}

function goToOrderContents(orderRegistrationId) {
    router.push({ path: `/order/${orderRegistrationId}` });
}
</script>

<style>
.order-content33 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.order-list33 {
    text-align: center;
}

.order-list-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.order-dropdown {
    position: relative;
    display: inline-block;
}

.order-dropdown-btn {
    width: 150px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    color: black;
}

.order-dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 5px;
    width: 100%;
    font-size: 14px;
}

.order-dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ccc;
}

.order-dropdown-content a:hover {
    background-color: #d5e6ff;
}

.order-dropdown:hover .order-dropdown-content {
    display: block;
}

.order-search-input {
    height: 40px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #e5f0ff;
    color: #0c2092;
    outline: none;
    width: 250px;
}

.order-search-btn {
    height: 40px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #0C2092;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.order-search-btn:hover {
    background-color: #007bff;
}

.order-list-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
    margin-bottom: 100px;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: white;
    height: auto;
    width: 100%;
    max-width: 1400px;
    margin: 20px auto;
    /* margin-bottom: 7%; */
    gap: 1px;
}

.order-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.order-table th,
.order-table td {
    text-align: center;
    width: 160px; /* 너비 조절 */
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.order-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.order-table tr:hover {
    background-color: #d5e6ff;
    cursor: pointer;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 5px;
}

.pagination button {
    background-color: #0C2092;
    color: white;
    border: none;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination button:hover:not(:disabled) {
    background-color: #007bff;
}

.pagination button:disabled {
    background-color: #ccc !important;
    cursor: not-allowed;
    color: #666; /* 회색 텍스트 색상 */
}

.pagination .active {
    background-color: #0C2092 !important; /* 남색 */
}
</style>


