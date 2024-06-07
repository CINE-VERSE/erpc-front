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
.deposit-search-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%; /* 추가 */
    box-sizing: border-box; /* 추가 */
}

.deposit-search {
    text-align: center;
    width: 100%; /* 추가 */
}

.deposit-search-text {
    margin-bottom: 30px;
}

.deposit-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap; /* 추가 */
}

.search-date-box {
    height: 40px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    width: 200px;
    font-size: 14px;
}

.search-date-separator {
    font-size: 20px;
    margin: 0 10px;
}

.search-depositor-box {
    height: 40px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #e5f0ff;
    color: #0c2092;
    outline: none;
    width: 250px;
}

.deposit-search-btn {
    height: 40px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #0C2092;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.deposit-search-btn:hover {
    background-color: #007bff;
}

.deposit-list-box {
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
    max-width: 1400px;
    margin: 20px auto;
    margin-bottom: 7%;
    gap: 1px;
    overflow-x: auto; /* 추가 */
}

.deposit-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    table-layout: auto; /* 추가 */
}

.deposit-table th,
.deposit-table td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    min-width: 170px; /* 수정 */
}

.deposit-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.deposit-table tr:hover {
    background-color: #d5e6ff;
    cursor: pointer;
}

</style>
