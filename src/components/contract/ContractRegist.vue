<template>
    <div class="contract-regist-content11">
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
                        <td class="estimate-test333">
                            <div class="quotation-number-div33">
                                <input type="text" v-model="quotationCode" class="quotation-number-box33">
                                <button @click="fetchQuotationData" class="quotation-number-btn33">확인</button>
                            </div>
                        </td>
                        <td>{{ employee.employeeName }}</td>
                        <td>{{ account.accountName }}</td>
                        <td>{{ formattedTotalCost }}</td>
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
                        <td>{{ formatNumber(product.product.productPrice) }}</td>
                        <td>{{ formatNumber(product.quotationSupplyPrice) }}</td>
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
                        <th v-if="searchBy === '분할납부'">계약금</th>
                        <th v-if="searchBy === '분할납부'">중도금</th>
                        <th v-if="searchBy === '분할납부'">잔금</th>
                        <th v-if="searchBy === '일시납부'">일시납부 금액</th>
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
                        <td v-if="searchBy === '분할납부'">
                            <input type="text" v-model="formattedDeposit" class="contract-test6" @input="updateDeposit">
                        </td>
                        <td v-if="searchBy === '분할납부'">
                            <input type="text" v-model="formattedIntermediatePayment" class="contract-test7" @input="updateIntermediatePayment">
                        </td>
                        <td v-if="searchBy === '분할납부'">
                            <input type="text" v-model="formattedFinalPayment" class="contract-test8" @input="updateFinalPayment">
                        </td>
                        <td v-if="searchBy === '일시납부'">
                            {{ formattedTotalCost }}
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

        <div class="contract-attachment3">
            <h2 class="contract-file">첨부파일</h2>
            <div v-for="(file, index) in files" :key="index" class="file-list">
                <span class="file-icon">📄</span>
                <span class="file-name">{{ file.name }}</span>
            </div>
            <input type="file" @change="handleFileUpload" multiple class="file-upload-btn" id="file-upload"/>
            <label for="file-upload" class="file-upload-label">파일 선택</label>
        </div>
        <div class="contract-regist-btn-div33">
            <button @click="registerContract" class="contract-regist-btn33">계약 등록하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import router from '@/router/mainRouter';

const searchBy = ref('분할납부'); // 기본 값을 분할납부로 설정
const quotationCode = ref('');
const quotationNote = ref(''); // 비고란
const deposit = ref(0);
const intermediatePayment = ref(0);
const finalPayment = ref(0);

const formattedDeposit = ref('');
const formattedIntermediatePayment = ref('');
const formattedFinalPayment = ref('');

// 견적서 데이터
const quotation = ref({});
const employee = ref({});
const account = ref({});
const warehouse = ref({});
const quotationProductList = ref([]);

// 파일 첨부
const files = ref([]);

const formattedTotalCost = computed(() => formatNumber(quotation.value.quotationTotalCost));

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

        calculatePayments();
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

const calculatePayments = () => {
    const totalCost = quotation.value.quotationTotalCost || 0;
    if (searchBy.value === '일시납부') {
        deposit.value = totalCost;
        intermediatePayment.value = 0;
        finalPayment.value = 0;
    } else {
        deposit.value = Math.round(totalCost * 0.1);
        intermediatePayment.value = Math.round(totalCost * 0.6);
        finalPayment.value = Math.round(totalCost * 0.3);
    }
    updateFormattedPayments();
};

const updateFormattedPayments = () => {
    formattedDeposit.value = deposit.value.toLocaleString();
    formattedIntermediatePayment.value = intermediatePayment.value.toLocaleString();
    formattedFinalPayment.value = finalPayment.value.toLocaleString();
};

const updateDeposit = () => {
    deposit.value = parseInt(formattedDeposit.value.replace(/,/g, ''), 10) || 0;
    updateFormattedPayments();
};

const updateIntermediatePayment = () => {
    intermediatePayment.value = parseInt(formattedIntermediatePayment.value.replace(/,/g, ''), 10) || 0;
    updateFormattedPayments();
};

const updateFinalPayment = () => {
    finalPayment.value = parseInt(formattedFinalPayment.value.replace(/,/g, ''), 10) || 0;
    updateFormattedPayments();
};

watch([formattedDeposit, formattedIntermediatePayment, formattedFinalPayment], updateFormattedPayments);

function setSearchBy(criteria) {
    searchBy.value = criteria;
    calculatePayments();
}

