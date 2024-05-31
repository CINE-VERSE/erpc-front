<template>
    <div class="order-content" v-if="orderData">
        <div class="order-search">
            <h1 class="maintext">수주 정보 조회 내역</h1>
            <h3 class="maintext2">결재 승인</h3>
            <div class="order-btn">
                <button class="order-request">결재 요청</button>
                <button class="order-edit" @click="goToOrderPage">수정</button>
                <button class="order-delete" @click="deleteOrder">삭제</button>
                <button class="order-excel" @click="downloadExcel">엑셀 다운</button> <!-- 엑셀 다운 버튼 추가 -->
            </div>
            <div class="order-pdf">
                <div v-if="orderData.orderFile.length > 0">
                    <div v-for="file in orderData.orderFile" :key="file.fileId" class="file-download">
                        <button class="order-pdf2" @click="downloadFile(file.accessUrl)">
                            {{ file.originName }} 다운로드
                        </button>
                    </div>
                </div>
                <div v-else class="file-download no-file">
                    첨부파일 없음
                </div>
            </div>
        </div>
        <div class="order-list-box2">
            <table class="order2-table1">
                <thead>
                    <tr>
                        <th>작성 일자</th>
                        <th>삭제 일자</th>
                        <th>결재 일자</th>
                        <th>계약 일자</th>
                        <th>입금 완료일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.orderDate }}</td>
                        <td>{{ orderData.orderDeleteDate }}</td>
                        <td></td>
                        <td>{{ orderData.contactDate }}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table class="order2-table2">
                <thead>
                    <tr>
                        <th>프로젝트 코드</th>
                        <th>담당자</th>
                        <th>거래처 코드</th>
                        <th>거래처명</th>
                        <th>수주 금액</th>
                        <th>Billing 잔액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.transaction.transactionCode }}</td>
                        <td>{{ orderData.employee.employeeName }}</td>
                        <td>{{ orderData.account.accountCode }}</td>
                        <td>{{ orderData.account.accountName }}</td>
                        <td>{{ orderData.orderTotalPrice.toLocaleString() }}</td>
                        <td>{{ orderData.totalBalance.toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order2-table3">
                <thead>
                    <tr>
                        <th>품목 코드</th>
                        <th>품목 이름</th>
                        <th>수량</th>
                        <th>단가</th>
                        <th>합계</th>
                        <th>기타</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in orderData.orderProduct" :key="product.product.productId">
                        <td>{{ product.product.productCode }}</td>
                        <td>{{ product.product.productName }}</td>
                        <td>{{ product.orderProductCount }}</td>
                        <td>{{ product.product.productPrice.toLocaleString() }}</td>
                        <td>{{ product.orderSupplyPrice.toLocaleString() }}</td>
                        <td>{{ product.orderProductionNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order2-table4">
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
                        <td>{{ orderData.warehouse.warehouseCode }}</td>
                        <td>{{ orderData.warehouse.warehouseName }}</td>
                        <td>{{ orderData.warehouse.warehouseType }}</td>
                        <td>{{ orderData.warehouse.warehouseLocation }}</td>
                        <td>{{ orderData.warehouse.warehouseUsage }}</td>
                        <td>{{ orderData.warehouse.productionLineName }}</td>
                        <td>{{ orderData.warehouse.outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order2-table5">
                <thead>
                    <tr>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.orderNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order2-table6">
                <thead>
                    <tr>
                        <th>납부 형태</th>
                        <th>계약금</th>
                        <th>중도금(선금)</th>
                        <th>잔금</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="test">{{ orderData.contractCategory.contractCategory }}</td>
                        <td>{{ orderData.downPayment.toLocaleString() }}</td>
                        <td>{{ orderData.progressPayment.toLocaleString() }}</td>
                        <td>{{ orderData.balance.toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order2-table7">
                <thead>
                    <tr>
                        <th>입금 코드</th>
                        <th>입금자명</th>
                        <th>세금계산서 발행 금액</th>
                        <th>입금 일자</th>
                        <th>발행 요청 일자</th>
                        <th>비고</th>
                        <th>승인 여부</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="taxInvoiceRequestData">
                        <td>{{ taxInvoiceRequestData.collection.depositCode }}</td>
                        <td>{{ taxInvoiceRequestData.collection.depositPic }}</td>
                        <td>{{ taxInvoiceRequestData.collection.depositPrice.toLocaleString() }}</td>
                        <td>{{ taxInvoiceRequestData.collection.depositDate }}</td>
                        <td>{{ taxInvoiceRequestData.taxInvoiceRequestDate }}</td>
                        <td>{{ taxInvoiceRequestData.taxInvoiceNote }}</td>
                        <td>{{ taxInvoiceRequestData.taxInvoiceRequestStatus.taxInvoiceRequestStatus }}</td>
                    </tr>
                    <tr v-else>
                        <td colspan="8"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="shipment-search">
            <h1 class="maintext3">출하 정보</h1>
            <h3 class="maintext4">출하 처리</h3>
        </div>
        <div class="shipment-list-box">
            <table class="shipment-table1">
                <thead>
                    <tr>
                        <th>출고 예정일</th>
                        <th>실사 출고일</th>
                        <th>수령 예정일</th>
                        <th>수령 확정일</th>
                        <th>수주 완료일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.estimatedDeliveryDate }}</td>
                        <td>{{ orderData.estimatedReleaseDate }}</td>
                        <td>{{ orderData.estimatedArriveDate }}</td>
                        <td>{{ orderData.arriveDate }}</td>
                        <td>{{ orderData.releaseDate }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="order-process-box">
            <h1 class="order-process-text">Process</h1>
            <div class="order-process-box-detail">
                <div class="order-process-info">
                    <h4 class="order-process-writer">{{ orderData.employee.employeeName }} {{
                        orderData.employee.employeeRank.employeeRank }}</h4>
                    <p class="order-process-date">{{ orderData.orderDate }}</p>
                </div>
                <button class="order-process-detail">
                    프로젝트 진행 정보 공유합니다~
                </button>
                <div class="order-process-btn">
                    <button class="order-process-edit">수정</button>
                    <button class="order-process-delete">삭제</button>
                </div>
                <div class="order-process-reply">
                    <input type="text" id="order-process-reply-box" class="order-process-reply-box"
                        placeholder="내용을 입력해주세요.">
                    <button class="order-process-regist">등록하기</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        Loading...
    </div>
    <div v-if="showPopup" class="popup-overlay">
        <div class="popup-content">
            <h2>삭제 요청 사유 입력</h2>
            <textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요"></textarea>
            <button @click="confirmDelete">확인</button>
            <button @click="closePopup">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const orderId = route.params.orderId;
const orderData = ref(null);
const showPopup = ref(false);
const taxInvoiceRequestData = ref(null);
const deleteReason = ref('');

onMounted(async () => {
    try {
        if (orderId) {
            const response = await axios.get(`http://localhost:7775/order/${orderId}`);
            orderData.value = response.data;

            if (orderData.value.taxInvoiceRequest && orderData.value.taxInvoiceRequest.length > 0) {
                const taxInvoiceRequestId = orderData.value.taxInvoiceRequest[0].taxInvoiceRequestId;
                const taxInvoiceResponse = await axios.get(`http://localhost:7775/tax_invoice/${taxInvoiceRequestId}`);
                taxInvoiceRequestData.value = taxInvoiceResponse.data;
            }
        } else {
            console.error('Order ID is undefined');
        }
    } catch (error) {
        console.error('Error fetching order data:', error);
    }
});

const goToOrderPage = () => {
    router.push({ path: `/order/modify/${route.params.orderId}` });
};

const downloadFile = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadExcel = () => {
    const orderRegistrationId = route.params.orderId;
    const url = `http://localhost:7775/excel/order/${orderRegistrationId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `order_${orderRegistrationId}.xlsx`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const deleteOrder = () => {
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
};

const confirmDelete = async () => {
    const orderId = route.params.orderId;
    try {
        const response = await axios.post('http://localhost:7775/order/delete', {
            orderDeleteRequestReason: deleteReason.value,
            order: orderData.value
        });
        console.log('Order delete request sent successfully:', response.data);
        alert('삭제 요청이 성공적으로 완료되었습니다.');
        router.push('/order');
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    } finally {
        closePopup();
    }
};
</script>

<style>
.order-content {
    margin-top: 4%;
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

.order-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;
}

.pdfimage {
    width: 50px;
    height: auto;
    cursor: pointer;
}

.order-edit,
.order-delete,
.order-request,
.order-excel {
    width: 80px;
    height: 40px;
    cursor: pointer;
    margin-left: 15px;
    margin-right: 15px;
}

.order-pdf {
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
    width: 500px;
    height: 150px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    gap: 20px;
    margin-top: 40px;
}

.order-pdf1,
.order-pdf2 {
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
    width: 270px;
}

.order-pdf1:hover,
.order-pdf2:hover {
    background-color: #d5e6ff;
}

.pdfimage1,
.pdfimage2 {
    width: 30px;
    height: auto;
    margin-left: 5px;
    margin-right: -10px;
}

.order-list-box2,
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

.order2-table1,
.order2-table2,
.order2-table3,
.order2-table4,
.order2-table5,
.order2-table6,
.order2-table7,
.shipment-table1,
.shipment-table2 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.order2-table1 th,
.order2-table1 td,
.order2-table2 th,
.order2-table2 td,
.order2-table3 th,
.order2-table3 td,
order2-table4 th,
order2-table4 td,
order2-table5 th,
order2-table5 td,
order2-table6 th,
order2-table6 td,
order2-table7 th,
order2-table7 td,
.shipment-table1 th,
.shipment-table1 td,
.shipment-table2 th,
.shipment-table2 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.order2-table1 th,
.order2-table2 th,
.order2-table3 th,
.order2-table4 th,
order2-table5 th,
order2-table6 th,
order2-table7 th,
.shipment-table1 th,
.shipment-table2 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.order2-table1 td,
.order2-table2 td,
order2-table3 td,
order2-table4 td,
order2-table5 td,
order2-table6 td,
order2-table7 td,
.shipment-table1 td,
.shipment-table2 td {
    height: 40px;
}

.test {
    background-color: #d5e6ff;
}

.shipment-table1 th,
.shipment-table1 td {
    background-color: #D3F9E0;
}

.shipment-table2 {
    margin-bottom: 7%;
}

.order-process-box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-grow: 1;
    padding: 10px;
    background-color: #CCEAFF;
    border: 2px solid #CCEAFF;
    border-radius: 10px;
    box-sizing: border-box;
    width: 1200px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    margin-top: 30px;
    height: auto;
    flex-direction: column;
    margin-bottom: 7%;
}

.order-process-text {
    margin-bottom: 20px;
    color: #0C2092;
}

.order-process-box-detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
}

.order-process-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.order-process-writer {
    margin: 0;
    margin-left: 45px;
}

.order-process-detail {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 10px;
    font-size: 15px;
    outline: none;
    color: black;
    font-weight: bold;
    width: 93%;
    height: auto;
    margin-left: 40px;
    margin-top: -10px;
    font-weight: normal;
}

.order-process-date {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F6E5FF;
    border: 2px solid #F6E5FF;
    border-radius: 10px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: normal;
    color: black;
    margin-right: 45px;
}

.order-process-btn {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 7px;
}

.order-process-edit,
.order-process-delete {
    background-color: #0C2092;
    border: 2px solid #0C2092;
    color: white;
    border-radius: 10px;
    padding: 5px 7px;
    margin-top: 4px;
    cursor: pointer;
}

.order-process-delete {
    margin-right: 46px;
}

.order-process-reply {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.order-process-reply-box {
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 10px;
    font-size: 15px;
    outline: none;
    color: black;
    width: 90.5%;
    height: auto;
    font-weight: normal;
}

.order-process-regist {
    background-color: #0C2092;
    border: 2px solid #0C2092;
    width: 95px;
    color: white;
    border-radius: 10px;
    padding: 5px 7px;
    margin-left: 992px;
    cursor: pointer;
    margin-bottom: 7px;
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
}
</style>
