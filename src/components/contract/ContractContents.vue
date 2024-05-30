<template>
    <div class="contract-content" v-if="contractData">
        <div class="contract-search">
            <h1 class="maintext">계약서 정보 조회 내역</h1>
            <div class="contract-btn">
                <button class="contract-request">결재 요청</button>
                <button class="contract-edit" @click="goToEditPage">수정</button>
                <button class="contract-delete" @click="deleteContract">삭제</button>
                <button class="contract-excel" @click="downloadExcel">엑셀 다운</button>
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
            <table class="contract2-table5">
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
                        <td class="test">{{ searchBy }}</td>
                        <td>{{ contractData.downPayment.toLocaleString() }}</td>
                        <td>{{ contractData.progressPayment.toLocaleString() }}</td>
                        <td>{{ contractData.balance.toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="contract-process-box">
            <h1 class="contract-process-text">Process</h1>
            <div class="contract-process-box-detail">
                <div class="contract-process-info">
                    <h4 class="contract-process-writer">{{ contractData.employee.employeeName }} {{
                        contractData.employee.employeeRank.employeeRank }}</h4>
                    <p class="contract-process-date">{{ contractData.contractDate }}</p>
                </div>
                <button class="contract-process-detail">
                    계약 진행 정보 공유합니다~
                </button>
                <div class="contract-process-btn">
                    <button class="contract-process-edit">수정</button>
                    <button class="contract-process-delete">삭제</button>
                </div>
                <div class="contract-process-reply">
                    <input type="text" id="contract-process-reply-box" class="contract-process-reply-box"
                        placeholder="내용을 입력해주세요.">
                    <button class="contract-process-regist">등록하기</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
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
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const contractData = ref(null);
const showPopup = ref(false);
const deleteReason = ref('');

const searchBy = ref('분할납부');

onMounted(async () => {
    const contractId = route.params.contractId;
    try {
        const response = await axios.get(`http://localhost:7775/contract/${contractId}`);
        contractData.value = response.data;
        populateFields(contractData.value);
    } catch (error) {
        console.error('Error fetching contract data:', error);
    }
});

const populateFields = (data) => {
    searchBy.value = data.contractCategory.contractCategoryId === 1 ? '일시납부' : '분할납부';
};

const goToEditPage = () => {
    router.push({ path: `/contract/modify/${route.params.contractId}` });
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
    const contractId = route.params.contractId;
    const url = `http://localhost:7775/excel/contract/${contractId}`;
    window.open(url, '_blank');
};

const deleteContract = () => {
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
};

const confirmDelete = async () => {
    const contractId = route.params.contractId;
    try {
        const response = await axios.post('http://localhost:7775/contract/delete', {
            contractDeleteRequestReason: deleteReason.value,
            contract: contractData.value 
        });
        console.log('Contract delete request sent successfully:', response.data);
        alert('삭제 요청이 성공적으로 완료되었습니다.');
        router.push('/contract'); // 삭제 요청 후 이동
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    } finally {
        closePopup();
    }
};
</script>

<style>
.contract-content {
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
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

.contract-request {
    width: 80px;
    height: 40px;
    cursor: pointer;
    margin-left: 15px;
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

.pdfimage1,
.pdfimage2 {
    width: 30px;
    height: auto;
    margin-left: 5px;
    margin-right: -10px;
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
.contract2-table5 {
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
.contract2-table4 td,
.contract2-table5 th,
.contract2-table5 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.contract2-table1 th,
.contract2-table2 th,
.contract2-table3 th,
.contract2-table4 th,
.contract2-table5 th {
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
.contract2-table5 td {
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
    width: 1200px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    margin-top: 30px;
    height: auto;
    flex-direction: column;
    margin-bottom: 7%;
}

.contract-process-text {
    margin-bottom: 20px;
    color: #0C2092;
}

.contract-process-box-detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
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
    margin-left: 45px;
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
    width: 93%;
    height: auto;
    margin-left: 40px;
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
    margin-right: 45px;
}

.contract-process-btn {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 7px;
}

.contract-process-edit,
.contract-process-delete {
    background-color: #0C2092;
    border: 2px solid #0C2092;
    color: white;
    border-radius: 10px;
    padding: 5px 7px;
    margin-top: 4px;
    cursor: pointer;
}

.contract-process-delete {
    margin-right: 46px;
}

.contract-process-reply {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    width: 90.5%;
    height: auto;
    font-weight: normal;
}

.contract-process-regist {
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

.contract-contents-test1 {
    width: 300px;
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

.file-download.no-file {
    cursor: default;
}
</style>
