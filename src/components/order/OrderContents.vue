<template>
    <div class="order-content11" v-if="orderData">
        <div class="order-search11">
            <h1 class="maintext">수주 정보 조회 내역</h1>
            <h3 class="maintext2">결재 승인</h3>
            <div class="order-btn">
                <div class="order-btn2" v-if="!['결재요청', '승인', '반려'].includes(approvalStatus)">
                    <button class="order-request" @click="requestApproval">결재 요청</button>
                </div>
                <button class="order-edit" @click="goToOrderPage">수정</button>
                <button class="order-delete" @click="deleteOrder">삭제</button>
                <button class="order-excel" @click="downloadExcel">엑셀 다운</button>
            </div>
            <div class="order-approval-note1" v-if="['승인', '반려'].includes(approvalStatus) && orderData.approvalContent">
                <h3 class="order-approval-note2">결재 비고란</h3>
                <div class="order-approval-note3">{{ orderData.approvalContent }}</div>
            </div>
            <div class="order-pdf77">
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
                        <th>프로젝트 코드</th>
                        <th>계약 일자</th>
                        <th>작성 일자</th>
                        <th>삭제 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.transaction.transactionCode }}</td>
                        <td>{{ orderData.contactDate }}</td>
                        <td>{{ orderData.orderDate }}</td>
                        <td>{{ orderData.orderDeleteDate }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order2-table2">
                <thead>
                    <tr>
                        <th>담당자</th>
                        <th>거래처 코드</th>
                        <th>거래처명</th>
                        <th>수주 금액</th>
                        <th>Billing 잔액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
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
            <table v-if="orderData.contractCategory.contractCategoryId === 1" class="order2-table5">
                <thead>
                    <tr>
                        <th>납부 형태</th>
                        <th>수주 금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>일시납부</td>
                        <td>{{ orderData.orderTotalPrice.toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
            <table v-else class="order2-table6">
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
                        <td>분할납부</td>
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
                        <th>입금 금액</th>
                        <th>입금 일자</th>
                        <th>발행 요청 일자</th>
                        <th>비고</th>
                        <th>승인 여부</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="taxInvoice in taxInvoiceRequestData" :key="taxInvoice.taxInvoiceRequestId">
                        <td>{{ taxInvoice.collection.depositCode }}</td>
                        <td>{{ taxInvoice.collection.depositPic }}</td>
                        <td>{{ taxInvoice.collection.depositPrice.toLocaleString() }}</td>
                        <td>{{ taxInvoice.collection.depositDate }}</td>
                        <td>{{ taxInvoice.taxInvoiceRequestDate }}</td>
                        <td>{{ taxInvoice.taxInvoiceNote }}</td>
                        <td>{{ taxInvoice.taxInvoiceRequestStatus?.taxInvoiceRequestStatus }}</td>
                    </tr>
                    <tr v-if="taxInvoiceRequestData.length === 0">
                        <td colspan="7">세금계산서 요청 내역이 없습니다.</td>
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
        <div class="order22-process-box">
            <h1 class="order22-process-text">Process</h1>
            <div v-for="note in filteredOrderNotes" :key="note.orderNoteId" class="order22-process-box-detail">
                <div class="order22-process-info">
                    <h4 class="order22-process-writer">{{ employeeName }}</h4>
                    <p class="order22-process-date">{{ note.orderNoteDate }}</p>
                </div>
                <button class="order22-process-detail">
                    {{ note.orderNote }}
                </button>
                <div class="order22-process-btn">
                    <button class="order22-process-delete" @click="deleteNote(note.orderNoteId)">삭제하기</button>
                </div>
            </div>
            <div class="order22-process-reply">
                <input type="text" v-model="newNote" id="order22-process-reply-box" class="order22-process-reply-box"
                    placeholder="내용을 입력해주세요.">
                <div class="order22-process-btn2">
                    <button class="order22-process-regist" @click="addNote">등록하기</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        Loading...
    </div>
    <!-- 삭제 요청 팝업 -->
    <div v-if="showPopup" class="popup-overlay77">
        <div class="popup-content77">
            <h2>삭제 요청 사유 입력</h2>
            <textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요"></textarea>
            <button @click="confirmDelete">확인</button>
            <button @click="closePopup">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const orderData = ref(null);
const orderNoteData = ref([]); // 수주 노트 데이터를 저장하는 배열
const showPopup = ref(false);
const deleteReason = ref('');
const newNote = ref('');
const employeeName = ref('');
const employeeId = ref('');
const taxInvoiceRequestData = ref([]); // 세금계산서 요청 데이터를 저장하는 배열
const approvalStatus = ref('Pending'); // Default value as Pending

// filteredOrderNotes는 orderDeleteDate가 null인 노트만 반환합니다.
const filteredOrderNotes = computed(() => {
    return orderNoteData.value.filter(note => note.orderDeleteDate === null);
});

onMounted(async () => {
    const orderRegistrationId = route.params.orderRegistrationId;
    console.log('Order Registration ID:', orderRegistrationId);  // Debugging line

    if (!orderRegistrationId) {
        console.error('Order Registration ID is not defined');
        return;
    }

    const userId = localStorage.getItem('userId'); // userId를 localStorage에서 가져오기

    try {
        // 수주 데이터를 가져오는 API 호출
        const orderResponse = await axios.get(`http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/order/${orderRegistrationId}`);
        orderData.value = orderResponse.data;

        // 수주 노트 데이터를 가져오는 API 호출
        const noteResponse = await axios.get(`http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/order_note/${orderRegistrationId}`);
        orderNoteData.value = noteResponse.data;

        // userId로 직원 이름을 가져오는 API 호출
        const employeeResponse = await axios.get(`http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/employees/${userId}`);
        employeeName.value = employeeResponse.data.employeeName;

        // 세금계산서 요청 데이터를 가져오는 API 호출
        if (orderData.value.taxInvoiceRequest && orderData.value.taxInvoiceRequest.length > 0) {
            for (const taxInvoice of orderData.value.taxInvoiceRequest) {
                const taxInvoiceResponse = await axios.get(`http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/tax_invoice/${taxInvoice.taxInvoiceRequestId}`);
                taxInvoiceRequestData.value.push(taxInvoiceResponse.data);
            }
        }

        // 전체 승인 데이터를 가져오는 API 호출
        const approvalResponse = await axios.get('http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/approval/shipment');
        const approvalData = approvalResponse.data;

        // 현재 수주에 해당하는 결재 상태를 찾기
        const currentApproval = approvalData.find(approval => approval.order.orderRegistrationId === parseInt(orderRegistrationId));
        if (currentApproval) {
            approvalStatus.value = currentApproval.approvalStatus.approvalStatus;
            orderData.value.approvalContent = currentApproval.approvalContent; // 비고란 내용 설정
        }

    } catch (error) {
        console.error('Error fetching order data:', error);
    }
});


// 결재 요청 함수
const requestApproval = async () => {
    const orderRegistrationId = route.params.orderRegistrationId;
    try {
        const response = await axios.post('http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/approval/shipment/regist', {
            order: { orderRegistrationId: orderRegistrationId }
        });
        alert('결재 요청이 성공적으로 완료되었습니다.');
        console.log('Approval request sent successfully:', response.data);
        approvalStatus.value = 'Requested'; // 결재 요청 후 상태를 업데이트
    } catch (error) {
        console.error('Error sending approval request:', error);
        alert('결재 요청 중 오류가 발생했습니다.');
    }
};

// 수주 수정 페이지로 이동하는 함수
const goToOrderPage = () => {
    router.push({ path: `/order/modify/${route.params.orderRegistrationId}` });
};

// 파일 다운로드 함수
const downloadFile = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 엑셀 다운로드 함수
const downloadExcel = () => {
    const orderRegistrationId = route.params.orderRegistrationId;
    const url = `http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/excel/order/${orderRegistrationId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `order_${orderRegistrationId}.xlsx`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 수주 삭제 요청 함수
const deleteOrder = () => {
    showPopup.value = true;
};

// 팝업 닫기 함수
const closePopup = () => {
    showPopup.value = false;
};

// 수주 삭제 확인 함수
const confirmDelete = async () => {
    const orderRegistrationId = route.params.orderRegistrationId;
    try {
        const response = await axios.post('http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/order/delete', {
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

// 노트 추가 함수
const addNote = async () => {
    const orderRegistrationId = route.params.orderRegistrationId;
    const userId = localStorage.getItem('userId'); // userId를 localStorage에서 가져오기
    try {
        const response = await axios.post('http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/order_note/regist', {
            orderNote: newNote.value,
            order: { orderRegistrationId: orderRegistrationId },
            employee: { employeeId: userId } // employeeId를 userId로 설정
        });
        alert('process 등록되었습니다.');
        console.log('order note added successfully:', response.data);
        orderNoteData.value.push(response.data);
        newNote.value = '';
        location.reload(); // 페이지 새로고침 추가
    } catch (error) {
        console.error('Error adding order note:', error);
        alert('노트 추가 중 오류가 발생했습니다.');
    }
};

// 노트 삭제 함수
const deleteNote = async (orderNoteId) => {
    try {
        const response = await axios.patch('http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/order_note/delete', null, {
            params: {
                orderNoteId
            }
        });
        const updatedNote = response.data;
        const noteIndex = orderNoteData.value.findIndex(note => note.orderNoteId === orderNoteId);
        alert('process 삭제되었습니다.');
        if (noteIndex !== -1) {
            orderNoteData.value[noteIndex] = updatedNote;
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('노트 삭제 중 오류가 발생했습니다.');
    }
};
</script>



<style>
.order-content11 {
    /* margin-top: 8%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: calc(100% - 220px);
    /* main1의 너비를 뺀 나머지 공간 */
}

.order-search11 {
    text-align: center;
    /* margin-top: 3%; */
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

.order-pdf77 {
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
    width: 420px;
    height: 150px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    gap: 20px;
    margin-top: 40px;
    margin-left: 9px;
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
.order2-table4 th,
.order2-table4 td,
.order2-table5 th,
.order2-table5 td,
.order2-table6 th,
.order2-table6 td,
.order2-table7 th,
.order2-table7 td,
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
.order2-table5 th,
.order2-table6 th,
.order2-table7 th,
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
.order2-table3 td,
.order2-table4 td,
.order2-table5 td,
.order2-table6 td,
.order2-table7 td,
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

.order22-process-box {
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
    width: 100%;
    max-width: 1100px;
    min-width: 100px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    margin-top: 60px;
    height: auto;
    flex-direction: column;
    margin-bottom: 7%;
}

.order22-process-text {
    color: #0C2092;
}

.order22-process-box-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-left: 8px;
}

.order22-process-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.order22-process-writer {
    margin: 0;
    margin-left: 30px;
    margin-bottom: -13px;
}

.order22-process-detail {
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
    width: 94%;
    height: auto;
    margin-right: 5px;
    margin-top: -10px;
    font-weight: normal;
}

.order22-process-date {
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
    margin-right: 34px;
}

.order22-process-btn,
.order22-process-btn2 {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 7px;
}

.order22-process-regist,
.order22-process-delete {
    background-color: #0C2092;
    border: 2px solid #0C2092;
    color: white;
    border-radius: 10px;
    padding: 5px 7px;
    margin-top: 10px;
    cursor: pointer;
}

.order22-process-regist {
    margin-top: 5px;
    margin-left: 5px;
}

.order22-process-reply {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 10px;
    margin-top: 10px;
}

.order22-process-reply-box {
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 10px;
    font-size: 15px;
    outline: none;
    color: black;
    width: 91%;
    height: auto;
    font-weight: normal;
}

.popup-overlay77 {
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

.popup-content77 {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    max-width: 400px;
    width: 100%;
}

.popup-content77 h2 {
    margin-bottom: 15px;
}

.popup-content77 textarea {
    width: 90%;
    height: 100px;
    margin-bottom: 15px;
}

.popup-content77 button {
    margin: 5px;
}
</style>
