<template>
    <div class="search-content11">
        <div class="regist-content11">
            <div class="customer-regist">
                <h1>거래처 정보 수정</h1>
            </div>
            <div class="customer-list-box1">
                <table class="customer-table1">
                    <thead>
                        <tr>
                            <th>사업자 번호</th>
                            <th>사업자명</th>
                            <th>대표자명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.corporationNum }}</td>
                            <td><input type="text" v-model="accountData.accountName" class="customer-test1" required></td>
                            <td><input type="text" v-model="accountData.accountRepresentative" class="customer-test2" required></td>
                        </tr>
                    </tbody>
                </table>
                <table class="customer-table2">
                    <thead>
                        <tr>
                            <th>기업 상태</th>
                            <th>법인 여부</th>
                            <th>소재지</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.accountStatus?.accountStatus }}</td>
                            <td><input type="text" v-model="accountData.corporationStatus" class="customer-test3" required></td>
                            <td><input type="text" v-model="accountData.accountLocation" class="customer-test4" required></td>
                        </tr>
                    </tbody>
                </table>
                <table class="customer-table3">
                    <thead>
                        <tr>
                            <th>업종</th>
                            <th>전화번호</th>
                            <th>이메일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" v-model="accountData.accountType" class="customer-test5" required></td>
                            <td><input type="text" v-model="accountData.accountContact" class="customer-test6" required></td>
                            <td><input type="text" v-model="accountData.accountEmail" class="customer-test7" required></td>
                        </tr>
                    </tbody>
                </table>
                <table class="customer-table4">
                    <thead>
                        <tr>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" v-model="accountData.accountNote" class="customer-test9"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="customer-regist-btn-div3">
            <button @click="updateAccount" class="customer-regist-btn3">거래처 수정하기</button>
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

onMounted(async () => {
    const accountId = route.params.accountId;
    try {
        const response = await axios.get(`http://localhost:7775/account/${accountId}`);
        accountData.value = response.data;
    } catch (error) {
        console.error('Error fetching account data:', error);
        alert('거래처 정보를 불러오는 중 오류가 발생했습니다.');
    }
});

const updateAccount = async () => {
    if (
        !accountData.value.accountName ||
        !accountData.value.accountRepresentative ||
        !accountData.value.corporationStatus ||
        !accountData.value.accountLocation ||
        !accountData.value.accountType ||
        !accountData.value.accountContact ||
        !accountData.value.accountEmail
    ) {
        alert('모든 필수 입력란을 채워주세요.');
        return;
    }

    const employeeId = localStorage.getItem('userId');
    if (!employeeId) {
        alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
        return;
    }

    accountData.value.employee = { employeeId: employeeId };

    try {
        const response = await axios.patch(`http://localhost:7775/account/modify`, accountData.value);
        alert('거래처 정보가 성공적으로 수정되었습니다.');
        router.push({ path: `/customer/${route.params.accountId}` });
    } catch (error) {
        console.error('Error updating account data:', error);
        alert('거래처 정보를 수정하는 중 오류가 발생했습니다.');
    }
};
</script>

<style>
@import url('@/assets/css/customer/CustomerEdit.css');
</style>
