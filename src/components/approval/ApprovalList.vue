<template>
    <div class="approval-content">
        <div class="approval-search">
            <h1 class="approval-search-text">결재 승인 요청 목록</h1>
        </div>
        <div class="approval-box">
            <div class="search-date">
                <p class="search-start-date-text">조회 시작 일자</p>
                <input type="date" class="search-start-date-box" id="search-start-date-box" v-model="startDate">
                <p class="search-end-date-text">조회 종료 일자</p>
                <input type="date" class="search-end-date-box" id="search-end-date-box" v-model="endDate">
            </div>
            <div class="approval-search-btn-div">
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
                    <tr v-for="(approval, index) in filteredApprovals" :key="approval.quotationApprovalId" @click="goToApprovalContents(approval.quotation.quotationCode)">
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
};

const goToApprovalContents = (quotationCode) => {
    router.push({ path: '/order/contents', query: { code: quotationCode } });
};
</script>

<style>
.approval-content {
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.approval-search {
    text-align: center;
    margin-top: 3%;
}

.approval-search-text {
    margin-top: 5%;
    margin-bottom: 30px;
}

.approval-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
    margin-bottom: 50px;
    border-radius: 10px;
    border: 2px solid #ccc;
    box-sizing: border-box;
    background-color: whitesmoke;
    height: auto;
    max-width: 300px;
}

.search-date {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-start-date-text,
.search-end-date-text {
    min-width: 50px;
    margin-right: 10px;
    margin-bottom: 2px;
}

.search-start-date-box,
.search-end-date-box {
    flex-grow: 1;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    width: 220px;
}

.approval-search-btn-div {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
    margin-top: 10px;
}

.approval-search-btn {
    padding: 10px 20px;
    text-align: center;
    border: none;
    border-radius: 10px;
    background-color: #0C2092;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 5px;
    margin-bottom: 5px;
    max-width: 320px;
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
