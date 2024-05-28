<template>
    <div class="regist-content">
        <div class="contract-regist">
            <h1>계약서 등록</h1>
        </div>
        <div class="contract-search-box">
            <h3>견적서 불러오기</h3>
            <div class="contract-number">
                <p class="contract-number-text">견적서 코드</p>
                <input type="text" v-model="quotationCode" class="contract-number-box" placeholder="견적서 코드를 입력해주세요.">
            </div>
            <div class="contract-search-btn-div1">
                <button @click="fetchQuotationData" class="contract-search-btn1">조회하기</button>
            </div>
        </div>
        <div class="contract-list-box1">
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
                    <tr>
                        <td>{{ productCode }}</td>
                        <td>{{ productName }}</td>
                        <td>{{ quantity }}</td>
                        <td>{{ unitPrice }}</td>
                        <td>{{ totalCost }}</td>
                        <td>{{ additionalInfo }}</td>
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
                        <td>{{ warehouseCode }}</td>
                        <td>{{ warehouseName }}</td>
                        <td>{{ warehouseType }}</td>
                        <td>{{ warehouseLocation }}</td>
                        <td>{{ warehouseUsage }}</td>
                        <td>{{ productionLineName }}</td>
                        <td>{{ outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract-table3">
                <thead>
                    <tr>
                        <th>견적서 코드</th>
                        <th>담당자</th>
                        <th>거래처명</th>
                        <th>수주 금액</th>
                        <th>납기 일자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ quotationCode }}</td>
                        <td>{{ employeeName }}</td>
                        <td>{{ accountName }}</td>
                        <td>{{ totalCost }}</td>
                        <td>{{ dueDate }}</td>
                        <td><input type="text" v-model="quotationNote" class="contract-test5"></td>
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
                                    <a href="#" @click.prevent="setSearchBy('일시 납부')">일시 납부</a>
                                    <a href="#" @click.prevent="setSearchBy('분할 납부')">분할 납부</a>
                                </div>
                            </div>
                        </td>
                        <td><input type="text" class="contract-test6"></td>
                        <td><input type="text" class="contract-test7"></td>
                        <td><input type="text" class="contract-test8"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="contract-attachment1">
            <div class="contract-attachment-header1">
                <h2 class="contract-file1">첨부파일</h2>
                <img src="@/assets/img/pdf.png" class="contract-pdfimage1">
            </div>
            <div class="contract-attachment-content1">
                <div class="contract-file-list1">
                    <span class="contract-file-icon1">📄</span>
                    <span class="contract-file-name1">견적서.pdf</span>
                </div>
            </div>
        </div>
        <div class="contract-regist-btn-div1">
            <button class="contract-regist-btn1">계약 등록하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const searchBy = ref('일시 납부 or 분할 납부');
const quotationCode = ref('');
const productCode = ref('');
const productName = ref('');
const quantity = ref(0);
const unitPrice = ref(0);
const totalCost = ref(0);
const additionalInfo = ref('');
const dueDate = ref('');
const quotationNote = ref('');
const employeeName = ref('');
const accountName = ref('');
const warehouseCode = ref('');
const warehouseName = ref('');
const warehouseType = ref('');
const warehouseLocation = ref('');
const warehouseUsage = ref('');
const productionLineName = ref('');
const outsourceName = ref('');

const fetchQuotationData = async () => {
    try {
        const response = await axios.get('http://localhost:7775/quotation/code', {
            params: {
                quotationCode: quotationCode.value
            }
        });
        const quotation = response.data;

        if (quotation.quotationProduct.length > 0) {
            const product = quotation.quotationProduct[0].product;
            productCode.value = product.productCode;
            productName.value = product.productName;
            quantity.value = quotation.quotationProduct[0].quotationProductCount;
            unitPrice.value = product.productPrice;
            additionalInfo.value = quotation.quotationProduct[0].quotationProductionNote;
        }

        totalCost.value = quotation.quotationTotalCost;
        dueDate.value = quotation.quotationDueDate;
        quotationNote.value = quotation.quotationNote;
        employeeName.value = quotation.employee.employeeName;
        accountName.value = quotation.account.accountName;
        warehouseCode.value = quotation.warehouse.warehouseCode;
        warehouseName.value = quotation.warehouse.warehouseName;
        warehouseType.value = quotation.warehouse.warehouseType;
        warehouseLocation.value = quotation.warehouse.warehouseLocation;
        warehouseUsage.value = quotation.warehouse.warehouseUsage;
        productionLineName.value = quotation.warehouse.productionLineName;
        outsourceName.value = quotation.warehouse.outsourceName;
    } catch (error) {
        console.error('견적서 정보를 조회하는 중 오류가 발생했습니다.', error);
        alert('견적서 정보를 조회하는 중 오류가 발생했습니다.');
        clearQuotationData();
    }
};

const clearQuotationData = () => {
    productCode.value = '';
    productName.value = '';
    quantity.value = 0;
    unitPrice.value = 0;
    totalCost.value = 0;
    additionalInfo.value = '';
    dueDate.value = '';
    quotationNote.value = '';
    employeeName.value = '';
    accountName.value = '';
    warehouseCode.value = '';
    warehouseName.value = '';
    warehouseType.value = '';
    warehouseLocation.value = '';
    warehouseUsage.value = '';
    productionLineName.value = '';
    outsourceName.value = '';
};

function setSearchBy(criteria) {
    searchBy.value = criteria;
}
</script>

<style>
    @import url('@/assets/css/contract/ContractRegist.css');
</style>
