<template>
    <div class="customer-content">
        <div class="customer-search">
            <h1 class="maintext">거래처 정보 조회 내역</h1>
            <div class="customer-btn">
                <button class="customer-edit" @click="handleEditAccount" :disabled="deleteRequested">수정</button>
                <button class="customer-delete" v-if="showDeleteButton" @click="deleteAccount">삭제요청</button>
            </div>
        </div>
        <div class="customer-box">
            <div class="customer-code">
                <div class="customer-code-text">거래처 코드</div>
                <button class="customer-code-box">{{ accountData.accountCode }}</button>
            </div>
        </div>
        <div class="customer-content2">
            <div class="customer-list-box33">
                <table class="customer-table1">
                    <thead>
                        <tr>
                            <th>사업자 번호</th>
                            <th>사업자명</th>
                            <th>대표자명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.corporationNum }}</td>
                            <td>{{ accountData.accountName }}</td>
                            <td>{{ accountData.accountRepresentative }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="customer-table2">
                    <thead>
                        <tr>
                            <th>기업 상태 (휴/폐업 여부)</th>
                            <th>법인 여부</th>
                            <th>소재지</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.accountStatus?.accountStatus }}</td>
                            <td>{{ accountData.corporationStatus }}</td>
                            <td>{{ accountData.accountLocation }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="customer-table3">
                    <thead>
                        <tr>
                            <th>업종</th>
                            <th>전화번호</th>
                            <th>이메일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.accountType }}</td>
                            <td>{{ accountData.accountContact }}</td>
                            <td>{{ accountData.accountEmail }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="customer-table4">
                    <thead>
                        <tr>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ accountData.accountNote }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="customer-process-box">
            <h1 class="customer-process-text">Process</h1>
            <div v-for="note in filteredAccountNotes" :key="note.accountNoteId" class="customer-process-box-detail">
                <div class="customer-process-info">
                    <h4 class="customer-process-writer">{{ employeeName }}</h4>
                    <p class="customer-process-date">{{ note.accountNoteDate }}</p>
                </div>
                <button class="customer-process-detail">
                    {{ note.accountNote }}
                </button>
                <div class="customer-process-btn">
                    <button class="customer-process-delete" @click="deleteNote(note.accountNoteId)">삭제하기</button>
                </div>
            </div>
            <div class="customer-process-reply">
                <input type="text" v-model="newNote" id="customer-process-reply-box" class="customer-process-reply-box" placeholder="내용을 입력해주세요.">
                <button class="customer-process-regist" @click="addNote">등록하기</button>
            </div>
        </div>
        <div v-if="showPopup" class="popup-overlay">
            <div class="popup-content">
                <h2>삭제 요청 사유 입력</h2>
                <textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요"></textarea>
                <button @click="confirmDelete">확인</button>
                <button @click="closePopup">취소</button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const accountData = ref({});
const accountNoteData = ref([]);
const showPopup = ref(false);
const deleteReason = ref('');
const newNote = ref('');
const employeeName = ref(''); // 추가: Employee Name을 저장하기 위한 ref
const showDeleteButton = ref(true);
const deleteRequested = ref(false); // 삭제 요청 상태를 저장

const filteredAccountNotes = computed(() => {
    return accountNoteData.value.filter(note => note.accountDeleteDate === null);
});

