<template>
    <div class="order-content">
        <div class="order-search">
            <h1 class="maintext">영업기회 조회 내역</h1>
            <h3 class="maintext2">기회인지</h3>
            <div class="order-btn">
                <button class="order-request" @click="openPopup">상태변경</button>
                <button class="order-edit" @click="goToEditPage">수정</button>
                <button class="order-delete" @click="deleteAccount">삭제</button>
            </div>
            <div class="order-list-box2">
                <table class="order2-table1">
                    <thead>
                        <tr>
                            <th>거래처명</th>
                            <th>거래처 담당자</th>
                            <th>거래처 주소</th>
                            <th>연락처</th>
                            <th>이메일</th>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.oppAccountName }}</td>
                            <td>{{ accountData.oppAccountPic }}</td>
                            <td>{{ accountData.oppAccountLocation }}</td>
                            <td>{{ accountData.oppAccountContact }}</td>
                            <td>{{ accountData.oppAccountEmail }}</td>
                            <td>{{ accountData.oppAccountNote }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="order2-table2">
                    <thead>
                        <tr>
                            <th>담당자 명</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>연락처</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.employee.name }}</td>
                            <td>{{ accountData.employee.department }}</td>
                            <td>{{ accountData.employee.position }}</td>
                            <td>{{ accountData.employee.contact }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="order2-table3">
                    <thead>
                        <tr>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.oppAccountNote }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="order-process-box">
                    <h1 class="order-process-text">Process</h1>
                    <div class="order-process-box-detail">
                        <div class="order-process-info">
                            <h4 class="order-process-writer">{{ accountData.employee.name }}</h4>
                            <p class="order-process-date">{{ accountData.oppDate }}</p>
                        </div>
                        <button class="order-process-detail">
                            프로젝트 진행 정보 공유합니다~
                        </button>
                        <div class="order-process-btn">
                            <button class="order-process-edit">수정</button>
                            <button class="order-process-delete">삭제</button>
                        </div>
                        <div class="order-process-reply">
                            <input type="text" id="order-process-reply-box" class="order-process-reply-box" placeholder="내용을 입력해주세요.">
                            <button class="order-process-regist">등록하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 팝업 창 -->
    <div class="popup" v-if="showPopup">
        <div class="popup-content">
            <!-- 팝업 창에 표시될 내용 -->
            <p>팝업 창에 표시될 내용</p>
            <input type="text" v-model="deleteReason" placeholder="삭제 이유를 입력해주세요">
            <button @click="confirmDelete">확인</button>
            <button class="close-btn" @click="closePopup">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const accountData = ref({});
const showPopup = ref(false);
const deleteReason = ref('');

onMounted(async () => {
    const accountId = route.params.accountId;
    try {
        const response = await axios.get(`http://localhost:7775/sales_opportunity/${accountId}`);
        accountData.value = response.data;
    } catch (error) {
        console.error('Error fetching account data:', error);
    }
});

const goToEditPage = () => {
    router.push({ path: `/customer/modify/${route.params.accountId}` });
};

const deleteAccount = () => {
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
};

const confirmDelete = async () => {
    const accountId = route.params.accountId;
    try {
        const response = await axios.post('http://localhost:7775/sales_opportunity/delete', {
            accountDeleteRequestReason: deleteReason.value,
            account: accountData.value
        });
        console.log('Account delete request sent successfully:', response.data);
        alert('삭제 요청이 성공적으로 완료되었습니다.');
        router.push('/customer/list'); // 삭제 요청 후 이동
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    } finally {
        closePopup();
    }
};
</script>

<style>
    @import url('@/assets/css/order/OrderContents.css');
</style>