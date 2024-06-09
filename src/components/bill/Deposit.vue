<template>
    <div class="deposit-search-content">
        <div class="deposit-search">
            <h1 class="deposit-search-text">수금 조회</h1>
        </div>
        <div class="deposit-box">
            <input type="date" class="search-date-box" v-model="startDate">
            <span class="search-date-separator">-</span>
            <input type="date" class="search-date-box" v-model="endDate">
            <input type="text" class="search-depositor-box" v-model="depositorName" placeholder="입금자명으로 검색">
            <button class="deposit-search-btn" @click="applyFilter">조회하기</button>
        </div>
        <div class="deposit-list-box">
            <table class="deposit-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>입금 코드</th>
                        <th>입금자명</th>
                        <th>입금 계좌</th>
                        <th>입금 금액</th>
                        <th>입금 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(deposit, index) in filteredDeposits" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ deposit.depositCode }}</td>
                        <td>{{ deposit.depositPic }}</td>
                        <td>{{ deposit.depositAccount }}</td>
                        <td>{{ deposit.depositPrice.toLocaleString() }}</td>
                        <td>{{ deposit.depositDate }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const deposits = ref([]);
const startDate = ref('');
const endDate = ref('');
const depositorName = ref('');
const filteredDeposits = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/collection');
        deposits.value = response.data;
        filteredDeposits.value = deposits.value;
    } catch (error) {
        console.error('Error fetching deposits:', error);
    }
});

function applyFilter() {
    filteredDeposits.value = deposits.value.filter(deposit => {
        const matchesDateRange = (!startDate.value || deposit.depositDate >= startDate.value) && (!endDate.value || deposit.depositDate <= endDate.value);
        const matchesDepositor = !depositorName.value || deposit.depositPic.includes(depositorName.value);
        return matchesDateRange && matchesDepositor;
    });
}
</script>

<style>
    @import url('@/assets/css/bill/Deposit.css');
</style>
