<template>
    <div class="deposit-search-content">
        <div class="deposit-search">
            <h1 class="deposit-search-text">수금 조회</h1>
        </div>
        <div class="deposit-box">
            <div class="search-date">
                <p class="search-start-date-text">조회 시작 일자</p>
                <input type="date" class="search-start-date-box" id="search-start-date-box" v-model="startDate">
                <p class="search-end-date-text">조회 종료 일자</p>
                <input type="date" class="search-end-date-box" id="search-end-date-box" v-model="endDate">
            </div>
            <div class="deposit-search-btn-div">
                <button class="deposit-search-btn" @click="applyFilter">조회하기</button>
            </div>
        </div>
        <div class="deposit-search2">
            <h1 class="deposit-search2-text">입금 내역</h1>
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
const filteredDeposits = ref(deposits.value);  

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:7775/collection');
        deposits.value = response.data;
        filteredDeposits.value = deposits.value;
    } catch (error) {
        console.error('Error fetching deposits:', error);
    }
});

function applyFilter() {
    if (startDate.value && endDate.value) {
        filteredDeposits.value = deposits.value.filter(deposit => {
            return deposit.depositDate >= startDate.value && deposit.depositDate <= endDate.value;
        });
    } else {
        filteredDeposits.value = deposits.value;
    }
}
</script>

<style>
.deposit-content {
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.deposit-search,
.deposit-search2 {
    text-align: center;
    margin-top: 3%;
}

.deposit-search-text {
    margin-top: 5%;
    margin-bottom: 30px;
}

.deposit-search2-text {
    margin-top: 100px;
}

.deposit-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
    margin-bottom: 100px;
    border-radius: 10px;
    border: 2px solid #ccc;
    box-sizing: border-box;
    background-color: whitesmoke;
    height: auto;
    width: 100%;
    margin: 20px auto;
    gap: 1px;
    max-width: 300px;
}

.search-date {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-start-date-text,
.search-end-date-text {
    min-width: 50px;
    margin-right: 10px;
    margin-bottom: 2px;
}

.search-start-date-box,
.search-end-date-box {
    flex-grow: 1;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    width: 220px;
}

.deposit-search-btn-div {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
    margin-top: 10px;
}

.deposit-search-btn {
    padding: 10px 20px;
    text-align: center;
    border: none;
    border-radius: 10px;
    background-color: #0C2092;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 5px;
    margin-bottom: 5px;
    max-width: 320px;
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
    width: 100%;
    max-width: 1400px;
    margin: 20px auto;
    margin-bottom: 7%;
    gap: 1px;
}

.deposit-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.deposit-table th,
.deposit-table td {
    text-align: center;
    border: 1px solid #ccc;
    width: 160px; /* 너비 조절 */
    padding: 8px;
    font-family: GmarketSansMedium;
}

.deposit-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.deposit-table tr:hover {
    background-color: #d5e6ff;
}
</style>
