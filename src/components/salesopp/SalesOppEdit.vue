<template>
    <div class="regist-content" v-if="salesOppData">
        <h1>영업기회 수정</h1>
        <div class="salesOpp-list-box1">
            <table class="salesOpp2-table1">
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
                        <td><input type="text" v-model="editedSalesOppData.oppAccountName" class="salesOpp-test1"></td>
                        <td><input type="text" v-model="editedSalesOppData.oppAccountPic" class="salesOpp-test2"></td>
                        <td><input type="text" v-model="editedSalesOppData.oppAccountLocation" class="salesOpp-test3"></td>
                        <td><input type="text" v-model="editedSalesOppData.oppAccountContact" class="salesOpp-test4"></td>
                        <td><input type="text" v-model="editedSalesOppData.oppAccountEmail" class="salesOpp-test5"></td>
                    </tr>
                </tbody>
            </table>
            <table class="salesOpp2-table2">
                <thead>
                    <tr>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" v-model="editedSalesOppData.salesOppNote" class="salesOpp-test6"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button @click="updatesalesOpp" class="salesOpp-regist-btn">영업기회 수정하기</button>
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
const salesOppData = ref(null);
const editedSalesOppData = ref({
    oppAccountName: '',
    oppAccountPic: '',
    oppAccountLocation: '',
    oppAccountContact: '',
    oppAccountEmail: '',
    salesOppNote: ''
});

onMounted(async () => {
    const salesOppId = route.params.salesOppId;
    try {
        const response = await axios.get(`http://localhost:7775/sales_opportunity/${salesOppId}`, { withCredentials: true });
        salesOppData.value = response.data;
        // 클라이언트에 가져온 데이터를 수정용 데이터에 반영
        Object.assign(editedSalesOppData.value, response.data);
    } catch (error) {
        console.error('Error fetching sales_opportunity data:', error);
    }
});

const updatesalesOpp = async () => {
    const salesOppId = route.params.salesOppId;

    try {
        const requestData = {
            oppAccountName: editedSalesOppData.value.oppAccountName,
            oppAccountPic: editedSalesOppData.value.oppAccountPic,
            oppAccountLocation: editedSalesOppData.value.oppAccountLocation,
            oppAccountContact: editedSalesOppData.value.oppAccountContact,
            oppAccountEmail: editedSalesOppData.value.oppAccountEmail,
            salesOppNote: editedSalesOppData.value.salesOppNote
        };

        console.log('Request Data:', requestData); // 데이터를 콘솔에 출력

        await axios.patch(`http://localhost:7775/sales_opportunity/modify/${salesOppId}`, requestData, {
            withCredentials: true
        });
        
        alert('영업기회가 성공적으로 수정되었습니다.');
        router.push({ path: `/salesopp/${salesOppId}`});
    } catch (error) {
        console.error('영업기회를 수정하는 중 오류가 발생했습니다.', error);
        alert('영업기회를 수정하는 중 오류가 발생했습니다.');
    }
};
</script>