<template>
    <div class="customer-list-content">
        <div class="customer-list">
            <h1>거래처 목록</h1>
        </div>
        <div class="customer-list-search">
            <div class="customer-dropdown">
                <button class="customer-dropdown-btn">{{ searchBy }} ▼</button>
                <div class="customer-dropdown-content">
                    <a href="#" @click="setSearchBy('거래처명')">거래처명</a>
                    <a href="#" @click="setSearchBy('거래처 코드')">거래처 코드</a>
                    <a href="#" @click="setSearchBy('사업자 번호')">사업자 번호</a>
                </div>
            </div>
            <input type="text" class="customer-search-input" v-model="searchQuery" placeholder="검색어를 입력하세요">
            <button class="customer-search-btn" @click="applyFilter">조회하기</button>
        </div>
        <div class="customer-list-box">
            <table class="customer-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>거래처 코드</th>
                        <th>사업자명</th>
                        <th>사업자 번호</th>
                        <th>대표자명</th>
                        <th>업종</th>
                        <th>전화번호</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(customer, index) in paginatedCustomers" :key="customer.accountId" @click="goToCustomerContents(customer.accountId)">
                        <td>{{ filteredCustomers.length - ((currentPage - 1) * itemsPerPage + index) }}</td> <!-- Reverse numbering -->
                        <td>{{ customer.accountCode }}</td>
                        <td>{{ customer.accountName }}</td>
                        <td>{{ customer.corporationNum }}</td>
                        <td>{{ customer.accountRepresentative }}</td>
                        <td>{{ customer.accountType }}</td>
                        <td>{{ customer.accountContact }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
            <button v-for="page in totalPages" @click="changePage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
        </div>
    </div>
</template>




<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const customers = ref([]);
const searchQuery = ref('');
const searchBy = ref('거래처명');
const filteredCustomers = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(async () => {
    try {
        const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/account/list');
        customers.value = response.data.sort((a, b) => b.accountId - a.accountId); // Sort by accountId
        filteredCustomers.value = customers.value;
        applyFilter(); // Apply initial filter
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
});

function setSearchBy(criteria) {
    searchBy.value = criteria;
}

function applyFilter() {
    if (!searchQuery.value) {
        filteredCustomers.value = customers.value;
    } else {
        const query = searchQuery.value.toUpperCase(); // 검색어를 대문자로 변환
        filteredCustomers.value = customers.value.filter(customer => {
            if (searchBy.value === '거래처명') {
                return customer.accountName.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            } else if (searchBy.value === '거래처 코드') {
                return customer.accountCode.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            } else if (searchBy.value === '사업자 번호') {
                return customer.corporationNum.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            }
        });
    }
    currentPage.value = 1; // 필터 적용 시 첫 페이지로 이동
}

const paginatedCustomers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredCustomers.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredCustomers.value.length / itemsPerPage.value);
});

function changePage(page) {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
}

function goToCustomerContents(accountId) {
    router.push({ path: `/customer/${accountId}` });
}
</script>





<style>
.customer-list-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.customer-list {
    text-align: center;
}

.customer-list-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.customer-dropdown {
    position: relative;
    display: inline-block;
}

.customer-dropdown-btn {
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

.customer-dropdown-content {
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

.customer-dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ccc;
}

.customer-dropdown-content a:hover {
    background-color: #d5e6ff;
}

.customer-dropdown:hover .customer-dropdown-content {
    display: block;
}

.customer-search-input {
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

.customer-search-btn {
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

.customer-search-btn:hover {
    background-color: #007bff;
}

.customer-list-box {
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

.customer-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.customer-table th,
.customer-table td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 180px; /* 너비 조절 */
}

.customer-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.customer-table tr:hover {
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
    /* padding: 15px; */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination button:hover {
    background-color: #007bff;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination .active {
    background-color: #007bff;
}

</style>
