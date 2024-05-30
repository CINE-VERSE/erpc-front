import { createRouter, createWebHistory } from 'vue-router';

import Main from '@/components/main/Main.vue';

import CustomerRegist from '@/components/customer/CustomerRegist.vue';
import CustomerList from '@/components/customer/CustomerList.vue';
import CustomerContents from '@/components/customer/CustomerContents.vue';
import CustomerEdit from '@/components/customer/CustomerEdit.vue';

import EstimateRegist from '@/components/estimate/EstimateRegist.vue';
import EstimateList from '@/components/estimate/EstimateList.vue';
import EstimateContents from '@/components/estimate/EstimateContents.vue';
import EstimateEdit from '@/components/estimate/EstimateEdit.vue';

import ContractRegist from '@/components/contract/ContractRegist.vue';
import ContractList from '@/components/contract/ContractList.vue';
import ContractContents from '@/components/contract/ContractContents.vue';
import ContractEdit from '@/components/contract/ContractEdit.vue';

import OrderRegist from '@/components/order/OrderRegist.vue';
import OrderList from '@/components/order/OrderList.vue';
import OrderContents from '@/components/order/OrderContents.vue';
import OrderEdit from '@/components/order/OrderEdit.vue';

import Deposit from '@/components/bill/Deposit.vue';
import CBRequest from '@/components/bill/CBRequest.vue';
import CBList from '@/components/bill/CBList.vue';
import CBContents from '@/components/bill/CBContents.vue';

import YearPerformance from '@/components/performance/YearPerformance.vue';
import TeamPerformance from '@/components/performance/TeamPerformance.vue';

import ApprovalList from '@/components/approval/ApprovalList.vue';

import SalesOppRegist from '@/components/salesopp/SalesOppRegist.vue';
import SalesOppList from '@/components/salesopp/SalesOppList.vue';
import SalesOppContent from '@/components/salesopp/SalesOppContent.vue';
import SalesOppEdit from '@/components/salesopp/SalesOppEdit.vue';

import ItemList from '@/components/logistics/ItemList.vue';
import StorageList from '@/components/logistics/StorageList.vue';

import NoticeRegist from '@/components/notice/NoticeRegist.vue';
import NoticeList from '@/components/notice/NoticeList.vue';
import NoticeContent from '@/components/notice/NoticeContent.vue';
import NoticeEdit from '@/components/notice/NoticeEdit.vue';


import EmployeeList from '@/components/employee/EmployeeList.vue';
import EmployeeDetail from '@/components/employee/EmployeeDetail.vue';
import RegisterEmployee from '@/components/employee/RegisterEmployee.vue';
import EmployeeAccess from '@/components/employee/EmployeeAccess.vue';
import EmployeeApp from '@/components/employee/EmployeeApp.vue';

import axios from 'axios';
const getUserIdFromLocalStorage = () => {
    // localStorage에서 userId 가져오기
    return localStorage.getItem('userId');
};
const getEmployeeAccess = async (userId) => {
    try {

        const response = await axios.get(`http://localhost:7775/access/find_access/${userId}`);
        console.log('응답 데이터:', response.data); // 서버 응답 데이터 출력
        const accessId = Response.data.accessId;
        
        return accessId;
    } catch (error) {
        console.error('사용자 권한 조회 중 오류:', error);
        throw error;
    }
};
const requirePermission = async (to, from, next) => {
    try {
        // localStorage에서 userId 가져오기
        const userId = getUserIdFromLocalStorage();

        // 사용자의 userId를 이용하여 해당 사용자의 accessId 가져오기
        const accessId = await getEmployeeAccess(userId);

        // accessId가 1이면 허용
        if (accessId === 1) {
            next();
        } else {
            // 접근이 거부된 경우
            alert('접근이 거부되었습니다.');
            next(false);
        }
    } catch (error) {
        console.error('사용자 권한 확인 중 오류:', error);
        // 접근이 거부된 경우
        alert('접근이 거부되었습니다.');
        next(false);
    }
};
const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: '/customer/regist',
        component: CustomerRegist
    },
    {
        path: '/customer/list',
        component: CustomerList
    },
    {
        path: '/customer/:accountId',
        component: CustomerContents
    },
    {
        path: '/customer/modify/:accountId',
        component: CustomerEdit
    },
    {
        path: '/estimate/regist',
        component: EstimateRegist
    },
    {
        path: '/estimate',
        component: EstimateList
    },
    {
        path: '/estimate/:quotationId',
        component: EstimateContents
    },
    {
        path: '/estimate/modify/:quotationId',
        component: EstimateEdit
    },
    {
        path: '/contract/regist',
        component: ContractRegist
    },
    {
        path: '/contract',
        component: ContractList
    },
    {
        path: '/contract/:contractId',
        component: ContractContents
    },
    {
        path: '/contract/modify/:contractId',
        component: ContractEdit
    },
    {
        path: '/order/regist',
        component: OrderRegist
    },
    {
        path: '/order',
        component: OrderList
    },
    {
        path: '/order/:orderId',
        component: OrderContents
    },
    {
        path: '/order/modify/:orderId',
        component: OrderEdit
    },
    {
        path: '/bill/deposit',
        component: Deposit
    },
    {
        path: '/bill/request',
        component: CBRequest
    },
    {
        path: '/bill/list',
        component: CBList
    },
    {
        path: '/bill/contents',
        component: CBContents
    },
    {
        path: '/performance/year',
        component: YearPerformance
    },
    {
        path: '/performance/team',
        component: TeamPerformance
    },
    {
        path: '/approval/list',
        component: ApprovalList
    },
    {
        path: '/salesopp/regist',
        component: SalesOppRegist
    },
    {
        path: '/salesopp/list',
        component: SalesOppList
    },
    {
        path: '/salesopp/:salesOppId',
        component: SalesOppContent
    },
    {
        path: '/salesopp/modify/:salesOppId',
        component: SalesOppEdit
    },
    {
        path: '/item/list',
        component: ItemList
    },
    {
        path: '/storage/list',
        component: StorageList
    },
    {
        path: '/notice/regist',
        component: NoticeRegist
    },
    {
        path: '/notice/list',
        component: NoticeList
    },
    {
        path: '/notice/:noticeId',
        component: NoticeContent,
        beforeEnter: requirePermission
    },
    {
        path: '/notice/modify/:noticeId',
        component: NoticeEdit
    },
    { path: '/employees', component: EmployeeList },
    { path: '/employees/:employeeId', component: EmployeeDetail },
    { path: '/employees/register', component: RegisterEmployee },
    { path: '/employees/access', component: EmployeeAccess },
    { path: '/employees/app', component: EmployeeApp },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
