<template>
    <div class="regist-content">
        <div class="order-regist">
            <h1>수주 등록</h1>
        </div>
        <div class="order-search-box">
            <h3>계약서 불러오기</h3>
            <div class="contract-number">
                <p class="contract-number-text">계약서 코드</p>
                <input type="text" v-model="contractCode" class="contract-number-box" placeholder="계약서 코드를 입력해주세요.">
            </div>
            <div class="order-search-btn-div1">
                <button @click="fetchContractData" class="order-search-btn1">조회하기</button>
            </div>
        </div>
        <div class="order-list-box1">
            <table class="order-table1">
                <thead>
                    <tr>
                        <th>프로젝트 코드</th>
                        <th>담당자</th>
                        <th>거래처 코드</th>
                        <th>거래처명</th>
                        <th>수주 금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ contractData.contractCode }}</td>
                        <td>{{ contractData.employee.employeeName }}</td>
                        <td>{{ contractData.account.accountCode }}</td>
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
            <table class="order-table4">
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
                        <td class="test">{{ contractData.contractCategory.contractCategory }}</td>
                        <td>{{ contractData.downPayment }}</td>
                        <td>{{ contractData.progressPayment }}</td>
                        <td>{{ contractData.balance }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="order-table5">
                <thead>
                    <tr>
                        <th>계약서 코드</th>
                        <th>계약 일자</th>
                        <th>계약 납기일자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ contractData.contractCode }}</td>
                        <td>{{ contractData.contractDate }}</td>
                        <td>{{ contractData.contractDueDate }}</td>
                        <td>{{ contractData.contractNote }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="order-attachment">
            <div class="order-attachment-header">
                <h2 class="order-file">첨부파일</h2>
                <img src="@/assets/img/pdf.png" class="order-pdfimage">
            </div>
            <div class="order-attachment-content">
                <div class="file-list" v-for="(file, index) in files" :key="index">
                    <span class="file-icon">📄</span>
                    <span class="file-name">{{ file.name }}</span>
                    <button @click="removeFile(index)">삭제</button>
                </div>
            </div>
            <input type="file" @change="handleFileUpload" multiple />
        </div>
        <div class="order-regist-btn-div1">
            <button class="order-regist-btn1" @click="registerOrder">수주 등록하기</button>
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
        const response = await axios.get('http://localhost:7775/contract/code', {
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
    files.value.push(...uploadedFiles);
};

const removeFile = (index) => {
    files.value.splice(index, 1);
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

const registerOrder = async () => {
    const orderData = {
        contactDate: contractData.value.contractDate,
        orderTotalPrice: contractData.value.contractTotalPrice,
        orderDueDate: contractData.value.contractDueDate,
        totalBalance: contractData.value.balance,
        downPayment: contractData.value.downPayment,
        progressPayment: contractData.value.progressPayment,
        balance: contractData.value.balance,
        orderNote: contractData.value.contractNote,
        employee: {
            employeeId: contractData.value.employee.employeeId
            // employeeCode: contractData.value.employee.employeeCode
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

    const formData = new FormData();
    formData.append('order', JSON.stringify(orderData));
    files.value.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post('http://localhost:7775/order/regist', formData, {
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
.regist-content {
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.order-regist {
    text-align: center;
    margin-top: 3%;
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
.order-table4,
.order-table5 {
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
.order-table3 td,
.order-table4 th,
.order-table4 td,
.order-table5 th,
.order-table5 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.order-table1 th,
.order-table2 th,
.order-table3 th,
.order-table4 th,
.order-table5 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.order-table1 td,
.order-table2 td,
.order-table3 td,
.order-table4 td,
.order-table5 td {
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

.test1,
.test2 {
    width: 300px;
}

.order-search-box {
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
    margin: 20px auto;
    gap: 1px;
    max-width: 400px;
}

.contract-number {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 수직 방향 중앙 정렬 */
}

.contract-number-text {
    display: flex;
    align-items: center;
    text-align: center;
    margin-top: 2px;
    margin-bottom: 2px;
}

.contract-number-box {
    flex-grow: 1;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    width: 320px;
    font-size: 18px;
}

.order-search-btn-div1,
.order-regist-btn-div1 {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.order-search-btn1,
.order-regist-btn1 {
    padding: 10px 20px;
    font-size: 16px;
    text-align: center;
    border: none;
    border-radius: 10px;
    background-color: #0C2092;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 15px;
    margin-top: 15px;
}

.order-search-btn1 {
    max-width: 320px;
}

.order-regist-btn1 {
    width: 320px;
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 100px;
}

.order-attachment {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 200px;
    background-color: #d5e6ff;
    border-radius: 10px;
    margin-bottom: 50px;
}

.order-attachment-header {
    display: flex;
    align-items: center;
    padding: 5px;
    margin-bottom: -20px;
}

.order-pdfimage {
    width: 30px;
    padding-bottom: 5px;
    padding-left: 5px;
}

.order-attachment-content {
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
</style>
