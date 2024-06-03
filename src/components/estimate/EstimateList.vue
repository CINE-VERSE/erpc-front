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
                        <td>{{ filteredEstimates.length - index }}</td> <!-- Reverse numbering -->
                        <td>{{ estimate.quotationCode }}</td>
                        <td>{{ estimate.quotationTotalCost.toLocaleString() }}</td>
                        <td>{{ estimate.quotationDate }}</td>
                        <td>{{ estimate.quotationDueDate }}</td>
                        <td>{{ estimate.approvalStatus || '' }}</td>
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
    await fetchEstimates();
    await fetchApprovalStatuses();
    applyFilter();
});

const fetchEstimates = async () => {
    try {
        const response = await axios.get('http://localhost:7775/quotation');
        estimates.value = response.data.map(estimate => ({
            quotationId: estimate.quotationId,
            quotationCode: estimate.quotationCode,
            quotationTotalCost: estimate.quotationTotalCost,
            quotationDate: estimate.quotationDate,
            quotationDueDate: estimate.quotationDueDate,
            employee: {
                employeeName: estimate.employee.employeeName
            }
        })).sort((a, b) => b.quotationId - a.quotationId); // Sort by quotationId in descending order
        filteredEstimates.value = estimates.value;
    } catch (error) {
        console.error('견적서 정보를 조회하는 중 오류가 발생했습니다.', error);
    }
};

const fetchApprovalStatuses = async () => {
    try {
        const response = await axios.get('http://localhost:7775/approval/quotation');
        const approvals = response.data;
        approvals.forEach(approval => {
            const estimate = estimates.value.find(est => est.quotationId === approval.quotation.quotationId);
            if (estimate) {
                estimate.approvalStatus = approval.approvalStatus.approvalStatus;
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
        filteredEstimates.value = estimates.value;
    } else {
        const query = searchQuery.value.toUpperCase(); // 검색어를 대문자로 변환
        filteredEstimates.value = estimates.value.filter(estimate => {
            if (searchBy.value === '견적서 코드') {
                return estimate.quotationCode.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            } else if (searchBy.value === '담당자') {
                return estimate.employee.employeeName.toUpperCase().includes(query); // 대상 문자열을 대문자로 변환 후 비교
            }
        });
    }
}

function goToEstimateContents(quotationId) {
    router.push({ path: `/estimate/${quotationId}` });
}
</script>

<style>
.estimate-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.estimate-list {
    text-align: center;
}

.estimate-list-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.estimate-dropdown {
    position: relative;
    display: inline-block;
}

.estimate-dropdown-btn {
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

.estimate-dropdown-content {
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

.estimate-dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ccc;
}

.estimate-dropdown-content a:hover {
    background-color: #d5e6ff;
}

.estimate-dropdown:hover .estimate-dropdown-content {
    display: block;
}

.estimate-search-input {
    width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    background-color: #d5e6ff;
    color: black;
}

.estimate-search-btn {
    background-color: #0C2092;
    border: none;
    color: white;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
}

.estimate-list-box {
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
    margin-bottom: 7%;
    gap: 1px;
}

.estimate-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.estimate-table th,
.estimate-table td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 180px; /* 너비 조절 */
}

.estimate-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.estimate-table tr:hover {
    background-color: #d5e6ff;
    cursor: pointer;
}
</style>
