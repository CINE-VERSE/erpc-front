<template>
    <div class="regist-content">
        <h1>견적서 등록</h1>
        <div class="estimate-list-box">
            <table class="estimate-table1">
                <thead>
                    <tr>
                        <th>품목 코드</th>
                        <th>품목 이름</th>
                        <th class="narrow-column">수량</th>
                        <th>단가</th>
                        <th>공급가액</th>
                        <th>기타</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="item-code-div2">
                                <input type="text" v-model="itemCode" placeholder="품목 코드를 입력해주세요." class="item-code-box2"/>
                                <button @click="fetchProductData" class="item-code-btn2">확인</button>
                            </div>
                        </td>
                        <td>{{ productName }}</td>
                        <td class="narrow-column">
                            <input type="number" v-model.number="quantity" class="estimate-test2" />
                        </td>
                        <td>{{ productPrice }}</td>
                        <td>{{ supplyValue }}</td>
                        <td><input type="text" v-model="otherInfo" class="estimate-test3"/></td>
                    </tr>
                </tbody>
            </table>

            <table class="estimate-table2">
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
                        <td>
                            <div class="storage-code-div2">
                                <input type="text" v-model="warehouseCode" placeholder="창고 코드를 입력해주세요." class="storage-code-box2"/>
                                <button @click="fetchWarehouseData" class="storage-code-btn2">확인</button>
                            </div>
                        </td>
                        <td>{{ warehouseName }}</td>
                        <td>{{ warehouseType }}</td>
                        <td>{{ warehouseLocation }}</td>
                        <td>{{ warehouseUsage }}</td>
                        <td>{{ productionLineName }}</td>
                        <td>{{ outsourceName }}</td>
                    </tr>
                </tbody>
            </table>

            <table class="estimate-table3">
                <thead>
                    <tr>
                        <th>거래처 코드</th>
                        <th>거래처명</th>
                        <th>담당자</th>
                        <th>마감일자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="customer-code-div2">
                                <input type="text" v-model="customerCode" placeholder="거래처 코드를 입력해주세요." class="customer-code-box2"/>
                                <button @click="fetchCustomerData" class="customer-code-btn2">확인</button>
                            </div>
                        </td>
                        <td>{{ customerName }}</td>
                        <td><input type="text" v-model="responsiblePerson" class="estimate-test7"/></td>
                        <td><input type="date" v-model="dueDate" class="due-date-box" id="due-date-box"/></td>
                        <td><input type="text" v-model="accountNote" class="customer-test9"/></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="estimate-attachment">
            <h2 class="estimate-file">첨부파일</h2>
            <div v-for="(file, index) in files" :key="index" class="file-list">
                <span class="file-icon">📄</span>
                <span class="file-name">{{ file.name }}</span>
            </div>
            <input type="file" @change="handleFileUpload" multiple />
        </div>

        <button @click="registerQuotation" class="estimate-regist-btn">견적 등록하기</button>
    </div>
</template>



<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

// Axios 기본 설정
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:7775'; // 서버 URL

// 상품 정보
const itemCode = ref('');
const productId = ref(null); // Product ID를 저장하기 위한 ref
const productName = ref('');
const productPrice = ref(0);
const quantity = ref(0);
const supplyValue = ref(0);
const otherInfo = ref('');

// 창고 정보
const warehouseCode = ref('');
const warehouseId = ref(null); // Warehouse ID를 저장하기 위한 ref
const warehouseName = ref('');
const warehouseType = ref('');
const warehouseLocation = ref('');
const warehouseUsage = ref('');
const productionLineName = ref('');
const outsourceName = ref('');

// 거래처 정보
const customerCode = ref('');
const accountId = ref(null); // Account ID를 저장하기 위한 ref
const customerName = ref('');
const responsiblePerson = ref('');
const dueDate = ref('');
const accountNote = ref('');

// 파일 첨부
const files = ref([]);

const fetchProductData = async () => {
    try {
        const response = await axios.get('/product');
        const products = response.data;
        const product = products.find(p => p.productCode === itemCode.value);
        if (product) {
            productId.value = product.productId; // Product ID 저장
            productName.value = product.productName;
            productPrice.value = product.productPrice;
            updateSupplyValue();
        } else {
            alert('해당 품목 코드를 찾을 수 없습니다.');
            clearProductData();
        }
    } catch (error) {
        console.error('제품 정보를 조회하는 중 오류가 발생했습니다.', error);
        alert('제품 정보를 조회하는 중 오류가 발생했습니다.');
        clearProductData();
    }
};

