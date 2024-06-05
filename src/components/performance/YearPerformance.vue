<template>
    <div class="target-list-content">
        <div class="target-list">
            <h1>실적 조회</h1>
        </div>
        <div class="filters">
            <div class="year-filter">
                <select id="year-select" class="year-select" v-model="selectedYear" @change="handleYearChange">
                    <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            <div class="team-filter">
                <select id="team-select" class="team-select" v-model="selectedTeam" @change="handleTeamChange" :disabled="isEmployeeSearchActive || searchQuery.length > 0">
                    <option value="">선택안함</option>
                    <option value="1">영업1팀</option>
                    <option value="2">영업2팀</option>
                    <option value="3">영업3팀</option>
                    <option value="4">영업4팀</option>
                </select>
            </div>
            <div class="search-box">
                <input type="text" class="search-input" v-model="searchQuery" placeholder="사원명으로 조회" @input="handleInput">
                <button class="search-btn" @click="fetchEmployeeData">조회하기</button>
            </div>
        </div>
        <div class="target-list-box">
            <table class="target-table" v-if="filteredTargetData.length">
                <thead>
                    <tr>
                        <th>연도</th>
                        <th>월/분기</th>
                        <th>목표 금액</th>
                        <th>달성 금액</th>
                        <th>달성 필요금액</th>
                        <th>달성률</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(target, index) in filteredTargetData" :key="index"
                        :class="{ 'quarter-row': isQuarterRow(target.displayMonthOrQuarter), 'total-row': isTotalRow(target.displayMonthOrQuarter) }">
                        <td>{{ target.year }}</td>
                        <td>{{ target.displayMonthOrQuarter }}</td>
                        <td>{{ formatNumber(target.goal) }}</td>
                        <td>{{ formatNumber(getAchievementValue(target.periodType)) }}</td>
                        <td>{{ formatNumber(getRequiredValue(target.goal, getAchievementValue(target.periodType))) }}</td>
                        <td>{{ getPercentage(target.goal, getAchievementValue(target.periodType)) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const targetData = ref([]);
const filteredTargetData = ref([]);
const selectedYear = ref('2024');  // 기본값을 2024로 설정
const selectedTeam = ref('');  // 팀 필터 추가
const uniqueYears = ref([]);
const searchQuery = ref(''); // 검색어를 저장할 변수
const isEmployeeSearchActive = ref(false); // 사원명 검색 활성화 상태를 저장할 변수
const employeeName = ref(''); // 조회된 사원명을 저장할 변수

const fixedValues = {
    year: {
        month: 232000000,
        quarter: 696000000,
        total: 2784000000
    },
    team: {
        month: 60500000,
        quarter: 181500000,
        total: 726000000
    },
    employee: {
        month: 55800000,
        quarter: 167400000,
        total: 669600000
    }
};

const getAchievementValue = (periodType) => {
    if (isEmployeeSearchActive.value && searchQuery.value) {
        return fixedValues.employee[periodType];
    } else if (selectedTeam.value) {
        return fixedValues.team[periodType];
    } else {
        return fixedValues.year[periodType];
    }
};

const getRequiredValue = (goal, achievement) => {
    return goal - achievement;
};

const getPercentage = (goal, achievement) => {
    return ((achievement / goal) * 100).toFixed(1) + '%';
};

const formatNumber = (num) => {
    if (!num && num !== 0) return '';  // undefined 또는 null 체크
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const processTargetData = (data) => {
    const order = [
        { targetMonth: 1, display: '1월', type: 'month' },
        { targetMonth: 2, display: '2월', type: 'month' },
        { targetMonth: 3, display: '3월', type: 'month' },
        { targetQuarter: 1, display: '1분기', type: 'quarter' },
        { targetMonth: 4, display: '4월', type: 'month' },
        { targetMonth: 5, display: '5월', type: 'month' },
        { targetMonth: 6, display: '6월', type: 'month' },
        { targetQuarter: 2, display: '2분기', type: 'quarter' },
        { targetMonth: 7, display: '7월', type: 'month' },
        { targetMonth: 8, display: '8월', type: 'month' },
        { targetMonth: 9, display: '9월', type: 'month' },
        { targetQuarter: 3, display: '3분기', type: 'quarter' },
        { targetMonth: 10, display: '10월', type: 'month' },
        { targetMonth: 11, display: '11월', type: 'month' },
        { targetMonth: 12, display: '12월', type: 'month' },
        { targetQuarter: 4, display: '4분기', type: 'quarter' },
        { targetMonth: null, display: '총계', type: 'total' }
    ];

    const yearDataMap = {};

    data.forEach(entry => {
        const year = entry.targetYear;
        const month = parseInt(entry.targetMonth);
        const quarter = parseInt(entry.targetQuarter);

        if (!yearDataMap[year]) {
            yearDataMap[year] = {};
        }

        if (month) {
            yearDataMap[year][`month-${month}`] = {
                year,
                displayMonthOrQuarter: `${month}월`,
                goal: parseInt(entry.targetPrice),
                grade: entry.grade || 0,
                require: entry.require || 0,
                percent: entry.percent || 0,
                teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null,
                employeeName: entry.employee?.employeeName || null
            };
        } else if (quarter) {
            yearDataMap[year][`quarter-${quarter}`] = {
                year,
                displayMonthOrQuarter: `${quarter}분기`,
                goal: parseInt(entry.targetPrice),
                grade: entry.grade || 0,
                require: entry.require || 0,
                percent: entry.percent || 0,
                teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null,
                employeeName: entry.employee?.employeeName || null
            };
        } else {
            yearDataMap[year]['total'] = {
                year,
                displayMonthOrQuarter: '총계',
                goal: parseInt(entry.targetPrice),
                grade: entry.grade || 0,
                require: entry.require || 0,
                percent: entry.percent || 0,
                teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null,
                employeeName: entry.employee?.employeeName || null
            };
        }
    });

    const processedData = [];
    for (const year of Object.keys(yearDataMap).sort((a, b) => b - a)) {
        for (const item of order) {
            const key = item.targetMonth ? `month-${item.targetMonth}` : item.targetQuarter ? `quarter-${item.targetQuarter}` : 'total';
            if (yearDataMap[year][key]) {
                processedData.push({ ...yearDataMap[year][key], periodType: item.type });
            }
        }
    }
    return processedData;
};

const fetchTargetData = async () => {
    try {
        const response = await axios.get(`http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/target/integrate`);
        const data = response.data;
        targetData.value = processTargetData(data);

        uniqueYears.value = [...new Set(targetData.value.map(item => item.year))].sort((a, b) => b - a);

        filterData();
    } catch (error) {
        console.error('Error fetching target data:', error);
        alert('실적 정보를 조회하는 중 오류가 발생했습니다.');
    }
};

const fetchTeamData = async (teamCodeId) => {
    try {
        const response = await axios.get(`http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/target/team/${teamCodeId}`);
        const data = response.data;
        targetData.value = processTargetData(data);

        filterData();
    } catch (error) {
        console.error('Error fetching team data:', error);
        alert('팀 실적 정보를 조회하는 중 오류가 발생했습니다.');
    }
};

const fetchEmployeeData = async () => {
    try {
        const response = await axios.get('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/employees');
        const employees = response.data;

        const matchingEmployee = employees.find(employee => employee.employeeName === searchQuery.value);
        if (matchingEmployee) {
            console.log(`Employee Id: ${matchingEmployee.employeeId}, Employee Name: ${matchingEmployee.employeeName}`);
            employeeName.value = matchingEmployee.employeeName; // 사원명을 저장
            isEmployeeSearchActive.value = true; // 사원명 검색 활성화
            selectedTeam.value = ''; // 팀 필터 초기화
            const employeeResponse = await axios.get(`http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/target/employee/${matchingEmployee.employeeId}`);
            targetData.value = processTargetData(employeeResponse.data);
            filterData();
        } else {
            console.log('No matching employee found');
            isEmployeeSearchActive.value = false; // 사원명 검색 비활성화
            employeeName.value = ''; // 사원명 초기화
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
        isEmployeeSearchActive.value = false; // 사원명 검색 비활성화
        employeeName.value = ''; // 사원명 초기화
    }
};

const handleInput = () => {
    if (searchQuery.value.length > 0) {
        isEmployeeSearchActive.value = true;
        selectedTeam.value = ''; // 팀 필터 초기화
    } else {
        isEmployeeSearchActive.value = false;
        employeeName.value = ''; // 사원명 초기화
        filterData();
    }
};

const isQuarterRow = (monthOrQuarter) => {
    return ['1분기', '2분기', '3분기', '4분기'].includes(monthOrQuarter);
};

const isTotalRow = (monthOrQuarter) => {
    return monthOrQuarter === '총계';
};

const filterData = () => {
    console.log('Filtering data...');
    let filteredData = targetData.value;

    if (selectedYear.value) {
        filteredData = filteredData.filter(target => target.year === selectedYear.value);
    }
    if (selectedTeam.value) {
        filteredData = filteredData.filter(target => target.teamCodeId == selectedTeam.value);
    }
    if (searchQuery.value) {
        filteredData = filteredData.filter(target => target.employeeName && target.employeeName.includes(searchQuery.value));
    }
    console.log('Filtered target data:', filteredData);
    filteredTargetData.value = filteredData;
};

const handleYearChange = () => {
    if (!isEmployeeSearchActive.value) {
        searchQuery.value = '';  // Reset search query
        if (selectedTeam.value) {
            fetchTeamData(selectedTeam.value);
        } else {
            fetchTargetData();
        }
    }
};

const handleTeamChange = () => {
    if (!isEmployeeSearchActive.value) {
        searchQuery.value = '';  // Reset search query
        if (!selectedTeam.value) {
            fetchTargetData();  // Fetch year data
        } else {
            fetchTeams();
        }
    }
};

const fetchTeams = async () => {
    const teamCodeId = selectedTeam.value;
    if (teamCodeId) {
        await fetchTeamData(teamCodeId);
    } else {
        filterData();
    }
};

onMounted(async () => {
    await fetchTargetData();
});

watch([selectedYear, selectedTeam, searchQuery], () => {
    filterData();
});
</script>


<style>
.target-list-content {
    /* margin-top: 4%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.target-list {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    /* margin-top: 3%; */
}

.filters {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* margin-bottom: 20px; */
    gap: 10px; /* 추가 */
}

.year-filter,
.team-filter {
    margin-bottom: 20px;
    margin-top: 20px;
}

.year-filter select,
.team-filter select {
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

.search-box {
    display: flex;
    align-items: center;
    gap: 10px; /* 추가 */
}

.search-input {
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

.search-btn {
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

.search-btn:hover {
    background-color: #007bff;
}

.target-list-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: white;
    height: auto;
    max-width: 1400px;
    margin: 20px auto;
    /* margin-top: 3%; */
    margin-bottom: 7%;
    gap: 1px;
    /* margin-left: -65px; */
}

.target-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.target-table th,
.target-table td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 13px;
    font-family: GmarketSansMedium;
    width: 120px; /* 너비 조절 */
}


.target-table th {
    background-color: #0C2092;
    color: white;
    font-size: 18px;
    padding: 10px;
}

.quarter-row {
    background-color: #E5F7FE;
}

.total-row {
    background-color: #F6E5FF;
}

.year-select {
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
</style>
