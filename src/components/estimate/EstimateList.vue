<template>
    <div class="estimate-content">
        <div class="estimate-list">
            <h1>견적서 목록</h1>
        </div>
        <div class="estimate-list-search">
            <div class="estimate-dropdown">
                <button class="estimate-dropdown-btn">{{ searchBy }} ▼</button>
                <div class="estimate-dropdown-content">
                    <a href="#" @click="setSearchBy('견적서 코드')">견적서 코드</a>
                    <a href="#" @click="setSearchBy('담당자')">담당자</a>
                </div>
            </div>
            <input type="text" class="estimate-search-input" v-model="searchQuery" placeholder="검색어를 입력하세요">
            <button class="estimate-search-btn" @click="applyFilter">검색</button>
        </div>
        <div class="estimate-list-box">
            <table class="estimate-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>견적서 코드</th>
                        <th>견적금액</th>
                        <th>작성일자</th>
                        <th>마감일자</th>
                        <th>결재상태</th>
                        <th>담당자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(estimate, index) in filteredEstimates" :key="estimate.quotationId" @click="goToEstimateContents(estimate.quotationId)">
                        <td>{{ index + 1 }}</td>
                        <td>{{ estimate.quotationCode }}</td>
                        <td>{{ estimate.quotationTotalCost }}</td>
                        <td>{{ estimate.quotationDate }}</td>
                        <td>{{ estimate.quotationDueDate }}</td>
                        <td>{{ estimate.status }}</td>
                        <td>{{ estimate.employee.employeeName }}</td>
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

const estimates = ref([]);
const filteredEstimates = ref([]);
const searchQuery = ref('');
const searchBy = ref('견적서 코드');

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:7775/quotation');
        estimates.value = response.data.map(estimate => ({
            quotationId: estimate.quotationId,
            quotationCode: estimate.quotationCode,
            quotationTotalCost: estimate.quotationTotalCost,
            quotationDate: estimate.quotationDate,
            quotationDueDate: estimate.quotationDueDate,
            status: estimate.accountStatus?.statusName || 'N/A', // Assuming you have a status field
            employee: {
                employeeName: estimate.employee.employeeName
            }
        }));
        filteredEstimates.value = estimates.value;
    } catch (error) {
        console.error('견적서 정보를 조회하는 중 오류가 발생했습니다.', error);
    }
});

function setSearchBy(criteria) {
    searchBy.value = criteria;
}

function applyFilter() {
    if (!searchQuery.value) {
        filteredEstimates.value = estimates.value;
    } else {
        filteredEstimates.value = estimates.value.filter(estimate => {
            if (searchBy.value === '견적서 코드') {
                return estimate.quotationCode.includes(searchQuery.value);
            } else if (searchBy.value === '담당자') {
                return estimate.employee.employeeName.includes(searchQuery.value);
            }
        });
    }
}

function goToEstimateContents(quotationId) {
    router.push({ path: `/estimate/${quotationId}` });
}
</script>


<style>
    @import url('@/assets/css/estimate/EstimateList.css');
</style>
