<template>
    <div class="estimate-edit-content11" v-if="quotationData">
        <h1>견적서 수정</h1>
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
                    <tr v-for="(product, index) in products" :key="index">
                        <td>
                            <div class="item-code-div2">
                                <input type="text" v-model="product.itemCode" placeholder="품목 코드를 입력해주세요." class="item-code-box2"/>
                                <div v-if="index === products.length - 1" class="button-group">
                                    <button @click="fetchProductData(index)" class="item-code-btn2">확인</button>
                                    <button @click="addProductRow" class="item-add-btn2">추가</button>
                                    <button @click="removeProductRow(index)" :disabled="products.length === 1" class="item-delete-btn2">삭제</button>
                                </div>
                            </div>
                        </td>
                        <td>{{ product.productName }}</td>
                        <td class="narrow-column">
                            <input type="number" v-model.number="product.quantity" class="estimate-test2" @input="updateSupplyValue(index)" />
                        </td>
                        <td>{{ product.productPrice }}</td>
                        <td>{{ product.supplyValue }}</td>
                        <td><input type="text" v-model="product.otherInfo" class="estimate-test3"/></td>
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
                            <select v-model="selectedWarehouseCode" @change="updateWarehouseData" class="warehousedrop">
                                <option v-for="warehouse in warehouses" :key="warehouse.warehouseId" :value="warehouse.warehouseCode">
                                    {{ warehouse.warehouseCode }}
                                </option>
                            </select>
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
                                <input type="text" v-model="customerCode" @input="customerCode = customerCode.toUpperCase()" placeholder="거래처 코드를 입력해주세요." class="customer-code-box2"/>
                                <button @click="fetchCustomerData" class="customer-code-btn2">확인</button>
                            </div>
                        </td>
                        <td>{{ customerName }}</td>
                        <td>{{ employeeName }}</td> 
                        <td><input type="date" v-model="dueDate" class="due-date-box" id="due-date-box"/></td>
                        <td><input type="text" v-model="accountNote" class="customer-test9"/></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="estimate-attachment3">
            <h2 class="estimate-file">첨부파일</h2>
            <div v-if="files.length > 0">
                <div v-for="(file, index) in files" :key="index" class="file-list">
                    <span class="file-icon">📄</span>
                    <span class="file-name">{{ file.name }}</span>
                    <button @click="removeNewFile(index)" class="remove-file-btn">제거</button>
                </div>
            </div>
            <div v-else-if="filteredFiles.length > 0">
                <div v-for="(file, index) in filteredFiles" :key="file.fileId" class="file-list">
                    <span class="file-icon">📄</span>
                    <span class="file-name">{{ file.originName }}</span>
                    <button @click="removeExistingFile(index)" class="remove-file-btn">제거</button>
                </div>
            </div>
            <div v-else class="file-download no-file">
                첨부파일 없음
            </div>
            <input type="file" @change="handleFileUpload" multiple class="file-upload-btn" id="file-upload" />
            <label for="file-upload" class="file-upload-label">파일 선택</label>
        </div>
        <div class="estimate-edit-btn-div33">
            <button @click="updateQuotation" class="estimate-edit-btn33">견적 수정하기</button>
        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const quotationData = ref(null);
const files = ref([]);

const products = ref([createNewProduct()]);

const warehouses = ref([]); // 모든 창고 정보를 저장
const selectedWarehouseCode = ref(''); // 선택된 창고 코드
const warehouseId = ref(null); // Warehouse ID를 저장하기 위한 ref
const warehouseName = ref('');
const warehouseType = ref('');
const warehouseLocation = ref('');
const warehouseUsage = ref('');
const productionLineName = ref('');
const outsourceName = ref('');

const customerCode = ref('');
const accountId = ref(null);
const customerName = ref('');
const responsiblePerson = ref('');
const dueDate = ref('');
const accountNote = ref('');
const employeeName = ref(''); // Employee Name을 저장하기 위한 ref
const employeeId = ref(null); // Employee ID를 저장하기 위한 ref

// 필터된 파일 목록을 계산하는 함수
const filteredFiles = computed(() => {
    return quotationData.value?.quotationFile.filter(file => file.originName !== 'blob') || [];
});

function createNewProduct() {
    return {
        itemCode: '',
        productId: null,
        productName: '',
        productPrice: 0,
        quantity: 0,
        supplyValue: 0,
        otherInfo: ''
    };
}

onMounted(async () => {
    const quotationId = route.params.quotationId;
    try {
        const response = await axios.get(`http://localhost:7775/quotation/${quotationId}`, { withCredentials: true });
        quotationData.value = response.data;
        populateFields(quotationData.value);
    } catch (error) {
        console.error('Error fetching quotation data:', error);
    }
    fetchEmployeeData(); // 컴포넌트가 마운트될 때 employeeId와 employeeName을 가져옴
    fetchWarehouses(); // 컴포넌트가 마운트될 때 창고 정보를 가져옴
});

