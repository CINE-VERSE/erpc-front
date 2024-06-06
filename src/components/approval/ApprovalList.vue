<template>
    <div class="approval-content1">
        <div class="approval-search">
            <h1 class="approval-search-text">결재 승인 요청 목록</h1>
        </div>
        <div class="approval-box">
            <div class="search-date">
                <input type="date" class="search-start-date-box" id="search-start-date-box" v-model="startDate">
                <span>-</span>
                <input type="date" class="search-end-date-box" id="search-end-date-box" v-model="endDate">
                <select v-model="selectedApprovalType" @change="handleDropdownChange" class="approval-type-select">
                    <option value="quotation">견적서 결재</option>
                    <option value="contract">계약서 결재</option>
                    <option value="shipment">수주 결재</option>
                </select>
                <select v-model="selectedApprovalStatus" @change="handleDropdownChange" class="approval-status-select">
                    <option value="">전체</option>
                    <option value="결재요청">결재요청</option>
                    <option value="승인">승인</option>
                    <option value="반려">반려</option>
                </select>
                <input type="text" class="approval-search-input" v-model="searchQuery" :placeholder="placeholderText" @input="toUpperCase">
                <button class="approval-search-btn" @click="applyFilter">조회하기</button>
            </div>
        </div>

        <div class="approval-list-box">
            <template v-if="selectedApprovalType === 'quotation'">
                <h2>견적서 결재</h2>
                <table class="approval-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>견적서 코드</th>
                            <th>거래처명</th>
                            <th>견적금액</th>
                            <th>요청일자</th>
                            <th>결재상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(approval, index) in sortedFilteredApprovals" :key="approval.quotationApprovalId" @click="goToApprovalContents(approval.quotationApprovalId)">
                            <td>{{ sortedFilteredApprovals.length - index }}</td>
                            <td>{{ approval.quotation.quotationCode }}</td>
                            <td>{{ approval.quotation.account.accountName }}</td>
                            <td>{{ approval.quotation.quotationTotalCost.toLocaleString() }}</td>
                            <td>{{ approval.approvalRequestDate }}</td>
                            <td>{{ approval.approvalStatus.approvalStatus }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <template v-if="selectedApprovalType === 'contract'">
                <h2>계약서 결재</h2>
                <table class="approval-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>계약서 코드</th>
                            <th>거래처명</th>
                            <th>계약금액</th>
                            <th>요청일자</th>
                            <th>결재상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(approval, index) in sortedFilteredContractApprovals" :key="approval.contractApprovalId" @click="goToContractContents(approval.contractApprovalId)">
                            <td>{{ sortedFilteredContractApprovals.length - index }}</td>
                            <td>{{ approval.contract.contractCode }}</td>
                            <td>{{ approval.contract.account.accountName }}</td>
                            <td>{{ approval.contract.contractTotalPrice.toLocaleString() }}</td>
                            <td>{{ approval.approvalRequestDate }}</td>
                            <td>{{ approval.approvalStatus.approvalStatus }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <template v-if="selectedApprovalType === 'shipment'">
                <h2>수주 결재</h2>
                <table class="approval-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>프로젝트 코드</th>
                            <th>거래처명</th>
                            <th>주문금액</th>
                            <th>요청일자</th>
                            <th>결재상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(approval, index) in sortedFilteredShipmentApprovals" :key="approval.shipmentApprovalId" @click="goToShipmentContents(approval.shipmentApprovalId)">
                            <td>{{ sortedFilteredShipmentApprovals.length - index }}</td>
                            <td>{{ approval.order.transaction.transactionCode }}</td>
                            <td>{{ approval.order.account.accountName }}</td>
                            <td>{{ approval.order.orderTotalPrice.toLocaleString() }}</td>
                            <td>{{ approval.approvalRequestDate }}</td>
                            <td>{{ approval.approvalStatus.approvalStatus }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const approvals = ref([]);
const contractApprovals = ref([]);
const shipmentApprovals = ref([]);
const startDate = ref('');
const endDate = ref('');
const searchQuery = ref('');
const selectedApprovalType = ref('quotation');
const selectedApprovalStatus = ref('');
const filteredApprovals = ref([]);
const filteredContractApprovals = ref([]);
const filteredShipmentApprovals = ref([]);

const placeholderText = computed(() => {
    switch (selectedApprovalType.value) {
        case 'quotation':
            return '견적서 코드로 조회';
        case 'contract':
            return '계약서 코드로 조회';
        case 'shipment':
            return '수주 코드로 조회';
        default:
            return '코드로 조회';
    }
});

const toUpperCase = () => {
    searchQuery.value = searchQuery.value.toUpperCase();
};

const handleDropdownChange = () => {
    searchQuery.value = '';  // Clear the search input
    applyFilter();           // Apply filter immediately
};

onMounted(async () => {
    await fetchApprovals();
    await fetchContractApprovals();
    await fetchShipmentApprovals();
    applyFilter();
});

watch([selectedApprovalStatus, selectedApprovalType], () => {
    applyFilter();
});

const fetchApprovals = async () => {
    try {
        const response = await axios.get('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/approval/quotation');
        approvals.value = response.data;
        filteredApprovals.value = approvals.value;
    } catch (error) {
        console.error('Error fetching approvals:', error);
    }
};

const fetchContractApprovals = async () => {
    try {
        const response = await axios.get('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/approval/contract');
        contractApprovals.value = response.data;
        filteredContractApprovals.value = contractApprovals.value;
    } catch (error) {
        console.error('Error fetching contract approvals:', error);
    }
};

const fetchShipmentApprovals = async () => {
    try {
        const response = await axios.get('http://localhost:7775/approval/shipment');
        shipmentApprovals.value = response.data;
        filteredShipmentApprovals.value = shipmentApprovals.value;
    } catch (error) {
        console.error('Error fetching shipment approvals:', error);
    }
};

const resetApprovalStatus = () => {
    selectedApprovalStatus.value = '';
};

const applyFilter = () => {
    filteredApprovals.value = approvals.value;
    filteredContractApprovals.value = contractApprovals.value;
    filteredShipmentApprovals.value = shipmentApprovals.value;

    if (startDate.value && endDate.value) {
        filteredApprovals.value = filteredApprovals.value.filter(approval => {
            return approval.approvalRequestDate >= startDate.value && approval.approvalRequestDate <= endDate.value;
        });
        filteredContractApprovals.value = filteredContractApprovals.value.filter(approval => {
            return approval.approvalRequestDate >= startDate.value && approval.approvalRequestDate <= endDate.value;
        });
        filteredShipmentApprovals.value = filteredShipmentApprovals.value.filter(approval => {
            return approval.approvalRequestDate >= startDate.value && approval.approvalRequestDate <= endDate.value;
        });
    }

    if (searchQuery.value) {
        filteredApprovals.value = filteredApprovals.value.filter(approval =>
            approval.quotation.quotationCode.includes(searchQuery.value)
        );
        filteredContractApprovals.value = filteredContractApprovals.value.filter(approval =>
            approval.contract.contractCode.includes(searchQuery.value)
        );
        filteredShipmentApprovals.value = filteredShipmentApprovals.value.filter(approval =>
            approval.order.transaction.transactionCode.includes(searchQuery.value)
        );
    }

    if (selectedApprovalStatus.value) {
        filteredApprovals.value = filteredApprovals.value.filter(approval =>
            approval.approvalStatus.approvalStatus === selectedApprovalStatus.value
        );
        filteredContractApprovals.value = filteredContractApprovals.value.filter(approval =>
            approval.approvalStatus.approvalStatus === selectedApprovalStatus.value
        );
        filteredShipmentApprovals.value = filteredShipmentApprovals.value.filter(approval =>
            approval.approvalStatus.approvalStatus === selectedApprovalStatus.value
        );
    }

    // Sort filtered results by shipmentApprovalId in descending order
    filteredApprovals.value.sort((a, b) => b.shipmentApprovalId - a.shipmentApprovalId);
    filteredContractApprovals.value.sort((a, b) => b.shipmentApprovalId - a.shipmentApprovalId);
    filteredShipmentApprovals.value.sort((a, b) => b.shipmentApprovalId - a.shipmentApprovalId);
};

const sortedFilteredApprovals = computed(() => {
    return filteredApprovals.value.sort((a, b) => b.shipmentApprovalId - a.shipmentApprovalId);
});

const sortedFilteredContractApprovals = computed(() => {
    return filteredContractApprovals.value.sort((a, b) => b.shipmentApprovalId - a.shipmentApprovalId);
});

const sortedFilteredShipmentApprovals = computed(() => {
    return filteredShipmentApprovals.value.sort((a, b) => b.shipmentApprovalId - a.shipmentApprovalId);
});

const goToApprovalContents = (quotationApprovalId) => {
    router.push({ path: `/approval/quotation/${quotationApprovalId}` });
};

const goToContractContents = (contractApprovalId) => {
    router.push({ path: `/approval/contract/${contractApprovalId}` });
};

const goToShipmentContents = (shipmentApprovalId) => {
    router.push({ path: `/approval/order/${shipmentApprovalId}` });
};
</script>


<style>
.approval-content1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%; /* 추가 */
    box-sizing: border-box; /* 추가 */
}

.approval-search {
    text-align: center;
    width: 100%; /* 추가 */
}

.approval-search-text {
    margin-top: 5%;
    margin-bottom: 30px;
}

.search-date {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap; /* 추가 */
}

.search-start-date-box,
.search-end-date-box {
    height: 40px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    width: 200px;
    font-size: 14px;
}

.approval-type-select,
.approval-status-select {
    height: 40px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #e5f0ff;
    color: #0c2092;
    outline: none;
    width: 200px;
}

.approval-search-input {
    height: 40px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #e5f0ff;
    color: #0c2092;
    outline: none;
    width: 200px;
}

.approval-search-btn {
    height: 40px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #0C2092;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.approval-search-btn:hover {
    background-color: #007bff;
}

.approval-list-box {
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
    max-width: 1400px;
    margin: 20px auto;
    margin-bottom: 7%;
    gap: 1px;
    overflow-x: auto; /* 추가 */
}

.approval-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    table-layout: auto; /* 추가 */
}

.approval-table th,
.approval-table td {
    text-align: center;
    border: 1px solid #ccc;
    min-width: 160px; /* 수정 */
    padding: 8px;
    font-family: GmarketSansMedium;
}

.approval-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.approval-table tr:hover {
    background-color: #d5e6ff;
    cursor: pointer;
}

</style>
