<template>
    <div class="delete-content7">
        <!-- 데이터 로딩 중일 때 로딩 메시지 표시 -->
        <div v-if="!deleteSalesOppData">로딩 중...</div>

        <!-- 데이터가 로드된 후에만 상세 정보 렌더링 -->
        <div v-else>
            <div class="order-search">
                <h1 class="maintext">영업기회 삭제 내역</h1>
                <div class="estimate-approval-note1">
                    <h3 class="estimate-approval-note2">삭제 사유</h3>
                    <div class="estimate-approval-note3">{{ deleteSalesOppData.salesOppDeleteRequestReason }}</div>
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
import { useRoute } from 'vue-router';
import DeleteService from '@/components/delete/DeleteService';

const route = useRoute();
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

onMounted(fetchDeleteSalesOppData);
</script>

<style>
/* 여기에 스타일을 추가하세요 */
</style>