const populateFields = (data) => {
    products.value = data.quotationProduct.map(product => ({
        itemCode: product.product.productCode,
        productId: product.product.productId,
        productName: product.product.productName,
        productPrice: product.product.productPrice,
        quantity: product.quotationProductCount,
        supplyValue: product.quotationSupplyPrice,
        otherInfo: product.quotationProductionNote
    }));

    selectedWarehouseCode.value = data.warehouse.warehouseCode;
    warehouseId.value = data.warehouse.warehouseId;
    warehouseName.value = data.warehouse.warehouseName;
    warehouseType.value = data.warehouse.warehouseType;
    warehouseLocation.value = data.warehouse.warehouseLocation;
    warehouseUsage.value = data.warehouse.warehouseUsage;
    productionLineName.value = data.warehouse.productionLineName;
    outsourceName.value = data.warehouse.outsourceName;

    customerCode.value = data.account.accountCode;
    accountId.value = data.account.accountId;
    customerName.value = data.account.accountName;
    responsiblePerson.value = data.employee.employeeName;
    dueDate.value = data.quotationDueDate;
    accountNote.value = data.quotationNote;
};

const fetchProductData = async (index) => {
    const product = products.value[index];
    try {
        const response = await axios.get('http://localhost:7775/product', { withCredentials: true });
        const productsData = response.data;
        const productData = productsData.find(p => p.productCode === product.itemCode);
        if (productData) {
            product.productId = productData.productId; // Product ID 저장
            product.productName = productData.productName;
            product.productPrice = productData.productPrice;
            updateSupplyValue(index);
        } else {
            alert('해당 품목 코드를 찾을 수 없습니다.');
            clearProductData(index);
        }
    } catch (error) {
        console.error('제품 정보를 조회하는 중 오류가 발생했습니다.', error);
        alert('제품 정보를 조회하는 중 오류가 발생했습니다.');
        clearProductData(index);
    }
};

const fetchWarehouses = async () => {
    try {
        const response = await axios.get('http://localhost:7775/warehouse', { withCredentials: true });
        warehouses.value = response.data;
    } catch (error) {
        console.error('창고 정보를 조회하는 중 오류가 발생했습니다.', error);
        alert('창고 정보를 조회하는 중 오류가 발생했습니다.');
    }
};

const updateWarehouseData = () => {
    const warehouse = warehouses.value.find(w => w.warehouseCode === selectedWarehouseCode.value);
    if (warehouse) {
        warehouseId.value = warehouse.warehouseId; // Warehouse ID 저장
        warehouseName.value = warehouse.warehouseName;
        warehouseType.value = warehouse.warehouseType;
        warehouseLocation.value = warehouse.warehouseLocation;
        warehouseUsage.value = warehouse.warehouseUsage;
        productionLineName.value = warehouse.productionLineName;
        outsourceName.value = warehouse.outsourceName;
    } else {
        clearWarehouseData();
    }
};

const fetchCustomerData = async () => {
    try {
        const response = await axios.get('http://localhost:7775/account/list', { withCredentials: true });
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

const fetchEmployeeData = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        try {
            const response = await axios.get(`http://localhost:7775/employees/${userId}`, { withCredentials: true });
            const employeeData = response.data;
            employeeId.value = employeeData.employeeId;
            employeeName.value = employeeData.employeeName;
        } catch (error) {
            console.error('직원 정보를 조회하는 중 오류가 발생했습니다.', error);
            alert('직원 정보를 조회하는 중 오류가 발생했습니다.');
        }
    }
};

const updateSupplyValue = (index) => {
    const product = products.value[index];
    product.supplyValue = product.productPrice * product.quantity;
};

const handleFileUpload = (event) => {
    files.value = Array.from(event.target.files);
    quotationData.value.quotationFile = []; // 파일 선택 시 기존 파일 목록 초기화
};

const removeNewFile = (index) => {
    files.value.splice(index, 1);
};

const removeExistingFile = (index) => {
    quotationData.value.quotationFile.splice(index, 1);
};

const addProductRow = () => {
    products.value.push(createNewProduct());
};

const removeProductRow = (index) => {
    if (products.value.length > 1) {
        products.value.splice(index, 1);
    } else {
        alert('최소한 한 개의 품목은 필요합니다.');
    }
};

