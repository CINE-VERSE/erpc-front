<template>
    <div class="regist-content" v-if="contractData">
        <h1>계약서 수정</h1>
        <div class="contract-list-box1">
            <table class="contract2-table1">
                <thead>
                    <tr>
                        <th>계약서 코드</th>
                        <th>계약 금액</th>
                        <th>작성 일자</th>
                        <th>삭제 일자</th>
                        <th>마감 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ contractData.contractCode }}</td>
                        <td>{{ contractData.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ contractData.contractDate }}</td>
                        <td>{{ contractData.contractDeleteDate }}</td>
                        <td>{{ contractData.contractDueDate }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract2-table2">
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
                    <tr v-for="product in contractData.contractProduct" :key="product.contractProductId">
                        <td>{{ product.product.productCode }}</td>
                        <td>{{ product.product.productName }}</td>
                        <td>{{ product.contractProductCount }}</td>
                        <td>{{ product.product.productPrice.toLocaleString() }}</td>
                        <td>{{ product.contractSupplyPrice.toLocaleString() }}</td>
                        <td>{{ product.contractProductionNote }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="contract2-table3">
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
            <table class="contract2-table4">
                <thead>
                    <tr>
                        <th>담당자</th>
                        <th>거래처</th>
                        <th>수주 금액</th>
                        <th>납기 일자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ contractData.employee.employeeName }}</td>
                        <td>{{ contractData.account.accountName }}</td>
                        <td>{{ contractData.contractTotalPrice.toLocaleString() }}</td>
                        <td>{{ contractData.contractDueDate }}</td>
                        <td><input type="text" v-model="contractNote" class="contract-test5"></td>
                    </tr>
                </tbody>
            </table>
            <table class="contract2-table5">
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
                            <input type="text" v-model="downPayment" class="contract-test6">
                        </td>
                        <td>
                            <input type="text" v-model="progressPayment" class="contract-test7" :disabled="searchBy === '일시납부'">
                        </td>
                        <td>
                            <input type="text" v-model="balance" class="contract-test8" :disabled="searchBy === '일시납부'">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="contract-attachment">
            <h2 class="contract-file">첨부파일</h2>
            <div v-for="(file, index) in contractData.contractFile" :key="file.fileId" class="file-list">
                <span class="file-icon">📄</span>
                <span class="file-name">{{ file.originName }}</span>
                <button @click="downloadFile(file.accessUrl)">다운로드</button>
            </div>
            <input type="file" @change="handleFileUpload" multiple />
        </div>
        <button @click="updateContract" class="contract-regist-btn">계약 수정하기</button>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const contractData = ref(null);
const files = ref([]);

const contractNote = ref('');
const downPayment = ref(0);
const progressPayment = ref(0);
const balance = ref(0);
const searchBy = ref('분할납부');

onMounted(async () => {
    const contractId = route.params.contractId;
    try {
        const response = await axios.get(`http://localhost:7775/contract/${contractId}`, { withCredentials: true });
        contractData.value = response.data;
        populateFields(contractData.value);
    } catch (error) {
        console.error('Error fetching contract data:', error);
    }
});

const populateFields = (data) => {
    contractNote.value = data.contractNote;
    downPayment.value = data.downPayment;
    progressPayment.value = data.progressPayment;
    balance.value = data.balance;
    searchBy.value = data.contractCategory.contractCategoryId === 1 ? '일시납부' : '분할납부';
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

const setSearchBy = (criteria) => {
    searchBy.value = criteria;
    if (criteria === '일시납부') {
        progressPayment.value = 0;
        balance.value = 0;
    }
};

const updateContract = async () => {
    const contractId = route.params.contractId;

    const contract = {
        contractId: contractId,
        contractNote: contractNote.value,
        contractTotalPrice: contractData.value.contractTotalPrice,
        contractDueDate: contractData.value.contractDueDate,
        downPayment: downPayment.value,
        progressPayment: progressPayment.value,
        balance: balance.value,
        employee: contractData.value.employee,
        account: contractData.value.account,
        warehouse: contractData.value.warehouse,
        contractProduct: contractData.value.contractProduct.map(product => ({
            contractProductCount: product.contractProductCount,
            contractSupplyPrice: product.contractSupplyPrice,
            contractProductionNote: product.contractProductionNote,
            product: product.product
        }))
    };

    const formData = new FormData();
    formData.append('contract', JSON.stringify(contract));
    files.value.forEach(file => {
        formData.append('files', file);
    });

    try {
        await axios.patch(`http://localhost:7775/contract/modify/${contractId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        alert('계약서가 성공적으로 수정되었습니다.');
        router.push({ path: `/contract/${contractId}` });
    } catch (error) {
        console.error('계약서를 수정하는 중 오류가 발생했습니다.', error);
        alert('계약서를 수정하는 중 오류가 발생했습니다.');
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

.contract-regist {
    text-align: center;
    margin-top: 3%;
}

.contract-list-box1 {
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

.contract-table1,
.contract-table2,
.contract-table3,
.contract-table4,
.contract-table5 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.contract-test1,
.contract-test2 {
    width: 100px;
}

.contract-table1 th,
.contract-table1 td,
.contract-table2 th,
.contract-table2 td,
.contract-table3 th,
.contract-table3 td,
.contract-table4 th,
.contract-table4 td,
.contract-table5 th,
.contract-table5 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
}

.contract-table1 th,
.contract-table1 td,
.contract-table3 th,
.contract-table3 td,
.contract-table4 th,
.contract-table4 td,
.contract-table5 th,
.contract-table5 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 160px;
}

.contract-table1 th,
.contract-table2 th,
.contract-table3 th,
.contract-table4 th,
.contract-table5 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.contract-table1 td,
.contract-table2 td,
.contract-table3 td,
.contract-table4 td,
.contract-table5 td {
    height: 40px;
}

.contract-dropdown1 {
    position: relative;
    display: inline-block;
    width: 160px;
}

.contract-dropdown-btn1,
.contract-pdf1-btn {
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 6px 30px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    color: #0C2092;
}

.contract-dropdown-content1 {
    display: none;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 10px;
    width: 100%;
}

.contract-dropdown-content1 a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ccc;
}

.contract-dropdown-content1 a:hover {
    background-color: #d5e6ff;
}

.contract-dropdown1:hover .contract-dropdown-content1 {
    display: block;
}

.contract-attachment {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    max-width: 1400px;
    height: 200px;
    background-color: #d5e6ff;
    border-radius: 10px;
    margin-bottom: 50px;
}

.contract-attachment-header {
    display: flex;
    align-items: center;
    padding: 5px;
    margin-bottom: -20px;
}

.contract-pdfimage {
    width: 30px;
    padding-bottom: 5px;
    padding-left: 5px;
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

.contract-test3,
.contract-test5,
.contract-test6,
.contract-test7,
.contract-test8 {
    height: 35px;
}

.contract-regist-btn {
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
