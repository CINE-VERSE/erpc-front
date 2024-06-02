<template>
    <div class="regist-content9">
        <div class="contract-regist">
            <h1>계약서 등록</h1>
        </div>
        <div class="contract-list-box1">
            <table class="contract-table3">
                <thead>
                    <tr>
                        <th>견적서 코드</th>
                        <th>담당자</th>
                        <th>거래처명</th>
                        <th>수주 금액</th>
                        <th>납기 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="quotation-number-div33">
                                <input type="text" v-model="quotationCode" class="quotation-number-box33" placeholder="견적서 코드를 입력해주세요.">
                                <button @click="fetchQuotationData" class="quotation-number-btn33">확인</button>
                            </div>
                        </td>
                        <td>{{ employee.employeeName }}</td>
                        <td>{{ account.accountName }}</td>
                        <td>{{ quotation.quotationTotalCost }}</td>
                        <td>{{ quotation.quotationDueDate }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract-table1">
                <thead>
                    <tr>
                        <th>품목 코드</th>
                        <th>품목 이름</th>
                        <th>수량</th>
                        <th>단가</th>
                        <th>공급가액</th>
                        <th>기타</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="quotationProductList.length === 0">
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr v-for="product in quotationProductList" :key="product.product.productCode">
                        <td>{{ product.product.productCode }}</td>
                        <td>{{ product.product.productName }}</td>
                        <td>{{ product.quotationProductCount }}</td>
                        <td>{{ product.product.productPrice }}</td>
                        <td>{{ product.quotationSupplyPrice }}</td>
                        <td>{{ product.quotationProductionNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract-table2">
                <thead>
                    <tr>
                        <th>창고 코드</th>
                        <th>창고명</th>
                        <th>구분</th>
                        <th>창고 주소</th>
                        <th>사용 여부</th>
                        <th>생산 공정명</th>
                        <th>외주 거래처명</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ warehouse.warehouseCode }}</td>
                        <td>{{ warehouse.warehouseName }}</td>
                        <td>{{ warehouse.warehouseType }}</td>
                        <td>{{ warehouse.warehouseLocation }}</td>
                        <td>{{ warehouse.warehouseUsage }}</td>
                        <td>{{ warehouse.productionLineName }}</td>
                        <td>{{ warehouse.outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract-table4">
                <thead>
                    <tr>
                        <th>납부 형태</th>
                        <th>계약금</th>
                        <th>중도금</th>
                        <th>잔금</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="test1">
                            <div class="contract-dropdown1">
                                <button class="contract-dropdown-btn1">{{ searchBy }} ▼</button>
                                <div class="contract-dropdown-content1">
                                    <a href="#" @click.prevent="setSearchBy('일시납부')">일시납부</a>
                                    <a href="#" @click.prevent="setSearchBy('분할납부')">분할납부</a>
                                </div>
                            </div>
                        </td>
                        <td>
                            <input type="text" v-model="deposit" class="contract-test6">
                        </td>
                        <td>
                            <input type="text" v-model="intermediatePayment" class="contract-test7"
                                :disabled="searchBy === '일시납부'">
                        </td>
                        <td>
                            <input type="text" v-model="finalPayment" class="contract-test8"
                                :disabled="searchBy === '일시납부'">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="contract-table5">
                <thead>
                    <tr>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" v-model="quotationNote" class="contract-test5"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="contract-attachment">
            <h2 class="contract-file">첨부파일</h2>
            <div v-for="(file, index) in files" :key="index" class="file-list">
                <span class="file-icon">📄</span>
                <span class="file-name">{{ file.name }}</span>
            </div>
            <input type="file" @change="handleFileUpload" multiple />
        </div>
        <div class="contract-regist-btn-div33">
            <button @click="registerContract" class="contract-regist-btn33">계약 등록하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router/mainRouter';

const searchBy = ref('분할납부'); // 기본 값을 분할납부로 설정
const quotationCode = ref('');
const quotationNote = ref('');
const deposit = ref(0);
const intermediatePayment = ref(0);
const finalPayment = ref(0);

// 견적서 데이터
const quotation = ref({});
const employee = ref({});
const account = ref({});
const warehouse = ref({});
const quotationProductList = ref([]);

// 파일 첨부
const files = ref([]);

const fetchQuotationData = async () => {
    try {
        const response = await axios.get('http://localhost:7775/quotation/code', {
            params: {
                quotationCode: quotationCode.value
            }
        });
        const data = response.data;
        quotation.value = data;
        employee.value = data.employee;
        account.value = data.account;
        warehouse.value = data.warehouse;
        quotationProductList.value = data.quotationProduct;
        quotationNote.value = data.quotationNote; // 견적서 비고 내역을 계약서 비고 내역으로 사용
    } catch (error) {
        console.error('견적서 정보를 조회하는 중 오류가 발생했습니다.', error);
        alert('견적서 정보를 조회하는 중 오류가 발생했습니다.');
        clearQuotationData();
    }
};

const clearQuotationData = () => {
    quotation.value = {};
    employee.value = {};
    account.value = {};
    warehouse.value = {};
    quotationProductList.value = [];
    quotationNote.value = '';
};

function setSearchBy(criteria) {
    searchBy.value = criteria;
    if (criteria === '일시납부') {
        intermediatePayment.value = 0;
        finalPayment.value = 0;
    }
}

const handleFileUpload = (event) => {
    files.value = Array.from(event.target.files);
};

const registerContract = async () => {
    if (!quotation.value.quotationCode) {
        alert('먼저 견적서 정보를 불러오세요.');
        return;
    }

    if (files.value.length === 0) {
        alert('첨부파일을 등록해주세요.');
        return;
    }

    const contractCategoryId = searchBy.value === '일시납부' ? 1 : 2;

    const contractData = {
        contractNote: quotationNote.value,
        contractTotalPrice: quotation.value.quotationTotalCost,
        contractDueDate: quotation.value.quotationDueDate,
        downPayment: deposit.value,
        progressPayment: intermediatePayment.value,
        balance: finalPayment.value,
        employee: {
            employeeId: employee.value.employeeId,
            // employeeCode:"123"
        },
        account: {
            accountId: account.value.accountId
        },
        warehouse: {
            warehouseId: warehouse.value.warehouseId
        },
        transaction: {
            transactionId: quotation.value.transaction.transactionId
        },
        contractCategory: {
            contractCategoryId: contractCategoryId // 선택된 납부 형태에 따라 설정
        },
        contractProduct: quotationProductList.value.map(product => ({
            contractProductCount: product.quotationProductCount,
            contractSupplyPrice: product.quotationSupplyPrice,
            contractProductionNote: product.quotationProductionNote,
            product: {
                productId: product.product.productId
            }
        }))
    };

    const formData = new FormData();
    formData.append('contract', JSON.stringify(contractData));
    files.value.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post('http://localhost:7775/contract/regist', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true // 필요한 경우 쿠키를 포함하도록 설정
        });
        alert('계약서가 성공적으로 등록되었습니다.');
        router.push({ path: `/contract` });
    } catch (error) {
        console.error('계약서를 등록하는 중 오류가 발생했습니다.', error);
        alert('계약서를 등록하는 중 오류가 발생했습니다.');
    }
};
</script>

<style>

.regist-content9 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: 1200px;
}

