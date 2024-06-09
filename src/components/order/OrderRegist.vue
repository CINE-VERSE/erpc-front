<template>
    <div class="order-regist-content11">
        <div class="order-regist11">
            <h1>수주 등록</h1>
        </div>
        <div class="order-list-box1">
            <table class="order-table1">
                <thead>
                    <tr>
                        <th>계약서 코드</th>
                        <th>담당자</th>
                        <th>프로젝트 코드</th>
                        <th>거래처명</th>
                        <th>수주 금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="contract-test333">
                            <div class="contract-number-div33">
                                <input type="text" v-model="contractCode" class="contract-number-box33">
                                <button @click="fetchContractData" class="contract-number-btn33">조회</button>
                            </div>
                        </td>
                        <td>{{ contractData.employee.employeeName }}</td>
                        <td>{{ contractData.contractCode }}</td>
                        <td>{{ contractData.account.accountName }}</td>
                        <td>{{ contractData.contractTotalPrice }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order-table2">
                <thead>
                    <tr>
                        <th>품목 코드</th>
                        <th>품목 이름</th>
                        <th>수량</th>
                        <th>단가</th>
                        <th>합계</th>
                        <th>기타</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in contractData.contractProduct" :key="product.product.productCode">
                        <td>{{ product.product.productCode }}</td>
                        <td>{{ product.product.productName }}</td>
                        <td>{{ product.contractProductCount }}</td>
                        <td>{{ product.product.productPrice }}</td>
                        <td>{{ product.contractSupplyPrice }}</td>
                        <td>{{ product.contractProductionNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order-table3">
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
                        <td>{{ contractData.warehouse.warehouseCode }}</td>
                        <td>{{ contractData.warehouse.warehouseName }}</td>
                        <td>{{ contractData.warehouse.warehouseType }}</td>
                        <td>{{ contractData.warehouse.warehouseLocation }}</td>
                        <td>{{ contractData.warehouse.warehouseUsage }}</td>
                        <td>{{ contractData.warehouse.productionLineName }}</td>
                        <td>{{ contractData.warehouse.outsourceName }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="contractData.contractCategory.contractCategoryId === 1">
                <table class="order2-table4">
                    <thead>
                        <tr>
                            <th>납부 형태</th>
                            <th>수주 금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>일시납부</td>
                            <td>{{ contractData.contractTotalPrice.toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <table class="order2-table5">
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
                            <td>분할납부</td>
                            <td>{{ contractData.downPayment.toLocaleString() }}</td>
                            <td>{{ contractData.progressPayment.toLocaleString() }}</td>
                            <td>{{ contractData.balance.toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="order-attachment33">
            <h2 class="order-file">첨부파일</h2>
            <div v-if="files.length > 0">
                <div v-for="(file, index) in files" :key="index" class="file-list34">
                    <span class="file-icon">📄</span>
                    <span class="file-name">{{ file.name }}</span>
                </div>
            </div>
            <div v-else>
                <div v-for="(file, index) in contractData.contractFile" :key="file.fileId" class="file-list34">
                    <span class="file-icon">📄</span>
                    <span class="file-name">{{ file.originName }}</span>
                </div>
            </div>
            <input type="file" @change="handleFileUpload" multiple class="file-upload-btn" id="file-upload"/>
            <label for="file-upload" class="file-upload-label">파일 선택</label>
        </div>
        <div class="order-regist-btn-div33">
            <button class="order-regist-btn33" @click="registerOrder">수주 등록하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router/mainRouter';

const contractCode = ref('');
const contractData = ref({
    contractCode: '',
    employee: {
        employeeName: ''
    },
    account: {
        accountCode: '',
        accountName: ''
    },
    contractTotalPrice: '',
    contractProduct: [
        {
            product: {
                productCode: '',
                productName: '',
                productPrice: ''
            },
            contractProductCount: '',
            contractSupplyPrice: '',
            contractProductionNote: ''
        }
    ],
    warehouse: {
        warehouseId: '',
        warehouseCode: '',
        warehouseName: '',
        warehouseType: '',
        warehouseLocation: '',
        warehouseUsage: '',
        productionLineName: '',
        outsourceName: ''
    },
    contractCategory: {
        contractCategoryId:'',
        contractCategory: ''
    },
    downPayment: '',
    progressPayment: '',
    balance: '',
    contractDate: '',
    contractDueDate: '',
    contractNote: '',
    contractFile: []
});

const files = ref([]);

const fetchContractData = async () => {
    try {
        const response = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/contract/code', {
            params: {
                contractCode: contractCode.value
            }
        });
        contractData.value = response.data;
    } catch (error) {
        console.error('Error fetching contract data:', error);
    }
};

const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    files.value = uploadedFiles;
    contractData.value.contractFile = [];
};

const registerOrder = async () => {
    if (files.value.length === 0) {
        alert('첨부파일을 등록해주세요.');
        return;
    }

    const orderData = {
        contactDate: contractData.value.contractDate,
        orderTotalPrice: contractData.value.contractTotalPrice,
        orderDueDate: contractData.value.contractDueDate,
        orderNote: contractData.value.contractNote,
        employee: {
            employeeId: contractData.value.employee.employeeId
        },
        account: {
            accountId: contractData.value.account.accountId
        },
        warehouse: {
            warehouseId: contractData.value.warehouse.warehouseId
        },
        contractCategory: {
            contractCategoryId: contractData.value.contractCategory.contractCategoryId
        },
        transaction: {
            transactionId: contractData.value.transaction.transactionId
        },
        orderProduct: contractData.value.contractProduct.map(product => ({
            orderProductCount: product.contractProductCount,
            orderSupplyPrice: product.contractSupplyPrice,
            orderProductionNote: product.contractProductionNote,
            product: {
                productId: product.product.productId
            }
        }))
    };

    if (contractData.value.contractCategory.contractCategoryId === 2) {
        orderData.downPayment = contractData.value.downPayment;
        orderData.progressPayment = contractData.value.progressPayment;
        orderData.balance = contractData.value.balance;
    }

    const formData = new FormData();
    formData.append('order', JSON.stringify(orderData));
    files.value.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/order/regist', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert('수주 등록이 성공적으로 완료되었습니다.');
        router.push({ path: `/order` });
    } catch (error) {
        console.error('수주 등록 중 오류가 발생했습니다.', error);
        alert('수주 등록 중 오류가 발생했습니다.');
    }
};
</script>

<style>
.order-regist-content11 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: calc(100% - 220px);
}

.order-regist11 {
    text-align: center;
}

.order-list-box1 {
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
    max-width: 1200px;
    margin: 20px auto;
    gap: 1px;
}

.order-table1,
.order-table2,
.order-table3,
.order2-table4,
.order2-table5 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.order-table1 th,
.order-table1 td,
.order-table2 th,
.order-table2 td,
.order-table3 th,
.order-table3 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.order2-table4 th,
.order2-table4 td,
.order2-table5 th,
.order2-table5 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 600px;
}

.order-table1 th,
.order-table2 th,
.order-table3 th,
.order2-table4 th,
.order2-table5 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.order-table1 td,
.order-table2 td,
.order-table3 td,
.order2-table4 td,
.order2-table5 td {
    height: 40px;
}

.order-dropdown1 {
    position: relative;
    display: inline-block;
}

.order-dropdown-btn1,
.order-pdf1-btn {
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 6px 30px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    color: #0C2092;
}

.order-dropdown-content1 {
    display: none;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 10px;
    width: 100%;
}

.order-dropdown-content1 a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ccc;
}

.order-dropdown-content1 a:hover {
    background-color: #d5e6ff;
}

.order-dropdown1:hover .order-dropdown-content1 {
    display: block;
}

.contract-number-div33 {
    display: flex;
    align-items: center;
}

.contract-number-box33 {
    width: calc(100% - 50px);
    height: 35px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px 0 0 5px;
    box-sizing: border-box;
    font-family: GmarketSansMedium;
    font-size: 15px;
}

.contract-number-btn33 {
    border-radius: 0 5px 5px 0;
    border: 2px solid #0C2092;
    height: 35px;
    background-color: #0C2092;
    color: white;
    font-size: 11px;
    cursor: pointer;
    margin-left: -1px;
    padding: 0 10px;
}

.contract-test333 {
    width: 250px;
}

.order-attachment33 {
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* 수직 방향으로 위에서 아래로 정렬 */
    align-items: center;
    position: relative;
    width: 100%;
    max-width: 1400px;
    background-color: #d5e6ff;
    border-radius: 10px;
    margin-bottom: 50px;
    padding: 20px; /* 패딩 추가 */
    box-sizing: border-box; /* 패딩이 포함되도록 설정 */
    height: auto; /* height를 auto로 설정하여 내용물에 맞게 늘어나도록 설정 */
}

.file-list34 {
    display: flex;
    align-items: center;
    background-color: white;
    width: 80%; /* 부모 요소의 너비를 기준으로 설정 */
    max-width: 800px;
    min-height: 70px; /* 최소 높이 설정 */
    border-radius: 10px;
    padding: 20px;
    margin-top: 10px; /* 각 파일 간의 간격을 위해 margin-top 추가 */
    box-sizing: border-box; /* 패딩이 포함되도록 설정 */
    margin-bottom: 10px; /* 각 파일 간의 간격을 위해 margin-bottom 추가 */
}


.file-icon {
    font-size: 24px;
    margin-right: 10px; /* 아이콘과 파일명 사이의 간격을 위해 margin-right 추가 */
}

.file-name {
    font-size: 18px;
    word-break: break-all; /* 긴 파일명이 있을 경우 줄바꿈을 하도록 설정 */
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
    margin-top: 20px; /* 파일 목록 아래에 간격 추가 */
}

.order-regist-btn-div33 {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.order-regist-btn33 {
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

.order-regist-btn33:hover {
    background-color: #007bff;
}
</style>
