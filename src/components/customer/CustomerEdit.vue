<template>
    <div class="search-content">
        <div class="customer-search">
            <h1>거래처 정보 수정</h1>
        </div>
        <div class="customer-box">
            <div class="customer-code">
                <div class="customer-code-text">거래처 코드</div>
                <button class="customer-code-box">{{ accountData.accountCode }}</button>
            </div>
        </div>
        <div class="regist-content11">
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
                            <td><input type="text" v-model="accountData.accountName" class="customer-test1"></td>
                            <td><input type="text" v-model="accountData.accountRepresentative" class="customer-test2"></td>
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
                            <td><input type="text" v-model="accountData.corporationStatus" class="customer-test3"></td>
                            <td><input type="text" v-model="accountData.accountLocation" class="customer-test4"></td>
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
                            <td><input type="text" v-model="accountData.accountType" class="customer-test5"></td>
                            <td><input type="text" v-model="accountData.accountContact" class="customer-test6"></td>
                            <td><input type="text" v-model="accountData.accountEmail" class="customer-test7"></td>
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
        <div class="customer-regist-btn-div">
            <button @click="updateAccount" class="customer-regist-btn">거래처 수정하기</button>
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
    }
});

const updateAccount = async () => {
    const accountId = route.params.accountId;
    try {
        await axios.put(`http://localhost:7775/account/${accountId}`, accountData.value);
        alert('거래처 정보가 성공적으로 수정되었습니다.');
        router.push({ path: `/customer/${accountId}` });
    } catch (error) {
        console.error('Error updating account data:', error);
        alert('거래처 정보를 수정하는 중 오류가 발생했습니다.');
    }
};
</script>

<style>
.regist-content11 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.customer-box {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.customer-code {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.customer-code-text {
    margin-bottom: 5px;
    font-weight: bold;
}

.customer-code-box {
    padding: 10px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 5px;
    cursor: default;
}

.customer-list-box1 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.customer-table1,
.customer-table2,
.customer-table3,
.customer-table4 {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.customer-table1 th,
.customer-table1 td,
.customer-table2 th,
.customer-table2 td,
.customer-table3 th,
.customer-table3 td,
.customer-table4 th,
.customer-table4 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
}

.customer-table1 th,
.customer-table2 th,
.customer-table3 th,
.customer-table4 th {
    background-color: #f0f0f0;
}

.customer-test1,
.customer-test2,
.customer-test3,
.customer-test4,
.customer-test5,
.customer-test6,
.customer-test7,
.customer-test9 {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.customer-regist-btn-div {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.customer-regist-btn {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.customer-regist-btn:hover {
    background-color: #0056b3;
}
</style>