const handleFileUpload = (event) => {
    files.value = Array.from(event.target.files);
};

const registerContract = async () => {
    // 필수 입력 필드가 모두 채워졌는지 확인
    const isQuotationValid = quotationCode.value && employee.value.employeeName && account.value.accountName && quotation.value.quotationTotalCost && quotation.value.quotationDueDate;
    const areProductsValid = quotationProductList.value.length > 0 && quotationProductList.value.every(product =>
        product.product.productCode && product.product.productName && product.quotationProductCount && product.product.productPrice && product.quotationSupplyPrice
    );
    const isWarehouseValid = warehouse.value.warehouseCode && warehouse.value.warehouseName && warehouse.value.warehouseType && warehouse.value.warehouseLocation && warehouse.value.warehouseUsage;
    const arePaymentsValid = searchBy.value === '일시납부' || (formattedDeposit.value && formattedIntermediatePayment.value && formattedFinalPayment.value);
    const areFilesUploaded = files.value.length > 0;

    if (!isQuotationValid || !areProductsValid || !isWarehouseValid || !arePaymentsValid) {
        alert('모든 필수 입력란을 채워주세요.');
        return;
    }

    if (!areFilesUploaded) {
        alert('첨부파일을 등록해주세요.');
        return;
    }

    const contractCategoryId = searchBy.value === '일시납부' ? 1 : 2;

    const contractData = {
        contractNote: quotationNote.value, // 비고란은 선택사항
        contractTotalPrice: quotation.value.quotationTotalCost,
        contractDueDate: quotation.value.quotationDueDate,
        downPayment: searchBy.value === '일시납부' ? 0 : deposit.value,
        progressPayment: searchBy.value === '일시납부' ? 0 : intermediatePayment.value,
        balance: searchBy.value === '일시납부' ? 0 : finalPayment.value,
        employee: {
            employeeId: employee.value.employeeId,
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

const formatNumber = (value) => {
    return value ? value.toLocaleString() : '';
};
</script>




<style>

.contract-regist-content11 {
    /* margin-top: 8%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: calc(100% - 220px);
    /* main1의 너비를 뺀 나머지 공간 */
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

.contract-list-box {
    width: 90%;
    /* 너비를 90%로 설정 */
    max-width: 1400px;
    /* 최대 너비를 1400px로 설정 */
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
    margin-bottom: 100px;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: white;
    height: auto;
    margin: 20px auto;
    gap: 1px;
}

.contract-table1,
.contract-table2,
.contract-table3,
.contract-table4 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.contract-table1 th,
.contract-table1 td,
.contract-table2 th,
.contract-table2 td,
.contract-table3 th,
.contract-table3 td,
.contract-table4 th,
.contract-table4 td  {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.contract-table1 th,
.contract-table2 th,
.contract-table3 th,
.contract-table4 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.contract-table1 td,
.contract-table2 td,
.contract-table3 td,
.contract-table4 td {
    height: 40px;
    width: 14.28%;
    /* 7개의 셀 너비를 균일하게 설정 (100% / 7) */
    box-sizing: border-box;
    padding: 8px;
}

.contract-test2 {
    width: 80px;
    /* 수량 필드의 너비를 좁게 설정 */
    height: 35px;
    box-sizing: border-box;
    padding: 8px;
}

.contract-test1,
.contract-test3,
.contract-test4,
.contract-test5,
.contract-test6,
.contract-test7,
.contract-test8 {
    width: 100%;
    height: 35px;
    box-sizing: border-box;
    padding: 8px;
}

.contract-attachment3 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    /* 너비를 90%로 설정 */
    max-width: 1400px;
    /* 최대 너비를 1400px로 설정 */
    height: 200px;
    background-color: #d5e6ff;
    border-radius: 10px;
    margin-bottom: 50px;
}

.contract-attachment3-header {
    display: flex;
    align-items: center;
    padding: 5px;
    margin-bottom: -20px;
}

.contract-attachment-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.file-list {
    display: flex;
    align-items: center;
    background-color: white;
    width: 90%;
    height: 70px;
    border-radius: 10px;
    padding: 20px;
    margin-top: -5px;
}

.file-icon {
    font-size: 24px;
    margin-right: 5px;
}

.file-name {
    font-size: 18px;
}

.file-upload-btn {
    position: absolute;
    bottom: 10px;
    right: 20px;
    opacity: 0;
    width: 0;
    height: 0;
}

.file-upload-label {
    font-size: 12px;
    background-color: #0C2092;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
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
