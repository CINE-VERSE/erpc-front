<template>
    <div class="order-content">
        <div class="order-search">
            <h1 class="maintext">영업기회 조회 내역</h1>
            <h3 class="maintext2">{{ salesOppData.salesOppStatus ? salesOppData.salesOppStatus.salesOppStatus : '' }}</h3>
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
                    <div class="order-process-box-detail" v-for="(note, index) in filteredSalesOppNoteData" :key="index">
                        <div class="order-process-info" v-if="note.employee">
                            <h4 class="order-process-writer">{{ note.employee.employeeName }} {{ note.employee.employeeRank ? note.employee.employeeRank.employeeRank : '' }}</h4>
                            <p class="order-process-date">{{ note.salesOppNoteDate }}</p>
                        </div>
                        <div class="order-process-detail">
                            {{ note.salesOppNote }}
                        </div>
                        <div class="order-process-btn">
                            <button class="order-process-delete" @click="deleteProcess(note.salesOppNoteId)">삭제</button>
                        </div>
                    </div>
                    <div class="order-process-reply">
                        <input type="text" v-model="newProcessDetail" class="order-process-reply-box" placeholder="내용을 입력해주세요.">
                        <button class="order-process-regist" @click="registerProcess">등록하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

 
    <div class="popup-overlay77" v-if="showDeletePopup">
        <div class="popup-content77">
            <h2>삭제 요청 사유 입력</h2>
            <textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요"></textarea>
            <button @click="confirmDelete">확인</button>
            <button @click="closePopup">취소</button>
        </div>
    </div>

    <!-- 상태변경 팝업 창 -->
    <div class="popup-overlay77" v-if="showStatusPopup">
        <div class="popup-content" style="position: fixed; top: 50%; left: 57%; transform: translate(-50%, -50%);">
            <h3>상태변경</h3>
            <select v-model="newStatus" class="styled-select">
            <option value="등록">등록</option>
            <option value="진행중">진행중</option>
            <option value="성사">성사</option>
            <option value="불발">불발</option>
        </select>
            <button @click="confirmStatusChange">확인</button>
            <button class="close-btn" @click="closeStatusPopup">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const salesOppData = ref({});
const salesOppNoteData = ref([]);
const showDeletePopup = ref(false);
const showStatusPopup = ref(false);
const deleteReason = ref('');
const newStatus = ref('');
const newProcessDetail = ref('');


// localStorage에서 userId 가져오기
const userId = localStorage.getItem('userId');
if (!userId) {
    console.error('User ID not found in localStorage.');
}

// 데이터를 가져오는 함수
const fetchData = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        // 영업기회 데이터를 가져옵니다.
        const response = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity/${salesOppId}`);
        salesOppData.value = response.data;

        // 각 프로세스에 대해 salesOppNote 데이터를 가져옵니다.
        const noteResponse = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opp_note`);
        salesOppNoteData
.value = noteResponse.data;
        
        console.log('SalesOppData:', salesOppData.value);
        console.log('SalesOppNoteData:', salesOppNoteData.value);
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
        const response = await axios.post('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity/delete', {
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
        const response = await axios.patch(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity/status/${salesOppId}`, {
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
        '등록': 1,
        '진행중': 2,
        '성사': 3,
        '불발': 4
    };
    return statusMapping[statusName];
};

const registerProcess = async () => {
    const salesOppId = route.params.salesOppId;
    
    // salesOpp 객체에 salesOppId를 넣어줍니다.
    const salesOpp = {
        salesOppId: salesOppId
    };

    // employee 객체에 localStorage에서 가져온 userId를 employeeId로 설정합니다.
    const employee = {
        employeeId: userId
    };

    try {
        // 서버로 보낼 프로세스 데이터를 구성합니다.
        const newProcess = {
            salesOppNote: newProcessDetail.value,
            salesOpp: salesOpp, // salesOpp 객체를 추가합니다.
            employee: employee,
            // 필요한 다른 데이터들
        };

        // 서버에 프로세스 등록 요청을 보냅니다.
        const response = await axios.post(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opp_note/regist`, newProcess);

        // 등록된 프로세스 데이터를 처리합니다.
        salesOppNoteData.value.push(response.data);
        newProcessDetail.value = '';
        
        // 등록 완료 후 알림 창 표시
        alert('참고사항이 등록되었습니다.');

          location.reload();

    } catch (error) {
        console.error('Process 등록 중 오류 발생:', error);
        alert('Process 등록에 실패했습니다.');
    }
};

// Delete process
const deleteProcess = async (salesOppNoteId) => {
    try {
        const response = await axios.patch(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opp_note/delete/${salesOppNoteId}`);
        salesOppNoteData.value = salesOppNoteData.value.filter(note => note.salesOppNoteId !== salesOppNoteId);
        alert('삭제됨.');
    } catch (error) {
        console.error('Error deleting process:', error);
    }
};

const filteredSalesOppNoteData = computed(() => {
    if (!salesOppData.value || !salesOppData.value.salesOppId || !salesOppNoteData.value) {
        return [];
    }

    const salesOppId = salesOppData.value.salesOppId;
    return salesOppNoteData.value.filter(note => note.salesOpp && note.salesOpp.salesOppId === salesOppId);
});
</script>

<style>
@import url('@/assets/css/order/OrderContents.css');
.popup-overlay77 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content77 {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    max-width: 400px;
    width: 100%;
}

.popup-content77 h2 {
    margin-bottom: 15px;
}

.popup-content77 textarea {
    width: 90%;
    height: 100px;
    margin-bottom: 15px;
}

.popup-content77 button {
    margin: 5px;
}
.styled-select {
    width: 30%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    background-position-x: 95%;
    background-position-y: 50%;
    cursor: pointer;
}
</style>