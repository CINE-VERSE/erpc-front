<template>
    <div class="regist-content" v-if="quotationData">
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
            <div v-for="(file, index) in quotationData.quotationFile" :key="file.fileId" class="file-list">
                <span class="file-icon">📄</span>
                <span class="file-name">{{ file.originName }}</span>
                <button @click="downloadFile(file.accessUrl)">다운로드</button>
            </div>
            <input type="file" @change="handleFileUpload" multiple />
        </div>

        <button @click="updateQuotation" class="estimate-regist-btn">견적 수정하기</button>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const quotationData = ref(null);
const files = ref([]);

const itemCode = ref('');
const productId = ref(null);
const productName = ref('');
const productPrice = ref(0);
const quantity = ref(0);
const supplyValue = ref(0);
const otherInfo = ref('');

const warehouseCode = ref('');
const warehouseId = ref(null);
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

onMounted(async () => {
    const quotationId = route.params.quotationId;
    try {
        const response = await axios.get(`http://localhost:7775/quotation/${quotationId}`);
        quotationData.value = response.data;
        populateFields(quotationData.value);
    } catch (error) {
        console.error('Error fetching quotation data:', error);
    }
});

const populateFields = (data) => {
    itemCode.value = data.quotationProduct[0].product.productCode;
    productId.value = data.quotationProduct[0].product.productId;
    productName.value = data.quotationProduct[0].product.productName;
    productPrice.value = data.quotationProduct[0].product.productPrice;
    quantity.value = data.quotationProduct[0].quotationProductCount;
    supplyValue.value = data.quotationTotalCost;
    otherInfo.value = data.quotationProduct[0].quotationProductionNote;

    warehouseCode.value = data.warehouse.warehouseCode;
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

const fetchProductData = async () => {
    try {
        const response = await axios.get('/product');
        console.log('Products response:', response.data);
        const products = response.data.products || response.data; // 응답 데이터 형식 확인
        const product = products.find(p => p.productCode === itemCode.value);
        if (product) {
            productId.value = product.productId;
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
        console.log('Warehouses response:', response.data);
        const warehouses = response.data.warehouses || response.data; // 응답 데이터 형식 확인
        const warehouse = warehouses.find(w => w.warehouseCode === warehouseCode.value);
        if (warehouse) {
            warehouseId.value = warehouse.warehouseId;
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
        console.log('Customers response:', response.data);
        const customers = response.data.customers || response.data; // 응답 데이터 형식 확인
        const customer = customers.find(c => c.accountCode === customerCode.value);
        if (customer) {
            accountId.value = customer.accountId;
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

const downloadFile = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const updateQuotation = async () => {
    const quotationId = route.params.quotationId;
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
            employeeCode: "123"
        },
        account: { accountId: accountId.value },
        warehouse: { warehouseId: warehouseId.value },
        quotationProduct: [
            {
                quotationProductCount: quantity.value,
                quotationSupplyPrice: supplyValue.value,
                quotationProductionNote: otherInfo.value,
                product: { productId: productId.value }
            }
        ]
    };

    const formData = new FormData();
    formData.append('quotation', JSON.stringify(quotation));
    files.value.forEach(file => {
        formData.append('files', file);
    });

    try {
        await axios.patch(`/quotation/modify/${quotationId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        alert('견적서가 성공적으로 수정되었습니다.');
        router.push({ path: `/quotation/${quotationId}` });
    } catch (error) {
        console.error('견적서를 수정하는 중 오류가 발생했습니다.', error);
        alert('견적서를 수정하는 중 오류가 발생했습니다.');
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
.regist-content {
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: calc(100% - 220px); /* main1의 너비를 뺀 나머지 공간 */
}

.estimate-regist {
    text-align: center;
    margin-top: 3%;
}

.estimate-list-box {
    width: 90%; /* 너비를 90%로 설정 */
    max-width: 1400px; /* 최대 너비를 1400px로 설정 */
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
    width: 14.28%; /* 7개의 셀 너비를 균일하게 설정 (100% / 7) */
    box-sizing: border-box;
    padding: 8px;
}

.estimate-test2 {
    width: 80px; /* 수량 필드의 너비를 좁게 설정 */
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
    height: 35px;
    box-sizing: border-box;
    padding: 8px;
}

.item-code-box2,
.storage-code-box2,
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
.customer-code-btn2 {
    border-radius: 5px;
    border: 2px solid #0C2092;
    margin-top: 5px;
    height: 30px;
    width: auto;
    background-color: #0C2092;
    color: white;
    font-size: 14px;
    cursor: pointer;
}

.estimate-attachment {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%; /* 너비를 90%로 설정 */
    max-width: 1400px; /* 최대 너비를 1400px로 설정 */
    height: auto;
    background-color: #d5e6ff;
    border-radius: 10px;
    margin-bottom: 50px;
}

.estimate-attachment-header {
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

.estimate-regist-btn-div {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.estimate-regist-btn {
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
    width: 320px;
    font-size: 18px;
    margin-top: 20px;
    margin-bottom: 100px;
}
</style>
