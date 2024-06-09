<template>
    <div class="contract-list-content9">
        <div class="contract-list">
            <h1>계약서 목록</h1>
        </div>
        <div class="contract-list-search22">
            <div class="contract-dropdown22">
                <button class="contract-dropdown-btn22">{{ searchBy }} ▼</button>
                <div class="contract-dropdown-content22">
                    <a href="#" @click="setSearchBy('계약서 코드')">계약서 코드</a>
                    <a href="#" @click="setSearchBy('담당자')">담당자</a>
                </div>
            </div>
            <input type="text" class="contract-search-input22" v-model="searchQuery" placeholder="검색어를 입력하세요">
            <button class="contract-search-btn22" @click="applyFilter">조회하기</button>
        </div>
        <div class="contract-list-box9">
            <table class="contract-table9">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>계약서 코드</th>
                        <th>계약금액</th>
                        <th>작성일자</th>
                        <th>납기일자</th>
                        <th>결재상태</th>
                        <th>담당자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(contract, index) in paginatedContracts" :key="contract.contractId" @click="goToContractContents(contract.contractId)">
                        <td>{{ filteredContracts.length - ((currentPage - 1) * itemsPerPage + index) }}</td> <!-- Reverse numbering -->
                        <td>{{ contract.contractCode }}</td>
                        <td>{{ contract.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ contract.contractDate }}</td>
                        <td>{{ contract.contractDueDate }}</td>
                        <td>{{ contract.approvalStatus || '' }}</td> <!-- 결재상태 표시 -->
                        <td>{{ contract.employee.employeeName }}</td>
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
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const contracts = ref([]);
const filteredContracts = ref([]);
const searchQuery = ref('');
const searchBy = ref('계약서 코드');
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(async () => {
    await fetchContracts();
    await fetchApprovalStatuses();
    applyFilter();
});

const fetchContracts = async () => {
    try {
        const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/contract');
        contracts.value = response.data.map(contract => ({
            contractId: contract.contractId,
            contractCode: contract.contractCode,
            contractTotalPrice: contract.contractTotalPrice,
            contractDate: contract.contractDate,
            contractDueDate: contract.contractDueDate,
            employee: {
                employeeName: contract.employee.employeeName
            }
        })).sort((a, b) => b.contractId - a.contractId); // Sort by contractId in descending order
        filteredContracts.value = contracts.value;
    } catch (error) {
        console.error('계약서 정보를 조회하는 중 오류가 발생했습니다.', error);
    }
};

const fetchApprovalStatuses = async () => {
    try {
        const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/approval/contract');
        const approvals = response.data;
        approvals.forEach(approval => {
            const contract = contracts.value.find(con => con.contractId === approval.contract.contractId);
            if (contract) {
                contract.approvalStatus = approval.approvalStatus.approvalStatus;
            }
        });
    } catch (error) {
        console.error('결재 상태를 조회하는 중 오류가 발생했습니다.', error);
    }
};

function setSearchBy(criteria) {
    searchBy.value = criteria;
}

function applyFilter() {
    if (!searchQuery.value) {
        filteredContracts.value = contracts.value;
    } else {
        const query = searchQuery.value.toUpperCase(); // 검색어를 대문자로 변환
        filteredContracts.value = contracts.value.filter(contract => {
            if (searchBy.value === '계약서 코드') {
                return contract.contractCode.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            } else if (searchBy.value === '담당자') {
                return contract.employee.employeeName.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            }
        });
    }
    currentPage.value = 1; // 필터 적용 시 첫 페이지로 이동
}

const paginatedContracts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredContracts.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredContracts.value.length / itemsPerPage.value);
});

function changePage(page) {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
}

function goToContractContents(contractId) {
    router.push({ path: `/contract/${contractId}` });
}
</script>



<style>
.contract-list-content9 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.contract-list {
    text-align: center;
}

.contract-list-search22 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.contract-dropdown22 {
    position: relative;
    display: inline-block;
}

.contract-dropdown-btn22 {
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

.contract-dropdown-content22 {
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

.contract-dropdown-content22 a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ccc;
}

.contract-dropdown-content22 a:hover {
    background-color: #d5e6ff;
}

.contract-dropdown22:hover .contract-dropdown-content22 {
    display: block;
}

.contract-search-input22 {
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

.contract-search-btn22 {
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

.contract-search-btn22:hover {
    background-color: #007bff;
}

.contract-list-box9 {
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

.contract-table9 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.contract-table9 th,
.contract-table9 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 160px; /* 너비 조절 */
}

.contract-table9 th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.contract-table9 tr:hover {
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
