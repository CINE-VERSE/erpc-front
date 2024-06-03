<template>
    <div class="regist-content7" v-if="approveContractData">
        <div class="order-search">
            <h1 class="maintext">계약서 결재 요청 내역</h1>

            <div class="contract-btn" v-if="approveContractData.approvalStatus.approvalStatusId === 1">
                <button class="contract-approve" @click="openApprovalPopup">결재 승인</button>
                <button class="contract-reject" @click="openRejectPopup">결재 반려</button>
            </div>

            <div class="contract-approval-note1">
                <h3 class="contract-approval-note2">결재 비고란</h3>
                <div class="contract-approval-note3">{{ approveContractData.approvalContent }}</div>
            </div>

            <div class="contract-approval-attachment">
                <div v-if="approveContractData.contract.contractFile && approveContractData.contract.contractFile.length > 0">
                    <div v-for="file in approveContractData.contract.contractFile" :key="file.fileId" class="file-download">
                        <button class="contract-approval-attachment1" @click="downloadFile(file.accessUrl)">
                            {{ file.originName }} 다운로드
                        </button>
                    </div>
                </div>
                <div v-else class="file-download no-file">
                    첨부파일 없음
                </div>
            </div>
        </div>
        <div class="contract-list-box">
            <table class="contract2-table1">
                <thead>
                    <tr>
                        <th>계약서 코드</th>
                        <th>계약 금액</th>
                        <th>작성 일자</th>
                        <th>삭제 일자</th>
                        <th>마감 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ approveContractData.contract.contractCode }}</td>
                        <td>{{ approveContractData.contract.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ approveContractData.contract.contractDate }}</td>
                        <td>{{ approveContractData.contract.contractDeleteDate }}</td>
                        <td>{{ approveContractData.contract.contractDueDate }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract2-table2">
                <thead>
                    <tr>
                        <th>품목 코드</th>
                        <th>품목 이름</th>
                        <th>수량</th>
                        <th>단가</th>
                        <th>공급가액</th>
                        <th>기타</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in approveContractData.contract.contractProduct" :key="product.contractProductId">
                        <td>{{ product.product.productCode }}</td>
                        <td>{{ product.product.productName }}</td>
                        <td>{{ product.contractProductCount }}</td>
                        <td>{{ product.product.productPrice.toLocaleString() }}</td>
                        <td>{{ product.contractSupplyPrice.toLocaleString() }}</td>
                        <td>{{ product.contractProductionNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract2-table3">
                <thead>
                    <tr>
                        <th>창고 코드</th>
                        <th>창고명</th>
                        <th>구분</th>
                        <th>창고 주소</th>
                        <th>사용 여부</th>
                        <th>생산 공정명</th>
                        <th>외주 거래처명</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ approveContractData.contract.warehouse.warehouseCode }}</td>
                        <td>{{ approveContractData.contract.warehouse.warehouseName }}</td>
                        <td>{{ approveContractData.contract.warehouse.warehouseType }}</td>
                        <td>{{ approveContractData.contract.warehouse.warehouseLocation }}</td>
                        <td>{{ approveContractData.contract.warehouse.warehouseUsage }}</td>
                        <td>{{ approveContractData.contract.warehouse.productionLineName }}</td>
                        <td>{{ approveContractData.contract.warehouse.outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract2-table4">
                <thead>
                    <tr>
                        <th>담당자</th>
                        <th>거래처명</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ approveContractData.contract.employee.employeeName }}</td>
                        <td>{{ approveContractData.contract.account.accountName }}</td>
                        <td>{{ approveContractData.contract.contractNote }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Approval Popup -->
        <div v-if="showApprovalPopup" class="popup-overlay">
            <div class="popup-content">
                <h2>결재 승인</h2>
                <textarea v-model="approvalContent" placeholder="승인 내용을 입력하세요"></textarea>
                <button class="confirm-btn" @click="submitApproval">확인</button>
                <button class="cancel-btn" @click="closeApprovalPopup">취소</button>
            </div>
        </div>

        <!-- Reject Popup -->
        <div v-if="showRejectPopup" class="popup-overlay">
            <div class="popup-content">
                <h2>결재 반려</h2>
                <textarea v-model="rejectContent" placeholder="반려 사유를 입력하세요"></textarea>
                <button class="confirm-btn" @click="submitRejection">확인</button>
                <button class="cancel-btn" @click="closeRejectPopup">취소</button>
            </div>
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

const route = useRoute();
const approveContractData = ref(null);
const showApprovalPopup = ref(false);
const showRejectPopup = ref(false);
const approvalContent = ref('');
const rejectContent = ref('');
const actionCompleted = ref(false);

const fetchApproveContractData = async () => {
    const contractId = route.params.contractId;
    try {
        const response = await axios.get(`http://localhost:7775/approval/contract/${contractId}`);
        approveContractData.value = response.data;
    } catch (error) {
        console.error("Error fetching approval contract data:", error);
    }
};

onMounted(fetchApproveContractData);

const downloadFile = (url) => {
    window.open(url, '_blank');
};

const openApprovalPopup = () => {
    approvalContent.value = '계약 승인';
    showApprovalPopup.value = true;
};

const closeApprovalPopup = () => {
    showApprovalPopup.value = false;
};

const submitApproval = async () => {
    const payload = {
        contractApprovalId: approveContractData.value.contractApprovalId,
        approvalContent: approvalContent.value,
        approvalStatus: {
            approvalStatusId: 2
        }
    };
    try {
        await axios.patch(`http://localhost:7775/approval/contract/process`, payload);
        actionCompleted.value = true;
        showApprovalPopup.value = false;
        fetchApproveContractData();
    } catch (error) {
        console.error("Error submitting approval:", error);
    }
};

const openRejectPopup = () => {
    rejectContent.value = '계약 반려';
    showRejectPopup.value = true;
};

const closeRejectPopup = () => {
    showRejectPopup.value = false;
};

const submitRejection = async () => {
    const payload = {
        contractApprovalId: approveContractData.value.contractApprovalId,
        approvalContent: rejectContent.value,
        approvalStatus: {
            approvalStatusId: 3
        }
    };
    try {
        await axios.patch(`http://localhost:7775/approval/contract/process`, payload);
        actionCompleted.value = true;
        showRejectPopup.value = false;
        fetchApproveContractData();
    } catch (error) {
        console.error("Error submitting rejection:", error);
    }
};
</script>


<style>
.regist-content7 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.order-search {
    text-align: center;
    margin-top: 3%;
}

.maintext,
.maintext2,
.maintext3,
.maintext4 {
    display: flex;
    align-items: center;
    justify-content: center;
}

.maintext2,
.maintext4 {
    color: #0C2092;
}

.contract-approval-attachment {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-grow: 1;
    padding: 10px;
    background-color: #BEE7FF;
    border: 2px solid #BEE7FF;
    border-radius: 10px;
    box-sizing: border-box;
    width: 430px;
    height: 200px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    margin-top: 40px;
}

.file-download {
    margin-bottom: 10px;
    margin-top: 10px;
}

.contract-approval-attachment1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 6px 30px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    color: black;
    font-weight: bold;
    width: 320px;
}


.contract-approval-attachment1 {
    background-color: #d5e6ff;
}

.contract-list-box {
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
    max-width: 1200px;
    margin: 20px auto;
    margin-bottom: 20px;
    gap: 1px;
}

.contract2-table1,
.contract2-table2,
.contract2-table3,
.contract2-table4 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.contract2-table1 th,
.contract2-table1 td,
.contract2-table2 th,
.contract2-table2 td,
.contract2-table3 th,
.contract2-table3 td,
.contract2-table4 th,
.contract2-table4 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 160px;
}

