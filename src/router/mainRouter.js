import { createRouter, createWebHistory } from 'vue-router';
import { requirePermission } from '@/components/auth';

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

import DeleteRequest from '@/components/delete/DeleteRequest.vue'; 


const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: '/customer/regist',
        component: CustomerRegist,
        beforeEnter: requirePermission(7)
    },
    {
        path: '/customer/list',
        component: CustomerList
    },
    {
        path: '/customer/:accountId',
        component: CustomerContents,
        beforeEnter: requirePermission(6)
    },
    {
        path: '/customer/modify/:accountId',
        component: CustomerEdit
    },
    {
        path: '/estimate/regist',
        component: EstimateRegist,
        beforeEnter: requirePermission(10)
    },
    {
        path: '/estimate',
        component: EstimateList
    },
    {
        path: '/estimate/:quotationId',
        component: EstimateContents,
        beforeEnter: requirePermission(9)
    },
    {
        path: '/estimate/modify/:quotationId',
        component: EstimateEdit
    },
    {
        path: '/contract/regist',
        component: ContractRegist,
        beforeEnter: requirePermission(13)
    },
    {
        path: '/contract',
        component: ContractList
        
    },
    {
        path: '/contract/:contractId',
        component: ContractContents,
        beforeEnter: requirePermission(12)
    },
    {
        path: '/contract/modify/:contractId',
        component: ContractEdit
    },
    {
        path: '/order/regist',
        component: OrderRegist,
        beforeEnter: requirePermission(13)
    },
    {
        path: '/order',
        component: OrderList
    },
    {
        path: '/order/:orderId',
        component: OrderContents,
        beforeEnter: requirePermission(14)
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
        component: SalesOppRegist,
        beforeEnter: requirePermission(4)
    },
    {
        path: '/salesopp/list',
        component: SalesOppList
        
    },
    {
        path: '/salesopp/:salesOppId',
        component: SalesOppContent,
        beforeEnter: requirePermission(3)
    },
    {
        path: '/salesopp/modify/:salesOppId',
        component: SalesOppEdit
    },
    {
        path: '/item/list',
        component: ItemList,
        beforeEnter: requirePermission(21)
    },
    {
        path: '/storage/list',
        component: StorageList,
        beforeEnter: requirePermission(21)
    },
    {
        path: '/notice/regist',
        component: NoticeRegist,
        beforeEnter: requirePermission(2)
    },
    {
        path: '/notice/list',
        component: NoticeList
    },
    {
        path: '/notice/:noticeId',
        component: NoticeContent,
        beforeEnter: requirePermission(1)
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
    { path: '/delete' , component: DeleteRequest },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
