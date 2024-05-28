<template>
    <div class="contract-content">
        <div class="contract-list">
            <h1>계약서 목록</h1>
        </div>
        <div class="contract-list-search">
            <div class="contract-dropdown">
                <button class="contract-dropdown-btn">{{ searchBy }} ▼</button>
                <div class="contract-dropdown-content">
                    <a href="#" @click="setSearchBy('계약서 코드')">계약서 코드</a>
                    <a href="#" @click="setSearchBy('담당자')">담당자</a>
                </div>
            </div>
            <input type="text" class="contract-search-input" v-model="searchQuery" placeholder="검색어를 입력하세요">
            <button class="contract-search-btn7" @click="applyFilter">검색</button>
        </div>
        <div class="contract-list-box7">
            <table class="contract-table7">
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
                    <tr v-for="(contract, index) in filteredContracts" :key="contract.contractId" @click="goToContractContents(contract.contractCode)">
                        <td>{{ index + 1 }}</td>
                        <td>{{ contract.contractCode }}</td>
                        <td>{{ contract.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ contract.contractDate }}</td>
                        <td>{{ contract.contractDueDate }}</td>
                        <td>{{ contract.contractStatus || 'N/A' }}</td>
                        <td>{{ contract.employee.employeeName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const contracts = ref([]);
const searchQuery = ref('');
const searchBy = ref('계약서 코드');
const filteredContracts = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:7775/contract');
        contracts.value = response.data;
        filteredContracts.value = contracts.value; // 기본적으로 모든 계약서를 표시
    } catch (error) {
        console.error('계약서 정보를 불러오는 중 오류가 발생했습니다.', error);
    }
});

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
}

function goToContractContents(contractCode) {
    router.push({ path: '/contract/contents', query: { code: contractCode } });
}
</script>

<style>
    @import url('@/assets/css/contract/ContractList.css');
</style>
