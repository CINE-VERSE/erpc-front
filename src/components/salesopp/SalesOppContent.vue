<template>
    <div class="order-content">
        <div class="order-search">
            <h1 class="maintext">영업기회 조회 내역</h1>
            <h3 class="maintext2">{{ salesOppData.salesOppStatus?.salesOppStatus || '' }}</h3>
            <div class="order-btn">
                <button class="order-request" @click="openStatusPopup">상태변경</button>
                <button class="order-edit" :disabled="editDisabled" @click="goToEditPage">수정</button>
                <button class="order-delete" v-if="!deleteRequested" @click="deletesalesOpp">삭제요청</button>
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
                <div class="order22-process-box">
                    <h1 class="order22-process-text">Process</h1>
                    <div class="order22-process-box-detail" v-for="(note, index) in filteredSalesOppNoteData" :key="index">
                        <div class="order22-process-info" v-if="note.employee">
                            <h4 class="order22-process-writer">{{ note.employee.employeeName }} {{ note.employee.employeeRank?.employeeRank || '' }}</h4>
                            <p class="order22-process-date">{{ note.salesOppNoteDate }}</p>
                        </div>
                        <div class="order22-process-detail">
                            {{ note.salesOppNote }}
                        </div>
                        <div class="order22-process-btn">
                            <button class="order22-process-delete" @click="deleteProcess(note.salesOppNoteId)">삭제</button>
                        </div>
                    </div>
                    <div class="order22-process-reply">
                        <input type="text" v-model="newProcessDetail" class="order22-process-reply-box" placeholder="내용을 입력해주세요.">
                        <button class="order22-process-regist" @click="registerProcess">등록하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 삭제 요청 팝업 -->
    <div v-if="showDeletePopup" class="popup-overlay">
        <div class="popup-content">
            <h2>삭제 요청 사유 입력</h2>
            <textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요"></textarea>
            <button @click="confirmDelete" class="confirm-btn">확인</button>
            <button @click="closeDeletePopup" class="cancel-btn">취소</button>
        </div>
    </div>
    <!-- 상태 변경 팝업 -->
    <div class="popup-overlay77" v-if="showStatusPopup">
        <div class="popup-content">
            <h3>상태변경</h3>
            <select v-model="newStatus" class="styled-select">
                <option value="등록">등록</option>
                <option value="진행중">진행중</option>
                <option value="성사">성사</option>
                <option value="불발">불발</option>
            </select>
            <button @click="confirmStatusChange" class="confirm-btn">확인</button>
            <button class="cancel-btn" @click="closeStatusPopup">닫기</button>
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
const showDeletePopup = ref(false); // 삭제 팝업 제어를 위한 변수
const showStatusPopup = ref(false);
const deleteReason = ref('');
const newStatus = ref('');
const newProcessDetail = ref('');
const isLoading = ref(true);
const deleteRequested = ref(false); // 삭제 요청 여부를 나타내는 변수

const userId = localStorage.getItem('userId');
if (!userId) {
    console.error('User ID not found in localStorage.');
}

// 영업기회 데이터를 가져오는 함수
const fetchData = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        // 영업기회 데이터와 참고사항 데이터를 병렬로 가져옵니다.
        const [salesOppResponse, notesResponse] = await Promise.all([
            axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity/${salesOppId}`),
            axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opp_note`)
        ]);
        
        salesOppData.value = salesOppResponse.data;
        salesOppNoteData.value = notesResponse.data.filter(note => note.salesOpp?.salesOppId === salesOppId);

        // 삭제 요청 상태 확인
        const deleteResponse = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/delete/sales_opp/${salesOppId}`);
        if (deleteResponse.data) {
            deleteRequested.value = true; 
        }

    } catch (error) {
        console.error('Error fetching salesOpp data:', error);
    } finally {
        isLoading.value = false; // 로딩 상태 해제
    }
};

// 페이지 로드 시 데이터 가져오기
fetchData();

// 수정 페이지로 이동하는 함수
const goToEditPage = () => {
    if (!deleteRequested.value) {
        router.push({ path: `/salesopp/modify/${route.params.salesOppId}` });
    }
};

// 삭제 요청 팝업 열기
const deletesalesOpp = () => {
    if (!deleteRequested.value) { // 이미 삭제 요청이 보내졌는지 확인
        showDeletePopup.value = true;
    }
};

// 삭제 요청 팝업 닫기
const closeDeletePopup = () => {
    showDeletePopup.value = false;
};

// 삭제 요청을 확인하는 함수
const confirmDelete = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        const response = await axios.post('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity/delete', {
            salesOppDeleteRequestReason: deleteReason.value,
            salesOpp: salesOppData.value
        });
        alert('삭제 요청이 성공적으로 완료되었습니다.');
        router.push('/salesOpp/list'); 
        deleteRequested.value = true; 
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    } finally {
        closeDeletePopup();
    }
};

// 상태 변경 팝업 열기
const openStatusPopup = () => {
    showStatusPopup.value = true;
};

// 상태 변경 팝업 닫기
const closeStatusPopup = () => {
    showStatusPopup.value = false;
};

// 상태 변경 확인
const confirmStatusChange = async () => {
    const salesOppId = route.params.salesOppId;
    try {
        const statusId = getStatusIdByName(newStatus.value);
        const response = await axios.patch(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/sales_opportunity/status/${salesOppId}`, {
            salesOppStatus: { salesOppStatusId: statusId }
        });
        salesOppData.value.salesOppStatus.salesOppStatus = newStatus.value;
        alert('상태가 성공적으로 변경되었습니다.');
    } catch (error) {
        console.error('Error changing salesOpp status:', error);
        alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
        closeStatusPopup();
    }
};

// 상태 이름으로 상태 ID를 조회하는 함수
const getStatusIdByName = (statusName) => {
    const statusMapping = {
        '등록': 1,
        '진행중': 2,
        '성사': 3,
        '불발': 4
    };
    return statusMapping[statusName];
};

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
.confirm-btn {
    background-color: #4CAF50; /* Green */
}

.confirm-btn:hover {
    background-color: #45a049;
}

.close-btn {
    background-color: #f44336; /* Red */
}

.close-btn:hover {
    background-color: #da190b;
}
</style>