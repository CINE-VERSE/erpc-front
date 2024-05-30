<template>
    <div class="order-content">
        <div class="order-search">
            <h1 class="maintext">영업기회 조회 내역</h1>
            <h3 class="maintext2">{{ salesOppData.salesOppStatus.salesOppStatus }}</h3>
            <div class="order-btn">
                <button class="order-request" @click="openStatusPopup">상태변경</button>
                <button class="order-edit" @click="goToEditPage">수정</button>
                <button class="order-delete" @click="deletesalesOpp">삭제</button>
            </div>
            <div class="order-list-box2">
                <table class="order2-table1">
                    <thead>
                        <tr>
                            <th>거래처명</th>
                            <th>거래처 담당자</th>
                            <th>거래처 주소</th>
                            <th>연락처</th>
                            <th>이메일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ salesOppData.oppAccountName }}</td>
                            <td>{{ salesOppData.oppAccountPic }}</td>
                            <td>{{ salesOppData.oppAccountLocation }}</td>
                            <td>{{ salesOppData.oppAccountContact }}</td>
                            <td>{{ salesOppData.oppAccountEmail }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="order2-table3">
                    <thead>
                        <tr>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ salesOppData.oppAccountNote }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="order-process-box">
            <h1 class="order-process-text">Process</h1>
            <div class="order-process-box-detail">
                <div class="order-process-info">
                    <h4 class="order-process-writer">{{ salesOppData.employee.employeeName }} {{ salesOppData.employee.employeeRank.employeeRank }}</h4>
                    <p class="order-process-date">{{ salesOppData.orderDate }}</p>
                </div>
                <button class="order-process-detail">
                    프로젝트 진행 정보 공유합니다~
                </button>
                <div class="order-process-btn">
                    <button class="order-process-edit" @click="openEditPopup">수정</button>
                    <button class="order-process-delete" @click="deleteProcess">삭제</button>
                </div>
                <div class="order-process-reply">
                    <input type="text" v-model="newProcessDetail" class="order-process-reply-box" placeholder="내용을 입력해주세요.">
                    <button class="order-process-regist" @click="registerProcess">등록하기</button>
                </div>
            </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 삭제 팝업 창 -->
    <div class="popup" v-if="showDeletePopup">
        <div class="popup-content">
            <p>팝업 창에 표시될 내용</p>
            <input type="text" v-model="deleteReason" placeholder="삭제 이유를 입력해주세요">
            <button @click="confirmDelete">확인</button>
            <button class="close-btn" @click="closeDeletePopup">닫기</button>
        </div>
    </div>

    <!-- 상태변경 팝업 창 -->
    <div class="popup" v-if="showStatusPopup">
        <div class="popup-content">
            <h3>상태변경</h3>
            <select v-model="newStatus">
                <option value="기회 인지">기회 인지</option>
                <option value="협상">협상</option>
                <option value="종료">종료</option>
            </select>
            <button @click="confirmStatusChange">확인</button>
            <button class="close-btn" @click="closeStatusPopup">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const salesOppData = ref({});
const showDeletePopup = ref(false);
const showStatusPopup = ref(false);
const deleteReason = ref('');
const newStatus = ref('');
const newProcessDetail = ref('');
const editProcessDetail = ref('');

// 데이터를 가져오는 함수
const fetchData = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        const response = await axios.get(`http://localhost:7775/sales_opportunity/${salesOppId}`);
        salesOppData.value = response.data;
    } catch (error) {
        console.error('Error fetching salesOpp data:', error);
    }
};

// 페이지 로드 시 데이터 가져오기
fetchData();

const goToEditPage = () => {
    router.push({ path: `/salesopp/modify/${route.params.salesOppId}` });
};

const deletesalesOpp = () => {
    showDeletePopup.value = true;
};

const closeDeletePopup = () => {
    showDeletePopup.value = false;
};

const confirmDelete = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        const response = await axios.post('http://localhost:7775/sales_opportunity/delete', {
            salesOppDeleteRequestReason: deleteReason.value,
            salesOpp: salesOppData.value
        });
        console.log('salesOpp delete request sent successfully:', response.data);
        alert('삭제 요청이 성공적으로 완료되었습니다.');
        router.push('/salesOpp/list'); // 삭제 요청 후 이동
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    } finally {
        closeDeletePopup();
    }
};

const openStatusPopup = () => {
    showStatusPopup.value = true;
};

const closeStatusPopup = () => {
    showStatusPopup.value = false;
};

const confirmStatusChange = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        // 변경할 상태의 ID를 사용하여 요청을 보냅니다
        const statusId = getStatusIdByName(newStatus.value);
        const response = await axios.patch(`http://localhost:7775/sales_opportunity/status/${salesOppId}`, {
            salesOppStatus: { salesOppStatusId: statusId }
        });
        salesOppData.value.salesOppStatus.salesOppStatus = newStatus.value; // 상태 업데이트
        console.log('salesOpp status change request sent successfully:', response.data);
        alert('상태가 성공적으로 변경되었습니다.');
    } catch (error) {
        console.error('Error changing salesOpp status:', error);
        alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
        closeStatusPopup();
    }
};

// 상태 이름으로 상태 ID를 조회하는 함수 (예: 서버에서 가져온 상태 목록을 사용)
const getStatusIdByName = (statusName) => {
    const statusMapping = {
        '기회 인지': 1,
        '협상': 2,
        '종료': 3
    };
    return statusMapping[statusName];
};

const registerProcess = async () => {
    const salesOppId = route.params.salesOppId;

    try {
        // 서버로 보낼 프로세스 데이터를 구성합니다.
        const newProcess = {
            salesOppId: salesOppId,
            employee: { 
                employeeId: 5 // 하드코딩된 employeeId
            },
            // 필요한 다른 데이터들
        };

        // 서버에 프로세스 등록 요청을 보냅니다.
        const response = await axios.post(`http://localhost:7775/sales_opp_note/regist`, {
            salesOppNote: newProcessDetail.value,
            salesOppId: salesOppId
        });

        // 등록된 프로세스 데이터를 처리합니다.
        salesOppData.value.processDetails.push(response.data);
        newProcessDetail.value = '';
        alert('등록됨.');
    } catch (error) {
        console.error('Process 등록 중 오류 발생:', error);
        alert('Process 등록에 실패했습니다.');
    }
};
// Open edit popup
const openEditPopup = () => {
    editProcessDetail.value = salesOppData.value.salesOppNote;
    showEditPopup.value = true;
};

const closeEditPopup = () => {
    showEditPopup.value = false;
};

// Confirm edit
const confirmEdit = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        const response = await axios.patch(`http://localhost:7775/sales_opp_note/modify/${salesOppId}`, {
            salesOppNote: editProcessDetail.value
        });
        salesOppData.value.salesOppNote = response.data.salesOppNote;
        alert('수정됨.');
    } catch (error) {
        console.error('Error updating process:', error);
    } finally {
        closeEditPopup();
    }
};

// Delete process
const deleteProcess = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        const response = await axios.patch(`http://localhost:7775/sales_opp_note/delete/${salesOppId}`);
        salesOppData.value.salesOppNote = response.data.salesOppNote;
        alert('삭제됨.');
    } catch (error) {
        console.error('Error deleting process:', error);
        
    }
};
</script>

<style>
@import url('@/assets/css/order/OrderContents.css');
</style>