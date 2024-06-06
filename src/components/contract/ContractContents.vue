<template>
    <div class="contract-content11" v-if="contractData">
        <div class="contract-search">
            <h1 class="maintext">계약서 정보 조회 내역</h1>
            <div class="contract-btn">
                <div class="contract-btn2" v-if="!['결재요청', '승인', '반려'].includes(approvalStatus)">
                    <button class="contract-request" @click="handleApprovalRequest" :disabled="deleteRequested">결재 요청</button>
                </div>
                <button class="contract-edit" @click="handleEditContract" :disabled="deleteRequested">수정</button>
                <button class="contract-delete" v-if="!deleteRequested" @click="deleteContract">삭제</button>
                <button class="contract-excel" @click="downloadExcel">엑셀 다운</button>
            </div>
            <div class="contract-approval-note1" v-if="['승인', '반려'].includes(approvalStatus) && contractData.approvalContent">
                <h3 class="contract-approval-note2">결재 비고란</h3>
                <div class="contract-approval-note3">{{ contractData.approvalContent }}</div>
            </div>
            <div class="contract-pdf">
                <div v-if="contractData.contractFile.length > 0">
                    <div v-for="file in contractData.contractFile" :key="file.fileId" class="file-download">
                        <button class="contract-pdf2" @click="downloadFile(file.accessUrl)">
                            {{ file.originName }} 다운로드
                        </button>
                    </div>
                </div>
                <div v-else class="file-download no-file">
                    첨부파일 없음
                </div>
            </div>
        </div>
        <div class="contract-list-box2">
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
                        <td>{{ contractData.contractCode }}</td>
                        <td>{{ contractData.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ contractData.contractDate }}</td>
                        <td>{{ contractData.contractDeleteDate }}</td>
                        <td>{{ contractData.contractDueDate }}</td>
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
                    <tr v-for="product in contractData.contractProduct" :key="product.contractProductId">
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
                        <td>{{ contractData.warehouse.warehouseCode }}</td>
                        <td>{{ contractData.warehouse.warehouseName }}</td>
                        <td>{{ contractData.warehouse.warehouseType }}</td>
                        <td>{{ contractData.warehouse.warehouseLocation }}</td>
                        <td>{{ contractData.warehouse.warehouseUsage }}</td>
                        <td>{{ contractData.warehouse.productionLineName }}</td>
                        <td>{{ contractData.warehouse.outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract2-table4">
                <thead>
                    <tr>
                        <th>담당자</th>
                        <th>거래처</th>
                        <th>수주 금액</th>
                        <th>납기 일자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ contractData.employee.employeeName }}</td>
                        <td>{{ contractData.account.accountName }}</td>
                        <td>{{ contractData.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ contractData.contractDueDate }}</td>
                        <td>{{ contractData.contractNote }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="contractData.contractCategory.contractCategoryId === 1">
                <table class="contract2-table5">
                    <thead>
                        <tr>
                            <th>납부 형태</th>
                            <th>일시납부 금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>일시납부</td>
                            <td>{{ contractData.contractTotalPrice.toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <table class="contract2-table6">
                    <thead>
                        <tr>
                            <th>납부 형태</th>
                            <th>계약금</th>
                            <th>중도금</th>
                            <th>잔금</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>분할납부</td>
                            <td>{{ contractData.downPayment.toLocaleString() }}</td>
                            <td>{{ contractData.progressPayment.toLocaleString() }}</td>
                            <td>{{ contractData.balance.toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
    <!-- 삭제 요청 팝업 -->
    <div v-if="showPopup" class="popup-overlay">
        <div class="popup-content">
            <h2>삭제 요청 사유 입력</h2>
            <textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요"></textarea>
            <button @click="confirmDelete"  class="confirm-btn">확인</button>
            <button @click="closePopup"  class="cancel-btn">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const contractData = ref(null);
const showPopup = ref(false);
const deleteReason = ref('');
const employeeName = ref('');
const approvalStatus = ref('Pending'); // Default value as Pending
const deleteRequested = ref(false); // 삭제 요청 상태를 저장

// 컴포넌트가 마운트될 때 실행되는 코드
onMounted(async () => {
    const contractId = route.params.contractId;
    const userId = localStorage.getItem('userId'); // userId를 localStorage에서 가져오기

    try {
        // 계약서 데이터를 가져오는 API 호출
        const contractResponse = await axios.get(`http://localhost:7775/contract/${contractId}`);
        contractData.value = contractResponse.data;

        // userId로 직원 이름을 가져오는 API 호출
        const employeeResponse = await axios.get(`http://localhost:7775/employees/${userId}`);
        employeeName.value = employeeResponse.data.employeeName;

        // 전체 승인 데이터를 가져오는 API 호출
        const approvalResponse = await axios.get('http://localhost:7775/approval/contract');
        const approvalData = approvalResponse.data;

        if (approvalData && Array.isArray(approvalData)) {
            // 현재 계약서에 해당하는 결재 상태를 찾기
            const currentApproval = approvalData.find(approval => approval.contract && approval.contract.contractId === parseInt(contractId));
            if (currentApproval) {
                approvalStatus.value = currentApproval.approvalStatus.approvalStatus;
                contractData.value.approvalContent = currentApproval.approvalContent; // 비고란 내용 설정
            }
        }

        // 전체 삭제 요청 데이터를 가져오는 API 호출
        const deleteResponse = await axios.get('http://localhost:7775/delete/contract');
        const deleteData = deleteResponse.data;

        if (deleteData && Array.isArray(deleteData)) {
            // 현재 계약서에 해당하는 삭제 요청 상태를 찾기
            const currentDeleteRequest = deleteData.find(deleteRequest => deleteRequest.contract && deleteRequest.contract.contractId === parseInt(contractId));
            if (currentDeleteRequest) {
                deleteRequested.value = true; // 삭제 요청 상태를 true로 설정
            }
        }

    } catch (error) {
        console.error('Error fetching contract data:', error);
    }
});

// 결재 요청 함수
const handleApprovalRequest = () => {
    if (deleteRequested.value) {
        alert('삭제 요청한 계약서는 결재 요청할 수 없습니다.');
    } else {
        requestApproval();
    }
};

// 계약서 수정 함수
const handleEditContract = () => {
    if (deleteRequested.value) {
        alert('삭제 요청한 계약서는 수정할 수 없습니다.');
    } else {
        goToEditPage();
    }
};

// 결재 요청 함수
const requestApproval = async () => {
    const contractId = route.params.contractId;
    try {
        const response = await axios.post('http://localhost:7775/approval/contract/regist', {
            contract: { contractId: contractId }
        });
        alert('결재 요청이 성공적으로 완료되었습니다.');
        console.log('Approval request sent successfully:', response.data);
        approvalStatus.value = 'Requested'; // 결재 요청 후 상태를 업데이트
        location.reload();
    } catch (error) {
        console.error('Error sending approval request:', error);
        alert('결재 요청 중 오류가 발생했습니다.');
    }
};

// 계약서 수정 페이지로 이동하는 함수
const goToEditPage = () => {
    router.push({ path: `/contract/modify/${route.params.contractId}` });
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
    const contractId = route.params.contractId;
    const url = `http://localhost:7775/excel/contract/${contractId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `contract_${contractId}.xlsx`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 계약서 삭제 요청 함수
const deleteContract = () => {
    showPopup.value = true;
};

// 팝업 닫기 함수
const closePopup = () => {
    showPopup.value = false;
};

// 계약서 삭제 확인 함수
const confirmDelete = async () => {
    const contractId = route.params.contractId;
    try {
        const response = await axios.post('http://localhost:7775/contract/delete', {
            contractDeleteRequestReason: deleteReason.value,
            contract: contractData.value
        });
        console.log('Contract delete request sent successfully:', response.data);
        alert('삭제 요청이 성공적으로 완료되었습니다.');
        location.reload(); // 삭제 요청 후 페이지 새로고침
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    } finally {
        closePopup();
    }
};
</script>

<style>
.contract-content11 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: calc(100% - 220px);
}

.contract-search {
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

.contract-btn {
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

.contract-edit,
.contract-delete,
.contract-request,
.contract-excel {
    width: 80px;
    height: 40px;
    cursor: pointer;
    margin-left: 15px;
    margin-right: 15px;
}

.contract-pdf {
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
    height: 150px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    gap: 20px;
    margin-top: 40px;
}

.contract-pdf1,
.contract-pdf2 {
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

.contract-pdf1:hover,
.contract-pdf2:hover {
    background-color: #d5e6ff;
}

.contract-list-box2 {
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
.contract2-table4,
.contract2-table5,
.contract2-table6 {
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
}

.contract2-table5 th,
.contract2-table5 td,
.contract2-table6 th,
.contract2-table6 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 600px; /* 너비를 늘리기 위해 추가 */
}

.contract2-table1 th,
.contract2-table2 th,
.contract2-table3 th,
.contract2-table4 th,
.contract2-table5 th,
.contract2-table6 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.contract2-table1 td,
.contract2-table2 td,
.contract2-table3 td,
.contract2-table4 td,
.contract2-table5 td,
.contract2-table6 td {
    height: 40px;
}

.test {
    background-color: #d5e6ff;
}

.contract-process-box {
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
    max-width: 1000px;
    min-width: 100px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    margin-top: 60px;
    height: auto;
    flex-direction: column;
    margin-bottom: 7%;
}

.contract-process-text {
    color: #0C2092;
}

.contract-process-box-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-left: 8px;
}

.contract-process-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.contract-process-writer {
    margin: 0;
    margin-left: 30px;
    margin-bottom: -13px;
}

.contract-process-detail {
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

.contract-process-date {
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

.contract-process-btn,
.contract-process-btn2 {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 7px;
}

.contract-process-regist,
.contract-process-delete {
    background-color: #0C2092;
    border: 2px solid #0C2092;
    color: white;
    border-radius: 10px;
    padding: 5px 7px;
    margin-top: 10px;
    cursor: pointer;
}

.contract-process-regist {
    margin-top: 5px;
    margin-left: 5px;
}

.contract-process-reply {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 10px;
    margin-top: 10px;
}

.contract-process-reply-box {
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

.contract-contents-test1 {
    width: 300px;
}

.popup-overlay55 {
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

.popup-content55 {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    max-width: 400px;
    width: 100%;
}

.popup-content55 h2 {
    margin-bottom: 15px;
}

.popup-content55 textarea {
    width: 90%;
    height: 100px;
    margin-bottom: 15px;
}

.popup-content55 button {
    margin: 5px;
}

.file-download.no-file {
    cursor: default;
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


</style>
