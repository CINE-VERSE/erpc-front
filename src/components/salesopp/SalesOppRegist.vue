<template>
    <div class="regist-content">
        <div class="order-regist">
            <h1>영업기회 등록</h1>
        </div>
        <div class="order-list-box1">
            <table class="order-table1">
                <thead>
                    <tr>
                        <th>거래처 명</th>
                        <th>거래처 담당자</th>
                        <th>거래처 주소</th>
                        <th>연락처</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input v-model="newOpp.oppAccountName" placeholder="거래처 명"></td>
                        <td><input v-model="newOpp.oppAccountPic" placeholder="거래처 담당자"></td>
                        <td><input v-model="newOpp.oppAccountLocation" placeholder="거래처 주소"></td>
                        <td><input v-model="newOpp.oppAccountContact" placeholder="연락처"></td>
                    </tr>
                </tbody>
            </table>
            <table class="order-table2">
                <thead>
                    <tr>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input v-model="newOpp.oppAccountNote" placeholder="비고"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="estimate-attachment">
            <div class="estimate-attachment-header">
                <h2 class="estimate-file">첨부파일</h2>
                <img src="@/assets/img/pdf.png" class="estimate-pdfimage">
            </div>
            <div class="estimate-attachment-content">
                <div class="file-list">
                    <span class="file-icon">📄</span>
                    <span class="file-name">제품 카탈로그.pdf</span>
                </div>
            </div>
        </div>
        <div class="estimate-regist-btn-div">
            <button class="estimate-regist-btn" @click="registSalesOpp">영업기회 등록하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const newOpp = ref({
    oppAccountName: '',
    oppAccountPic: '',
    oppAccountLocation: '',
    oppAccountContact: '',
    oppAccountNote: '',
    oppAccountEmail:'a@naver.com',
    salesOppStatus: { salesOppStatusId: 1 }, // 기본 상태 ID 설정
    employee: {
            employeeId: 1
        },
});

const registSalesOpp = async () => {
    try {
        const response = await axios.post('http://localhost:7775/sales_opportunity/regist', newOpp.value);
        alert('영업기회가 성공적으로 등록되었습니다.');
        console.log('등록된 영업기회:', response.data);
    } catch (error) {
        console.error('영업기회 등록 중 오류가 발생했습니다:', error);
        alert('영업기회 등록 중 오류가 발생했습니다.');
    }
};
</script>

<style>
@import url('@/assets/css/order/OrderRegist.css');
</style>