const fetchWarehouseData = async () => {
    try {
        const response = await axios.get('/warehouse');
        const warehouses = response.data;
        const warehouse = warehouses.find(w => w.warehouseCode === warehouseCode.value);
        if (warehouse) {
            warehouseId.value = warehouse.warehouseId; // Warehouse ID 저장
            warehouseName.value = warehouse.warehouseName;
            warehouseType.value = warehouse.warehouseType;
            warehouseLocation.value = warehouse.warehouseLocation;
            warehouseUsage.value = warehouse.warehouseUsage;
            productionLineName.value = warehouse.productionLineName;
            outsourceName.value = warehouse.outsourceName;
        } else {
            alert('해당 창고 코드를 찾을 수 없습니다.');
            clearWarehouseData();
        }
    } catch (error) {
        console.error('창고 정보를 조회하는 중 오류가 발생했습니다.', error);
        alert('창고 정보를 조회하는 중 오류가 발생했습니다.');
        clearWarehouseData();
    }
};

const fetchCustomerData = async () => {
    try {
        const response = await axios.get('/account/list');
        const customers = response.data;
        const customer = customers.find(c => c.accountCode === customerCode.value);
        if (customer) {
            accountId.value = customer.accountId; // Account ID 저장
            customerName.value = customer.accountName;
        } else {
            alert('해당 거래처 코드를 찾을 수 없습니다.');
            clearCustomerData();
        }
    } catch (error) {
        console.error('거래처 정보를 조회하는 중 오류가 발생했습니다.', error);
        alert('거래처 정보를 조회하는 중 오류가 발생했습니다.');
        clearCustomerData();
    }
};

const updateSupplyValue = () => {
    supplyValue.value = productPrice.value * quantity.value;
};

const handleFileUpload = (event) => {
    files.value = Array.from(event.target.files);
};

const registerQuotation = async () => {
    if (!productId.value || !warehouseId.value || !accountId.value) {
        alert('모든 데이터를 입력하고 확인 버튼을 눌러주세요.');
        return;
    }

    const quotation = {
        quotationNote: accountNote.value,
        quotationTotalCost: supplyValue.value,
        quotationDueDate: dueDate.value,
        employee: { 
            employeeId: 1,
            employeeCode:"123"
         },  // Employee ID를 적절히 설정
        account: { accountId: accountId.value },  // Account ID 설정
        warehouse: { warehouseId: warehouseId.value },  // Warehouse ID 설정
        quotationProduct: [
            {
                quotationProductCount: quantity.value,
                quotationSupplyPrice: productPrice.value,
                quotationProductionNote: otherInfo.value,
                product: { productId: productId.value }  // Product ID 설정
            }
        ]
    };

    const formData = new FormData();
    formData.append('quotation', JSON.stringify(quotation));
    files.value.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post('/quotation/regist', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true // 쿠키를 포함하도록 설정
        });
        alert('견적서가 성공적으로 등록되었습니다.');
    } catch (error) {
        console.error('견적서를 등록하는 중 오류가 발생했습니다.', error);
        alert('견적서를 등록하는 중 오류가 발생했습니다.');
    }
};

const clearProductData = () => {
    productId.value = null;
    productName.value = '';
    productPrice.value = 0;
    quantity.value = 0;
    supplyValue.value = 0;
};

const clearWarehouseData = () => {
    warehouseId.value = null;
    warehouseName.value = '';
    warehouseType.value = '';
    warehouseLocation.value = '';
    warehouseUsage.value = '';
    productionLineName.value = '';
    outsourceName.value = '';
};

const clearCustomerData = () => {
    accountId.value = null;
    customerName.value = '';
};

// 수량이 변경될 때 공급가액을 자동으로 업데이트
watch(quantity, (newQuantity) => {
    if (newQuantity < 0) {
        quantity.value = 0;
    }
    updateSupplyValue();
});
</script>



<style>
@import url('@/assets/css/estimate/EstimateRegist.css');
</style>