onMounted(async () => {
    const accountId = route.params.accountId;
    const userId = localStorage.getItem('userId'); // 추가: userId를 localStorage에서 가져오기

    try {
        const accountResponse = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/account/${accountId}`);
        accountData.value = accountResponse.data;

        const noteResponse = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/account_note/${accountId}`);
        accountNoteData.value = noteResponse.data;

        // 추가: userId로 employeeName 가져오기
        const employeeResponse = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/employees/${userId}`);
        employeeName.value = employeeResponse.data.employeeName;

        // 전체 삭제 요청 데이터를 가져오는 API 호출
        const deleteResponse = await axios.get('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/delete/account');
        const deleteData = deleteResponse.data;

        // 현재 거래처에 해당하는 삭제 요청 상태를 찾기
        const currentDeleteRequest = deleteData.find(deleteRequest => deleteRequest.account.accountId === parseInt(accountId));
        if (currentDeleteRequest) {
            showDeleteButton.value = false; // 삭제 요청이 있으면 삭제 버튼 숨기기
            deleteRequested.value = true; // 삭제 요청 상태를 true로 설정
        }

    } catch (error) {
        console.error('Error fetching account data:', error);
    }
});

const handleEditAccount = () => {
    if (!deleteRequested.value) {
        goToEditPage();
    }
};

const goToEditPage = () => {
    router.push({ path: `/customer/modify/${route.params.accountId}` });
};

const deleteAccount = () => {
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
};

const confirmDelete = async () => {
    const accountId = route.params.accountId;
    try {
        const response = await axios.post('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/account/delete', {
            accountDeleteRequestReason: deleteReason.value,
            account: accountData.value
        });
        console.log('Account delete request sent successfully:', response.data);
        showDeleteButton.value = false; // 삭제 요청 후 삭제 버튼 숨기기
        deleteRequested.value = true; // 삭제 요청 상태를 true로 설정
        closePopup();
    } catch (error) {
        console.error('Error sending delete request:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
    }
};

const addNote = async () => {
    const accountId = route.params.accountId;
    const userId = localStorage.getItem('userId'); // 추가: userId를 localStorage에서 가져오기
    try {
        const response = await axios.post('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/account_note/regist', {
            accountNote: newNote.value,
            account: { accountId: accountData.value.accountId },
            employee: { employeeId: userId } // 수정: employeeId를 userId로 설정
        });
        console.log('Account note added successfully:', response.data);
        accountNoteData.value.push(response.data);
        newNote.value = ''; 
        location.reload(); // 페이지 새로고침 추가
    } catch (error) {
        console.error('Error adding account note:', error);
        alert('노트 추가 중 오류가 발생했습니다.');
    }
};

const deleteNote = async (accountNoteId) => {
    try {
        const response = await axios.patch('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/account_note/delete', null, {
            params: {
                accountNoteId
            }
        });
        const updatedNote = response.data;
        const noteIndex = accountNoteData.value.findIndex(note => note.accountNoteId === accountNoteId);
        if (noteIndex !== -1) {
            accountNoteData.value[noteIndex] = updatedNote;
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('노트 삭제 중 오류가 발생했습니다.');
    }
};
</script>



<style>
.customer-content {
    /* margin-top: 4%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
}

.customer-search {
    text-align: center;
    /* margin-top: 3%; */
}

.customer-code {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 5px;
}

.customer-code-text {
    font-size: 20px;
}

.customer-code-box {
    flex-grow: 1;
    padding: 10px;
    background-color: #BEE7FF;
    border: 2px solid #BEE7FF;
    border-radius: 10px;
    box-sizing: border-box;
    width: 350px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    user-select: text;
    cursor: pointer;
}

.customer-box {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
    border-radius: 10px;
    border: 2px solid #ccc;
    box-sizing: border-box;
    background-color: whitesmoke;
    height: auto;
    margin: 25px auto;
    gap: 1px;
}

.maintext {
    display: flex;
    align-items: center;
    justify-content: center;
}

.customer-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;
}

.pdfimage {
    width: 50px;
    height: auto;
    cursor: pointer;
}

.customer-edit,
.customer-delete {
    width: 60px;
    height: 40px;
    cursor: pointer;
    margin-left: 15px;
}

.customer-content2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.customer-regist {
    text-align: center;
}

.search-btn-div1,
.regist-btn-div {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.search-btn1,
.customer-regist-btn {
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
}

.search-btn1 {
    max-width: 320px;
}

.customer-regist-btn {
    width: 320px;
    font-size: 18px;
    margin-top: 20px;
    margin-bottom: 100px;
}

.customer-list-box1 {
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

.customer-table1,
.customer-table2,
.customer-table3,
.customer-table4 {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.customer-table1 th,
.customer-table1 td,
.customer-table2 th,
.customer-table2 td,
.customer-table3 th,
.customer-table3 td,
.customer-table4 th,
.customer-table4 td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 8px;
    font-family: GmarketSansMedium;
    width: 300px;
}

.customer-table1 th,
.customer-table2 th,
.customer-table3 th,
.customer-table4 th {
    background-color: whitesmoke;
    color: black;
    font-size: 18px;
    padding: 10px;
    height: 60px;
}

.customer-table1 td,
.customer-table2 td,
.customer-table3 td,
.customer-table4 td {
    height: 50px;
}

.customer-process-box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-grow: 1;
    padding: 10px;
    background-color: #CCEAFF;
    border: 2px solid #CCEAFF;
    border-radius: 10px;
    box-sizing: border-box;
    width: 75%;
    max-width: 1000px;
    min-width: 100px;
    margin-bottom: 20px;
    font-family: GmarketSansMedium;
    font-size: 17px;
    margin-top: 60px;
    height: auto;
    flex-direction: column;
    margin-bottom: 7%;
}

.customer-process-text {
    color: #0C2092;
}

.customer-process-box-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-left: 8px;
}

.customer-process-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.customer-process-writer {
    margin: 0;
    margin-left: 30px;
    margin-bottom: -13px;
}

.customer-process-detail {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 10px;
    font-size: 15px;
    outline: none;
    color: black;
    font-weight: bold;
    width: 94%;
    height: auto;
    margin-right: 5px;
    margin-top: -10px;
    font-weight: normal;
}

.customer-process-date {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F6E5FF;
    border: 2px solid #F6E5FF;
    border-radius: 10px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: normal;
    color: black;
    margin-right: 34px;
}

.customer-process-btn,
.customer-process-btn2 {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 7px;
}

.customer-process-regist,
.customer-process-delete {
    background-color: #0C2092;
    border: 2px solid #0C2092;
    color: white;
    border-radius: 10px;
    padding: 5px 7px;
    margin-top: 10px;
    cursor: pointer;
}

.customer-process-regist {
    margin-top: 5px;
    margin-left: 5px;
}

.customer-process-reply {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 10px;
    margin-top: 10px;
}

.customer-process-reply-box {
    background-color: white;
    border: 2px solid #0C2092;
    border-radius: 10px;
    padding: 10px;
    font-size: 15px;
    outline: none;
    color: black;
    width: 91%;
    height: auto;
    font-weight: normal;
}

.customer-box3 {
    max-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
    border-radius: 10px;
    border: 2px solid #ccc;
    box-sizing: border-box;
    background-color: whitesmoke;
    height: auto;
    width: 100%;
    margin: 25px auto;
    gap: 1px;
}

.project-number,
.project-employee {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
}

.project-number-text,
.project-employee-text {
    min-width: 50px;
    margin-right: 10px;
    margin-bottom: 2px;
}

.project-number-box,
.project-employee-box {
    flex-grow: 1;
    padding: 12px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-sizing: border-box;
    width: 200px;
    text-align: left;
    font-family: GmarketSansMedium;
    font-size: 16px;
    cursor: default;
}

.project-number-box {
    background-color: #BEE7FF;
    border: 2px solid #BEE7FF;
}

.project-employee-box {
    background-color: white;
    border: 1px solid #ccc;
}

.project-number-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.project-number-row {
    display: flex;
    justify-content: center;
    width: 100%;
}

.project-number-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    width: 200px;
}

.popup-overlay {
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
.popup-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    text-align: center;
}
.popup-content h2 {
    margin-bottom: 20px;
}
.popup-content textarea {
    width: 90%;
    height: 100px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
.popup-content button {
    margin: 5px;
    padding: 10px 20px;
    border: none;
    background-color: #007BFF;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}
.popup-content button:last-child {
    background-color: #dc3545;
}
</style>