.customer-regist {
    text-align: center;
}

.quotation-number-div33 {
    display: flex;
    align-items: center;
}

.quotation-number-box33 {
    width: calc(100% - 50px); /* 버튼 크기를 뺀 나머지 너비 */
    height: 35px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px 0 0 5px;
    box-sizing: border-box;
    font-family: GmarketSansMedium;
    font-size: 15px;
}

.quotation-number-btn33 {
    border-radius: 0 5px 5px 0;
    border: 2px solid #0C2092;
    height: 35px;
    background-color: #0C2092;
    color: white;
    font-size: 11px;
    cursor: pointer;
    margin-left: -1px; /* 테두리 겹침 방지 */
    padding: 0 10px;
}

.search-btn-div1,
.regist-btn-div {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.search-btn1,
.customer-regist-btn {
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

.customer-regist-btn {
    width: 320px;
    font-size: 18px;
    margin-top: 20px;
    margin-bottom: 100px;
}

.customer-list-box1 {
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
    gap: 1px;
}

.customer-table1,
.customer-table2,
.customer-table3,
.customer-table4 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
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
    font-family: GmarketSansMedium;
}

.customer-table1 th,
.customer-table2 th,
.customer-table3 th,
.customer-table4 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.customer-table1 td,
.customer-table2 td,
.customer-table3 td,
.customer-table4 td {
    height: 40px;
    width: 25%;
    /* 테이블 셀 너비를 균일하게 설정 */
    box-sizing: border-box;
    padding: 8px;
}

.customer-test1,
.customer-test2,
.customer-test3,
.customer-test4,
.customer-test5,
.customer-test6,
.customer-test7,
.customer-test8,
.customer-test9 {
    width: 100%;
    height: 35px;
    box-sizing: border-box;
    padding: 8px;
}

.customer-test4 {
    width: 100%;
    /* 테이블 셀 너비와 맞춤 */
}

.customer-test9 {
    width: 100%;
    /* 테이블 셀 너비와 맞춤 */
}

.contract-test5 {
    width: 95%; /* 테이블 셀 너비와 맞춤 */
}

.contract-regist-btn-div33 {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.contract-regist-btn33 {
    width: 320px;
    padding: 10px 20px;
    text-align: center;
    border: none;
    border-radius: 10px;
    background-color: #0C2092;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 18px;
    /* margin-top: 20px; */
    margin-bottom: 50px;
}

.contract-regist-btn33:hover {
    background-color: #007bff;
}
</style>