.contract2-table1 th,
.contract2-table2 th,
.contract2-table3 th,
.contract2-table4 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.contract2-table1 td,
.contract2-table2 td,
.contract2-table3 td,
.contract2-table4 td {
    height: 40px;
}

.test {
    background-color: #d5e6ff;
}

.contract-contents-test1 {
    width: 500px;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    max-width: 400px;
    width: 100%;
}

.popup-content h2 {
    margin-bottom: 15px;
}

.popup-content textarea {
    width: 90%;
    height: 100px;
    margin-bottom: 15px;
}

.popup-content button {
    margin: 5px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    color: white;
    cursor: pointer;
}

.confirm-btn {
    background-color: #007BFF; /* Blue */
}

.cancel-btn {
    background-color: #DC3545; /* Red */
}

.contract-btn .contract-approve {
    background-color: #007BFF; /* Blue */
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    margin: 15px;
    font-size: 16px;
}

.contract-btn .contract-reject {
    background-color: #DC3545; /* Red */
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    margin: 15px;
    font-size: 16px;
}

.contract-btn .contract-approve:hover {
    background-color: #0056b3; /* Darker Blue */
}

.contract-btn .contract-reject:hover {
    background-color: #c82333; /* Darker Red */
}

.contract-approval-note1 {
    width: 100%;
    height: 100%;
    max-height: 200px;
    color: black;
    background-color: #F6E5FF;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.contract-approval-note3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 16px;
    outline: none;
    color: black;
    font-weight: bold;
    width: 300px;
    margin-bottom: 25px;
}
</style>