const updateQuotation = async () => {
    const quotationId = route.params.quotationId; // quotationId 값을 가져옵니다.
    const areProductsValid = products.value.every(product => 
        product.itemCode && product.productId && product.productName && product.productPrice && product.quantity
    );
    const isWarehouseValid = selectedWarehouseCode.value && warehouseId.value && warehouseName.value && warehouseType.value && warehouseLocation.value && warehouseUsage.value;
    const isCustomerValid = customerCode.value && customerName.value;
    const isEmployeeValid = employeeId.value && employeeName.value;
    const isDueDateValid = dueDate.value;

    if (!areProductsValid || !isWarehouseValid || !isCustomerValid || !isEmployeeValid || !isDueDateValid) {
        alert('모든 필수 입력란을 채워주세요.');
        return;
    }

    const quotation = {
        quotationId: quotationId, // 여기서 quotationId를 추가합니다.
        quotationNote: accountNote.value,
        quotationTotalCost: products.value.reduce((total, product) => total + product.supplyValue, 0),
        quotationDueDate: dueDate.value,
        employee: { 
            employeeId: employeeId.value, // 수정: employeeId 값 설정
            employeeName: employeeName.value // 수정: employeeName 값 설정
        },
        account: { accountId: accountId.value },
        warehouse: { warehouseId: warehouseId.value },
        quotationProduct: products.value.map(product => ({
            quotationProductCount: product.quantity,
            quotationSupplyPrice: product.supplyValue,
            quotationProductionNote: product.otherInfo,
            product: { productId: product.productId }
        }))
    };

    const formData = new FormData();
    formData.append('quotation', JSON.stringify(quotation));

    // 기존 파일 목록을 유지하도록 추가
    if (quotationData.value.quotationFile.length > 0) {
        quotationData.value.quotationFile.forEach(file => {
            formData.append('existingFiles', JSON.stringify(file));
        });
    }

    // 첨부 파일이 있는 경우에만 파일 추가
    if (files.value.length > 0) {
        files.value.forEach(file => {
            formData.append('files', file);
        });
    }

    try {
        await axios.patch(`http://localhost:7775/quotation/modify`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        alert('견적서가 성공적으로 수정되었습니다.');
        router.push({ path: `/estimate/${quotationId}` });
    } catch (error) {
        console.error('견적서를 수정하는 중 오류가 발생했습니다.', error);
        alert('견적서를 수정하는 중 오류가 발생했습니다.');
    }
};

const clearProductData = (index) => {
    const product = products.value[index];
    product.productId = null;
    product.productName = '';
    product.productPrice = 0;
    product.quantity = 0;
    product.supplyValue = 0;
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
    responsiblePerson.value = '';
};

// 수량이 변경될 때 공급가액을 자동으로 업데이트
watch(products, (newProducts) => {
    newProducts.forEach((product, index) => {
        if (product.quantity < 0) {
            product.quantity = 0;
        }
        updateSupplyValue(index);
    });
}, { deep: true });
</script>



<style>
.estimate-edit-content11 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: calc(100% - 220px);
}

.estimate-regist {
    text-align: center;
    margin-top: 3%;
}

.estimate-list-box {
    width: 90%;
    max-width: 1400px;
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

.estimate-table1,
.estimate-table2,
.estimate-table3 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.estimate-table1 th,
.estimate-table1 td,
.estimate-table2 th,
.estimate-table2 td,
.estimate-table3 th,
.estimate-table3 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.estimate-table1 th,
.estimate-table2 th,
.estimate-table3 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.estimate-table1 td,
.estimate-table2 td,
.estimate-table3 td {
    height: 40px;
    width: 14.28%;
    box-sizing: border-box;
    padding: 8px;
}

.estimate-test2 {
    width: 80px;
    height: 35px;
    box-sizing: border-box;
    padding: 8px;
}

.estimate-test1,
.estimate-test3,
.estimate-test4,
.estimate-test5,
.estimate-test6,
.estimate-test7,
.estimate-test8 {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 8px;
}

.item-code-box2,
.warehousedrop,
.customer-code-box2,
.due-date-box {
    width: 100%;
    height: 35px;
    font-size: 15px;
    box-sizing: border-box;
    padding: 8px;
}

.item-code-btn2,
.storage-code-btn2,
.customer-code-btn2,
.item-add-btn2,
.item-delete-btn2 {
    border-radius: 5px;
    border: 2px solid #0C2092;
    margin-top: 5px;
    height: 30px;
    width: auto;
    background-color: #0C2092;
    color: white;
    font-size: 11px;
    cursor: pointer;
    margin-left: 5px;
}

.button-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 5px;
}

.estimate-attachment3 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    max-width: 1400px;
    height: 220px;
    background-color: #d5e6ff;
    border-radius: 10px;
    margin-bottom: 50px;
}

.estimate-attachment3-header {
    display: flex;
    align-items: center;
    padding: 5px;
    margin-bottom: -20px;
}

.estimate-pdfimage {
    width: 30px;
    padding-bottom: 5px;
    padding-left: 5px;
}

.estimate-attachment-content {
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

.estimate-edit-btn-div33 {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.estimate-edit-btn33 {
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
    margin-bottom: 50px;
}

.estimate-edit-btn33:hover {
    background-color: #007bff;
}
</style>