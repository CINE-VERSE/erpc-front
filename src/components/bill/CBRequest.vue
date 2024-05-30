<template>
    <div class="cb-search-content">
        <div class="cb-search">
            <h1 class="cbtext">세금계산서 발행 요청</h1>
            <h2>프로젝트 조회</h2>
        </div>
        <div class="cb-search-box">
            <div class="business-number">
                <p class="business-number-text">프로젝트 코드</p>
                <input v-model="projectCode" type="text" id="business-number-box" class="business-number-box" placeholder="프로젝트 코드를 입력해주세요.">
            </div>
            <div class="search-btn-div1">
                <button class="search-btn1" @click="fetchOrderData">조회하기</button>
            </div>
        </div>
        <div class="cb-search2">
            <h2>세금계산서 발행 정보</h2>
        </div>
        <div class="cb-list-box1">
            <table class="cb-table1">
                <thead>
                    <tr>
                        <th>프로젝트 코드</th>
                        <th>거래처 코드</th>
                        <th>법인 여부</th>
                        <th>Billing 잔액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.transaction.transactionCode || 'N/A' }}</td>
                        <td>{{ orderData.account.accountCode || 'N/A' }}</td>
                        <td>{{ orderData.account.corporationStatus || 'N/A' }}</td>
                        <td>{{ orderData.orderTotalPrice ? orderData.orderTotalPrice.toLocaleString() : 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="cb-table2">
                <thead>
                    <tr>
                        <th>사업자 번호</th>
                        <th>사업자명</th>
                        <th>대표자명</th>
                        <th>업태</th>
                        <th>종목</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.account.corporationNum || 'N/A' }}</td>
                        <td>{{ orderData.account.accountName || 'N/A' }}</td>
                        <td>{{ orderData.account.accountRepresentative || 'N/A' }}</td>
                        <td>{{ orderData.account.accountType || 'N/A' }}</td>
                        <td>{{ orderData.account.accountNote || 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="cb-table3">
                <thead>
                    <tr>
                        <th>소재지</th>
                        <th>전화 번호</th>
                        <th>이메일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ orderData.account.accountLocation || 'N/A' }}</td>
                        <td>{{ orderData.account.accountContact || 'N/A' }}</td>
                        <td>{{ orderData.account.accountEmail || 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="cb-table4">
                <thead>
                    <tr>
                        <th>입금 코드</th>
                        <th>입금 일자</th>
                        <th>입금 금액</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="deposit-code-div2">
                                <input v-model="depositCode" type="text" id="deposit-code-box2" class="deposit-code-box2" placeholder="입금 코드를 입력해주세요.">
                                <button class="deposit-code-btn2" @click="fetchCollectionData">확인</button>
                            </div>
                        </td>
                        <td>{{ collectionData.depositDate || 'N/A' }}</td>
                        <td>{{ collectionData.depositPrice ? collectionData.depositPrice.toLocaleString() : 'N/A' }}</td>
                        <td><input v-model="collectionData.depositCategory.depositCategory" type="text" id="remark-box2" class="remark-box2" placeholder="비고란 입력 필수"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="order1-pdf">
            <button class="order1-pdf1">
                견적서 업로드<img src="@/assets/img/pdf.png" class="pdfimage1">
            </button>
            <button class="order1-pdf2">
                계약서 업로드<img src="@/assets/img/pdf.png" class="pdfimage2">
            </button>
        </div>
        <div class="regist-btn-div">
            <button class="regist-btn2">발행 요청하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const projectCode = ref('');
const depositCode = ref('');
const orderData = ref({
    transaction: { transactionCode: '' },
    account: {
        accountCode: '',
        corporationStatus: '',
        corporationNum: '',
        accountName: '',
        accountRepresentative: '',
        accountType: '',
        accountNote: '',
        accountLocation: '',
        accountContact: '',
        accountEmail: ''
    },
    orderTotalPrice: 0
});

const collectionData = ref({
    depositDate: '',
    depositPrice: 0,
    depositCategory: { depositCategory: '' }
});

const fetchOrderData = async () => {
    try {
        const response = await axios.get(`http://localhost:7775/order`, {
            params: {
                transactionCode: projectCode.value
            }
        });
        if (response.data && response.data.length > 0) {
            orderData.value = response.data[0];
        } else {
            alert('프로젝트 코드를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('Error fetching order data:', error);
        alert('데이터를 가져오는 중 오류가 발생했습니다.');
    }
};

const fetchCollectionData = async () => {
    try {
        const response = await axios.get(`http://localhost:7775/collection`, {
            params: {
                depositCode: depositCode.value
            }
        });
        if (response.data && response.data.length > 0) {
            collectionData.value = response.data[0];
        } else {
            alert('입금 코드를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('Error fetching collection data:', error);
        alert('데이터를 가져오는 중 오류가 발생했습니다.');
    }
};
</script>
<style>
.cbtext {
    margin-bottom: 50px;
}

.cb-search-content {
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.cb-search,
.cb-search2 {
    text-align: center;
    margin-top: 3%;
}

.cb-search-box,
.cb-search-box2 {
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
}

.cb-search-box {
    max-width: 400px;
}

.cb-search-box2 {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 20px auto;
    gap: 20px;
}

.cb-list-box1 {
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
    max-width: 1200px;
    margin: 20px auto;
    margin-bottom: 20px;
    gap: 1px;
}

.cb-table1,
.cb-table2,
.cb-table3,
.cb-table4 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.cb-table1 th,
.cb-table1 td,
.cb-table2 th,
.cb-table2 td,
.cb-table3 th,
.cb-table3 td,
.cb-table4 th,
.cb-table4 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.cb-table1 th,
.cb-table2 th,
.cb-table3 th,
.cb-table4 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.cb-table1 td,
.cb-table2 td,
.cb-table3 td,
.cb-table4 td {
    height: 40px;
}

.deposit-code-box2,
.remark-box2 {
    height: 35px; 
    font-size: 15px;
}

.deposit-code-btn2 {
    border-radius: 5px;
    border: 2px solid #0C2092;
    margin-left: 10px;
    height: 30px;
    width: auto;
    background-color: #0C2092;
    color: white;
    font-size: 14px;
    cursor: pointer;
}

.order1-pdf {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-grow: 1;
    padding: 10px;
    background-color: #CCEAFF;
    border: 2px solid #CCEAFF;
    border-radius: 10px;
    box-sizing: border-box;
    width: 800px;
    height: 90px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    gap: 70px;
    margin-top: 30px;
}

.order1-pdf1,
.order1-pdf2 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 6px 30px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    color: black;
    font-weight: bold;
    width: 330px;
}

.order1-pdf1:hover,
.order1-pdf2:hover {
    background-color: #d5e6ff;
}

.pdfimage1,
.pdfimage2 {
    width: 30px;
    height: auto;
    margin-left: 5px;
    margin-right: -10px;
}

.search-btn-div1,
.regist-btn-div {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.search-btn1,
.regist-btn2 {
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
}

.search-btn1 {
    max-width: 320px;
}

.regist-btn2 {
    width: 350px;
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 7%;
}
</style>
