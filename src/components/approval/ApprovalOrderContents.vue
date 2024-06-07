<template>
    <div class="regist-content7" v-if="approveShipmentData">
        <div class="order-search">
            <h1 class="maintext">수주 결재 요청 내역</h1>

            <div class="shipment-btn" v-if="approveShipmentData.approvalStatus.approvalStatusId === 1">
                <button class="shipment-approve" @click="openApprovalPopup">결재 승인</button>
                <button class="shipment-reject" @click="openRejectPopup">결재 반려</button>
            </div>

            <div class="order-approval-note1" v-if="approveShipmentData.approvalContent">
                <h3 class="order-approval-note2">결재 비고란</h3>
                <div class="order-approval-note3">{{ approveShipmentData.approvalContent }}</div>
            </div>

            <div class="order-approval-attachment">
                <div v-if="approveShipmentData.order.orderFile && approveShipmentData.order.orderFile.length > 0">
                    <div v-for="file in approveShipmentData.order.orderFile" :key="file.fileId" class="file-download">
                        <button class="order-approval-attachment1" @click="downloadFile(file.accessUrl)">
                            {{ file.originName }} 다운로드
                        </button>
                    </div>
                </div>
                <div v-else class="file-download no-file">
                    첨부파일 없음
                </div>
            </div>
        </div>
        <div class="shipment-list-box">
            <table class="shipment2-table1">
                <thead>
                    <tr>
                        <th>수주서 코드</th>
                        <th>수주 금액</th>
                        <th>작성 일자</th>
                        <th>삭제 일자</th>
                        <th>마감 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ approveShipmentData.order.transaction.transactionCode }}</td>
                        <td>{{ approveShipmentData.order.orderTotalPrice.toLocaleString() }}</td>
                        <td>{{ approveShipmentData.order.orderDate }}</td>
                        <td>{{ approveShipmentData.order.orderDeleteDate }}</td>
                        <td>{{ approveShipmentData.order.orderDueDate }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="shipment2-table2">
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
                    <tr v-for="product in approveShipmentData.order.orderProduct" :key="product.orderProductId">
                        <td>{{ product.product.productCode }}</td>
                        <td>{{ product.product.productName }}</td>
                        <td>{{ product.orderProductCount }}</td>
                        <td>{{ product.product.productPrice.toLocaleString() }}</td>
                        <td>{{ product.orderSupplyPrice.toLocaleString() }}</td>
                        <td>{{ product.orderProductionNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="shipment2-table3">
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
                        <td>{{ approveShipmentData.order.warehouse.warehouseCode }}</td>
                        <td>{{ approveShipmentData.order.warehouse.warehouseName }}</td>
                        <td>{{ approveShipmentData.order.warehouse.warehouseType }}</td>
                        <td>{{ approveShipmentData.order.warehouse.warehouseLocation }}</td>
                        <td>{{ approveShipmentData.order.warehouse.warehouseUsage }}</td>
                        <td>{{ approveShipmentData.order.warehouse.productionLineName }}</td>
                        <td>{{ approveShipmentData.order.warehouse.outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="shipment2-table4">
                <thead>
                    <tr>
                        <th>담당자</th>
                        <th>거래처명</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ approveShipmentData.order.employee.employeeName }}</td>
                        <td>{{ approveShipmentData.order.account.accountName }}</td>
                        <td>{{ approveShipmentData.order.orderNote }}</td>
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
const approveShipmentData = ref(null);
const showApprovalPopup = ref(false);
const showRejectPopup = ref(false);
const approvalContent = ref('');
const rejectContent = ref('');
const actionCompleted = ref(false);

const fetchApproveShipmentData = async () => {
    const orderRegistrationId = route.params.orderRegistrationId;
    if (!orderRegistrationId) {
        console.error("Order Registration ID is undefined");
        return;
    }
    try {
        const response = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/approval/shipment/${orderRegistrationId}`);
        approveShipmentData.value = response.data;
    } catch (error) {
        console.error("Error fetching approval shipment data:", error);
    }
};

onMounted(fetchApproveShipmentData);

const downloadFile = (url) => {
    window.open(url, '_blank');
};

const openApprovalPopup = () => {
    approvalContent.value = '수주 승인';
    showApprovalPopup.value = true;
};

const closeApprovalPopup = () => {
    showApprovalPopup.value = false;
};

const submitApproval = async () => {
    const payload = {
        shipmentApprovalId: approveShipmentData.value.shipmentApprovalId,
        approvalContent: approvalContent.value,
        approvalStatus: {
            approvalStatusId: 2
        }
    };
    try {
        await axios.patch(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/approval/shipment/process`, payload);
        actionCompleted.value = true;
        showApprovalPopup.value = false;
        fetchApproveShipmentData();
    } catch (error) {
        console.error("Error submitting approval:", error);
    }
};

const openRejectPopup = () => {
    rejectContent.value = '수주 반려';
    showRejectPopup.value = true;
};

const closeRejectPopup = () => {
    showRejectPopup.value = false;
};

const submitRejection = async () => {
    const payload = {
        shipmentApprovalId: approveShipmentData.value.shipmentApprovalId,
        approvalContent: rejectContent.value,
        approvalStatus: {
            approvalStatusId: 3
        }
    };
    try {
        await axios.patch(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/approval/shipment/process`, payload);
        actionCompleted.value = true;
        showRejectPopup.value = false;
        fetchApproveShipmentData();
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

.order-approval-attachment {
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
    height: auto;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    margin-top: 40px;
}

.file-download {
    margin-bottom: 10px;
    margin-top: 10px;
}

.order-approval-attachment1 {
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


.order-approval-attachment1:hover {
    background-color: #d5e6ff;
}

.shipment-list-box {
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

.shipment2-table1,
.shipment2-table2,
.shipment2-table3,
.shipment2-table4 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.shipment2-table1 th,
.shipment2-table1 td,
.shipment2-table2 th,
.shipment2-table2 td,
.shipment2-table3 th,
.shipment2-table3 td,
.shipment2-table4 th,
.shipment2-table4 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 160px;
}

.shipment2-table1 th,
.shipment2-table2 th,
.shipment2-table3 th,
.shipment2-table4 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.shipment2-table1 td,
.shipment2-table2 td,
.shipment2-table3 td,
.shipment2-table4 td {
    height: 40px;
}

.test {
    background-color: #d5e6ff;
}

.shipment-contents-test1 {
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

.shipment-btn .shipment-approve {
    background-color: #007BFF; /* Blue */
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    margin: 15px;
    font-size: 16px;
}

.shipment-btn .shipment-reject {
    background-color: #DC3545; /* Red */
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    margin: 15px;
    font-size: 16px;
}

.shipment-btn .shipment-approve:hover {
    background-color: #0056b3; /* Darker Blue */
}

.shipment-btn .shipment-reject:hover {
    background-color: #c82333; /* Darker Red */
}

.order-approval-note1 {
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

.order-approval-note3 {
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
