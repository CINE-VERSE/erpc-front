<template>
    <div class="regist-content" v-if="quotationData">
        <div class="order-search">
            <h1 class="maintext">견적서 정보 조회 내역</h1>
            <div class="estimate-btn">
                <button class="estimate-request">결재 요청</button>
                <button class="estimate-edit" @click="goToQuotationPage">수정</button>
                <button class="estimate-delete" @click="deleteQuotation">삭제</button>
                <button class="estimate-excel" @click="downloadExcel">엑셀 다운</button>
            </div>
            <div class="estimate-pdf">
                <div v-if="quotationData.quotationFile.length > 0">
                    <div v-for="file in quotationData.quotationFile" :key="file.fileId" class="file-download">
                        <button class="estimate-pdf1" @click="downloadFile(file.accessUrl)">
                            {{ file.originName }} 다운로드
                        </button>
                    </div>
                </div>
                <div v-else class="file-download no-file">
                    첨부파일 없음
                </div>
            </div>
        </div>
        <div class="estimate-list-box">
            <table class="estimate2-table1">
                <thead>
                    <tr>
                        <th>견적서 코드</th>
                        <th>견적 금액</th>
                        <th>작성 일자</th>
                        <th>삭제 일자</th>
                        <th>마감 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ quotationData.quotationCode }}</td>
                        <td>{{ quotationData.quotationTotalCost }}</td>
                        <td>{{ quotationData.quotationDate }}</td>
                        <td>{{ quotationData.quotationDeleteDate }}</td>
                        <td>{{ quotationData.quotationDueDate }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="estimate2-table2">
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
                    <tr v-for="product in quotationData.quotationProduct" :key="product.quotationProductId">
                        <td>{{ product.product.productCode }}</td>
                        <td>{{ product.product.productName }}</td>
                        <td>{{ product.quotationProductCount }}</td>
                        <td>{{ product.product.productPrice }}</td>
                        <td>{{ product.quotationSupplyPrice }}</td>
                        <td>{{ product.quotationProductionNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="estimate2-table3">
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
                        <td>{{ quotationData.warehouse.warehouseCode }}</td>
                        <td>{{ quotationData.warehouse.warehouseName }}</td>
                        <td>{{ quotationData.warehouse.warehouseType }}</td>
                        <td>{{ quotationData.warehouse.warehouseLocation }}</td>
                        <td>{{ quotationData.warehouse.warehouseUsage }}</td>
                        <td>{{ quotationData.warehouse.productionLineName }}</td>
                        <td>{{ quotationData.warehouse.outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="estimate2-table4">
                <thead>
                    <tr>
                        <th>담당자</th>
                        <th>거래처명</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ quotationData.employee.employeeName }}</td>
                        <td>{{ quotationData.account.accountName }}</td>
                        <td>{{ quotationData.quotationNote }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="estimate-process-box">
            <h1 class="estimate-process-text">Process</h1>
            <div class="estimate-process-box-detail">
                <div class="estimate-process-info">
                    <h4 class="estimate-process-writer">{{ quotationData.employee.employeeName }}</h4>
                    <p class="estimate-process-date">{{ quotationData.quotationDate }}</p>
                </div>
                <button class="estimate-process-detail">
                    견적서 양식이 일부 수정되었습니다~
                </button>
                <div class="estimate-process-btn">
                    <button class="estimate-process-edit">수정</button>
                    <button class="estimate-process-delete">삭제</button>
                </div>
                <div class="estimate-process-reply">
                    <input type="text" id="estimate-process-reply-box" class="estimate-process-reply-box" placeholder="내용을 입력해주세요.">
                    <button class="estimate-process-regist">등록하기</button>
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
const quotationData = ref(null);
const showPopup = ref(false);
const deleteReason = ref('');

onMounted(async () => {
    const quotationId = route.params.quotationId;
    try {
        const response = await axios.get(`http://localhost:7775/quotation/${quotationId}`);
        quotationData.value = response.data;
    } catch (error) {
        console.error('Error fetching quotation data:', error);
    }
});

const goToQuotationPage = () => {
    router.push({ path: `/estimate/modify/${route.params.quotationId}` });
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
    const quotationId = route.params.quotationId;
    const url = `http://localhost:7775/excel/quotation/${quotationId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotation_${quotationId}.xlsx`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const deleteQuotation = () => {
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
};

const confirmDelete = async () => {
    const quotationId = route.params.quotationId;
    try {
        const response = await axios.post('http://localhost:7775/quotation/delete', {
            quotationDeleteRequestReason: deleteReason.value,
            quotation: quotationData.value
        });
        console.log('Quotation delete request sent successfully:', response.data);
        alert('삭제 요청이 성공적으로 완료되었습니다.');
        router.push('/estimate'); // 삭제 요청 후 이동
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    } finally {
        closePopup();
    }
};
</script>

<style>
.regist-content {
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

.estimate-btn {
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

.estimate-edit,
.estimate-delete,
.estimate-request,
.estimate-excel {
    width: 80px;
    height: 40px;
    cursor: pointer;
    margin-left: 15px;
    margin-right: 15px;
}

.estimate-pdf {
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

.estimate-pdf1 {
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

.estimate-pdf1:hover {
    background-color: #d5e6ff;
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
    max-width: 1200px;
    margin: 20px auto;
    margin-bottom: 20px;
    gap: 1px;
}

.estimate2-table1,
.estimate2-table2,
.estimate2-table3,
.estimate2-table4 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.estimate2-table1 th,
.estimate2-table1 td,
.estimate2-table2 th,
.estimate2-table2 td,
.estimate2-table3 th,
.estimate2-table3 td,
.estimate2-table4 th,
.estimate2-table4 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.estimate2-table1 th,
.estimate2-table2 th,
.estimate2-table3 th,
.estimate2-table4 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.estimate2-table1 td,
.estimate2-table2 td,
.estimate2-table3 td,
.estimate2-table4 td {
    height: 40px;
}

.test {
    background-color: #d5e6ff;
}

.estimate-process-box {
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

.estimate-process-text {
    margin-bottom: 20px;
    color: #0C2092;
}

.estimate-process-box-detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
}

.estimate-process-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.estimate-process-writer {
    margin: 0;
    margin-left: 45px;
}

.estimate-process-detail {
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

.estimate-process-date {
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

.estimate-process-btn {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 7px;
}

.estimate-process-edit,
.estimate-process-delete {
    background-color: #0C2092;
    border: 2px solid #0C2092;
    color: white;
    border-radius: 10px;
    padding: 5px 7px;
    margin-top: 4px;
    cursor: pointer;
}

.estimate-process-delete {
    margin-right: 46px;
}

.estimate-process-reply {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.estimate-process-reply-box {
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

.estimate-process-regist {
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

.estimate-contents-test1 {
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
}

.file-download.no-file {
    cursor: default;
}
</style>
