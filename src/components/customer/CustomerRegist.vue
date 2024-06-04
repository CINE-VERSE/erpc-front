<template>
        <div class="customer-regist-content11">
            <div class="customer-regist">
                <h1>거래처 등록</h1>
            </div>
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
                            <td>
                                <div class="business-number-div33">
                                    <input type="text" v-model="brNo" @input="brNo = brNo.toUpperCase()" class="business-number-box33" placeholder="사업자 번호를 입력해주세요."/>
                                    <button @click="fetchBusinessData" class="business-number-btn33">확인</button>
                                </div>
                            </td>
                            <td><input type="text" v-model="accountName" class="customer-test1"></td>
                            <td><input type="text" v-model="accountRepresentative" class="customer-test2"></td>
                        </tr>
                    </tbody>
                </table>
                <table class="customer-table2">
                    <thead>
                        <tr>
                            <th>기업 상태</th>
                            <th>법인 여부</th>
                            <th>소재지</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ businessStatus }}</td>
                            <td><input type="text" v-model="corporationStatus" class="customer-test3"></td>
                            <td><input type="text" v-model="accountLocation" class="customer-test4"></td>
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
                            <td><input type="text" v-model="accountType" class="customer-test5"></td>
                            <td><input type="text" v-model="accountContact" class="customer-test6"></td>
                            <td><input type="text" v-model="accountEmail" class="customer-test7"></td>
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
                            <td><input type="text" v-model="accountNote" class="customer-test9"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        <div class="customer-regist-btn-div33">
            <button @click="registerAccount" class="customer-regist-btn33">거래처 등록하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router/mainRouter';

const brNo = ref('');
const businessStatus = ref('');
const businessNumber = ref('');
const taxType = ref('');
const accountName = ref('');
const accountRepresentative = ref('');
const corporationStatus = ref('');
const accountLocation = ref('');
const accountContact = ref('');
const accountEmail = ref('');
const accountNote = ref('');
const accountType = ref('');

const fetchBusinessData = async () => {
    if (!brNo.value) {
        alert("사업자 번호를 입력해주세요.");
        return;
    }

    try {
        console.log('사업자 번호:', brNo.value);
        const response = await axios.post('https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=IU5nhZBdwX%2FQMWdk0H0JTyf%2BUeqSzFG7Q6JNh%2Fvwuj%2BIt4%2F1wIy2ikm65nd5EisKla2Z3w1InmzW8MMEhu%2BRNA%3D%3D', {
            b_no: [brNo.value]
        });
        console.log('API 응답:', response.data);
        if (response.data.data && response.data.data.length > 0) {
            const result = response.data.data[0];
            businessNumber.value = result.b_no;
            taxType.value = result.tax_type;
            console.log('사업자 번호:', businessNumber.value, '사업자 상태:', result.b_stt, '세금 유형:', taxType.value);
            if (taxType.value === "국세청에 등록되지 않은 사업자등록번호입니다.") {
                alert(taxType.value);
                return;
            }
            if (result.b_stt === "계속사업자") {
                businessStatus.value = "영업중";
            } else if (result.b_stt === "휴업자") {
                alert("해당 사업자 번호는 휴업 상태입니다. 다시 확인해주세요.");
                businessStatus.value = "";
                return;
            } else if (result.b_stt === "폐업자") {
                alert("해당 사업자 번호는 폐업 상태입니다. 다시 확인해주세요.");
                businessStatus.value = "";
                return;
            } else {
                alert("국세청에 등록되지 않은 사업자등록번호입니다.");
                businessStatus.value = "";
                return;
            }
        } else {
            alert('조회된 결과가 없습니다.');
            console.warn('조회된 결과가 없습니다.');
            businessStatus.value = "";
        }
    } catch (error) {
        console.error('Error fetching business data:', error);
        alert('사업자 정보를 조회하는 중 오류가 발생했습니다.');
        businessStatus.value = "";
    }
}

const registerAccount = async () => {
    // 필수 필드가 모두 채워졌는지 확인
    if (!brNo.value || !accountName.value || !accountRepresentative.value || !corporationStatus.value || !accountLocation.value || !accountContact.value || !accountEmail.value || !accountType.value) {
        alert('모든 필수 입력란을 채워주세요.');
        return;
    }

    // LocalStorage에서 employeeId를 가져옴
    const employeeId = localStorage.getItem('userId');
    if (!employeeId) {
        alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
        return;
    }

    const postData = {
        accountName: accountName.value,
        corporationNum: businessNumber.value,
        accountDeleteDate: null,
        accountRepresentative: accountRepresentative.value,
        corporationStatus: corporationStatus.value,
        accountLocation: accountLocation.value,
        accountContact: accountContact.value,
        accountEmail: accountEmail.value,
        accountNote: accountNote.value,
        accountType: accountType.value,
        employee: {
            employeeId: employeeId  // LocalStorage에서 가져온 employeeId 사용
        },
        accountStatus: {
            accountStatusId: businessStatus.value === "영업중" ? 1 : 4 // Assume 1 is the ID for "영업중"
        }
    };

    try {
        const response = await axios.post('http://erpc-backend-env-1.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/account/regist', postData);
        console.log('등록 응답:', response.data);
        alert('거래처 등록이 완료되었습니다.');
        router.push({ path: `/customer` });
    } catch (error) {
        console.error('등록 중 오류 발생:', error);
        alert('거래처 등록 중 오류가 발생했습니다.');
    }
}
</script>


<style>

.customer-regist-content11 {
    /* margin-top: 8%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: calc(100% - 220px);
    /* main1의 너비를 뺀 나머지 공간 */
}

.customer-regist {
    text-align: center;
}

.customer-list-box33 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: white;
    height: auto;
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
    height: 40px;
    width: 25%; /* 테이블 셀 너비를 균일하게 설정 */
    box-sizing: border-box;
    padding: 8px;
}

.customer-test1,
.customer-test2,
.customer-test3,
.customer-test4,
.customer-test5,
.customer-test6,
.customer-test7,
.customer-test8,
.customer-test9 {
    width: 100%;
    height: 35px;
    box-sizing: border-box;
    padding: 8px;
}

.customer-test4 {
    width: 100%; /* 테이블 셀 너비와 맞춤 */
}

.customer-test9 {
    width: 100%; /* 테이블 셀 너비와 맞춤 */
}

.customer-regist-btn-div33 {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

.customer-regist-btn33 {
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
    /* margin-top: 20px; */
    margin-bottom: 50px;
}

.business-number-div33 {
    display: flex;
    align-items: center;
}

.business-number-box33 {
    width: calc(100% - 50px); /* 버튼 크기를 뺀 나머지 너비 */
    height: 35px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px 0 0 5px;
    box-sizing: border-box;
    font-family: GmarketSansMedium;
    font-size: 15px;
}

.business-number-btn33 {
    border-radius: 0 5px 5px 0;
    border: 2px solid #0C2092;
    height: 35px;
    background-color: #0C2092;
    color: white;
    font-size: 11px;
    cursor: pointer;
    margin-left: -1px; /* 테두리 겹침 방지 */
    padding: 0 10px;
}

.customer-regist-btn33:hover {
    background-color: #007bff;
}
</style>
