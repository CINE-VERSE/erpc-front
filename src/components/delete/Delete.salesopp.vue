<template>
    <div class="delete-content7">
        <div v-if="!deleteSalesOppData">로딩 중...</div>
        <div v-else>
            <div class="order-search">
                <h1 class="maintext">영업기회 삭제 내역</h1>
                <div class="estimate-approval-note1">
                    <h3 class="estimate-approval-note2">삭제 사유</h3>
                    <div class="estimate-approval-note3">{{ deleteSalesOppData.salesOppDeleteRequestReason }}</div>
                    <button @click="processSalesOppDeleteRequest(deleteSalesOppData.salesOppDeleteRequestId)">영업기회 삭제</button>
                </div>
            </div>
            <div class="estimate-list-box">
                <table class="estimate-table1">
                    <thead>
                        <tr>
                            <th>거래처명</th>
                            <th>거래처 담당자</th>
                            <th>거래처 주소</th>
                            <th>연락처</th>
                            <th>이메일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ deleteSalesOppData.salesOpp.oppAccountName }}</td>
                            <td>{{ deleteSalesOppData.salesOpp.oppAccountPic }}</td>
                            <td>{{ deleteSalesOppData.salesOpp.oppAccountLocation }}</td>
                            <td>{{ deleteSalesOppData.salesOpp.oppAccountContact }}</td>
                            <td>{{ deleteSalesOppData.salesOpp.oppAccountEmail }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="estimate-table2">
                    <thead>
                        <tr>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ deleteSalesOppData.salesOpp.oppAccountNote }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import DeleteService from '@/components/delete/DeleteService';

const route = useRoute();
const router = useRouter();
const deleteSalesOppData = ref(null);

const fetchDeleteSalesOppData = async () => {
    const salesOppDeleteRequestId = route.params.salesOppDeleteRequestId;
    try {
        const response = await DeleteService.findSalesOppDeleteRequestById(salesOppDeleteRequestId);
        deleteSalesOppData.value = response.data;
    } catch (error) {
        console.error("Error fetching deleted sales opportunity data:", error);
    }
};
const processSalesOppDeleteRequest = async (salesOppDeleteRequestId) => {
    try {
        const requestData = { 
            salesOppDeleteRequestId: salesOppDeleteRequestId,
        };
        console.log('Request Data:', requestData); 
        await DeleteService.updateSalesOppDeleteRequestProcess(requestData);
        alert('영업기회 삭제 요청이 성공적으로 처리되었습니다.');
        fetchDeleteSalesOppData(); 
        router.push('/delete');
    } catch (error) {
        console.error('영업기회 삭제 요청 처리 중 오류가 발생했습니다:', error);
    }
};

onMounted(fetchDeleteSalesOppData);
</script>

<style>
/* 여기에 스타일을 추가하세요 */
</style>