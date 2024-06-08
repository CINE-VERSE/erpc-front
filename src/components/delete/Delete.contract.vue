<template>
    <div class="delete-request-content" v-if="deleteRequestData">
        <h1 class="maintext">계약서 삭제 요청 내역</h1>

        <div class="contract-details">
            <table class="details-table">
                <thead>
                    <tr>
                        <th>계약서 코드</th>
                        <th>계약 금액</th>
                        <th>작성 일자</th>
                        <th>삭제 요청 일자</th>
                        <th>마감 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ deleteRequestData.contract.contractCode }}</td>
                        <td>{{ deleteRequestData.contract.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ deleteRequestData.contract.contractDate }}</td>
                        <td>{{ deleteRequestData.requestDate }}</td>
                        <td>{{ deleteRequestData.contract.contractDueDate }}</td>
                    </tr>
                </tbody>
            </table>

            <table class="details-table">
                <thead>
                    <tr>
                        <th>담당자</th>
                        <th>거래처명</th>
                        <th>삭제 요청 사유</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ deleteRequestData.contract.employee.employeeName }}</td>
                        <td>{{ deleteRequestData.contract.account.accountName }}</td>
                        <td>{{ deleteRequestData.deleteRequestReason }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// Vue Router에서 `contractDeleteRequestId`를 가져옴
const route = useRoute();
const deleteRequestData = ref(null);
const showApprovalPopup = ref(false);
const showRejectPopup = ref(false);
const approvalContent = ref('');
const rejectContent = ref('');

const fetchDeleteRequestData = async () => {
    const contractDeleteRequestsId = route.params.contractDeleteRequestsId;
    try {
        // 삭제 요청 데이터를 가져옴
        const response = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/delete/contract/${contractDeleteRequestsId}`);
        deleteRequestData.value = response.data;
    } catch (error) {
        console.error("Error fetching delete request data:", error);
    }
};

onMounted(fetchDeleteRequestData);


</script>

<style scoped>
.delete-request-content {
    padding: 20px;
}

.maintext {
    font-size: 24px;
    margin-bottom: 20px;
}

.delete-btns {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.approve-btn, .reject-btn {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

.approve-btn {
    background-color: green;
    color: white;
}

.reject-btn {
    background-color: red;
    color: white;
}

.contract-details {
    margin-top: 20px;
}

.details-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.details-table th, .details-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
}

.confirm-btn, .cancel-btn {
    padding: 10px;
    margin-top: 10px;
    width: 100%;
    cursor: pointer;
}

.confirm-btn {
    background-color: blue;
    color: white;
    border: none;
}

.cancel-btn {
    background-color: gray;
    color: white;
    border: none;
    margin-top: 5px;
}
</style>