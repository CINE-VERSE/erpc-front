<template>
    <div class="regist-content" v-if="quotationData">
        <div class="order-search">
            <h1 class="maintext">견적서 정보 조회 내역</h1>
            <div class="estimate-btn">
                <button class="estimate-request">결재 요청</button>
                <button class="estimate-edit" @click="goToQuotationPage">수정</button>
                <button class="estimate-delete" @click="deleteQuotation">삭제</button>
            </div>
            <div class="estimate-pdf">
                <div v-for="file in quotationData.quotationFile" :key="file.fileId" class="file-download">
                    <button class="estimate-pdf1" @click="downloadFile(file.accessUrl)">
                        {{ file.originName }} 다운로드
                    </button>
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
    @import url('@/assets/css/estimate/EstimateContents.css');
</style>
