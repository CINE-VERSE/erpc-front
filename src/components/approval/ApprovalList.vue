<template>
    <div class="approval-content1">
        <div class="approval-search">
            <h1 class="approval-search-text">결재 승인 요청 목록</h1>
        </div>
        <div class="approval-box">
            <div class="search-date">
                <input type="date" class="search-start-date-box" id="search-start-date-box" v-model="startDate">
                <span>-</span>
                <input type="date" class="search-end-date-box" id="search-end-date-box" v-model="endDate">
                <input type="text" class="approval-search-input" v-model="searchQuery" placeholder="견적서 코드로 조회">
                <button class="approval-search-btn" @click="applyFilter">조회하기</button>
            </div>
        </div>
        <div class="approval-list-box">
            <table class="approval-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>견적서 코드</th>
                        <th>거래처명</th>
                        <th>견적금액</th>
                        <th>요청일자</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(approval, index) in filteredApprovals" :key="approval.quotationApprovalId" @click="goToApprovalContents(approval.quotation.quotationId)">
                        <td>{{ index + 1 }}</td>
                        <td>{{ approval.quotation.quotationCode }}</td>
                        <td>{{ approval.quotation.account.accountName }}</td>
                        <td>{{ approval.quotation.quotationTotalCost.toLocaleString() }}</td>
                        <td>{{ approval.approvalRequestDate }}</td>
                        <td>{{ approval.approvalStatus.approvalStatus }}</td>
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

const approvals = ref([]);
const startDate = ref('');
const endDate = ref('');
const searchQuery = ref('');
const filteredApprovals = ref([]);

onMounted(async () => {
    await fetchApprovals();
    applyFilter();
});

const fetchApprovals = async () => {
    try {
        const response = await axios.get('http://localhost:7775/approval/quotation');
        approvals.value = response.data;
        filteredApprovals.value = approvals.value;
    } catch (error) {
        console.error('Error fetching approvals:', error);
    }
};

const applyFilter = () => {
    if (startDate.value && endDate.value) {
        filteredApprovals.value = approvals.value.filter(approval => {
            return approval.approvalRequestDate >= startDate.value && approval.approvalRequestDate <= endDate.value;
        });
    } else {
        filteredApprovals.value = approvals.value;
    }

    if (searchQuery.value) {
        filteredApprovals.value = filteredApprovals.value.filter(approval =>
            approval.quotation.quotationCode.includes(searchQuery.value)
        );
    }
};

const goToApprovalContents = (quotationId) => {
    router.push({ path: `/approval/quotation/${quotationId}` });
};
</script>

<style>
.approval-content1 {
    /* margin-top: 4%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.approval-search {
    text-align: center;
    /* margin-top: 3%; */
}

.approval-search-text {
    margin-top: 5%;
    margin-bottom: 30px;
}

.search-date {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-start-date-box,
.search-end-date-box {
    height: 40px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    width: 200px;
    font-size: 14px;
}

.approval-search-input {
    height: 40px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #e5f0ff;
    color: #0c2092;
    outline: none;
    width: 200px;
}

.approval-search-btn {
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

.approval-list-box {
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
    max-width: 1400px;
    margin: 20px auto;
    margin-bottom: 7%;
    gap: 1px;
}

.approval-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.approval-table th,
.approval-table td {
    text-align: center;
    border: 1px solid #ccc;
    width: 160px;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.approval-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.approval-table tr:hover {
    background-color: #d5e6ff;
    cursor: pointer;
}
</style>
