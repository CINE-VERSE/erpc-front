<template>
    <div class="target-list-content">
        <div class="target-list">
            <h1>실적 조회</h1>
        </div>
        <div class="filters">
            <div class="year-filter">
                <select id="year-select" class="year-select" v-model="selectedYear" @change="handleDropdownChange">
                    <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            <div class="team-filter">
                <select id="team-select" class="team-select" v-model="selectedTeam" @change="fetchTeams">
                    <option value="">선택안함</option>
                    <option value="1">영업1팀</option>
                    <option value="2">영업2팀</option>
                    <option value="3">영업3팀</option>
                    <option value="4">영업4팀</option>
                </select>
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
                        <td>{{ target.goal }}</td>
                        <td>{{ target.grade }}</td>
                        <td>{{ target.require }}</td>
                        <td>{{ target.percent }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>



<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

const targetData = ref([]);
const filteredTargetData = ref([]);
const selectedYear = ref('2024');  // 기본값을 2024로 설정
const selectedTeam = ref('');  // 팀 필터 추가
const uniqueYears = ref([]);

const fetchTargetData = async () => {
    try {
        const response = await axios.get(`http://localhost:7775/target/integrate`);
        const data = response.data;

        console.log('Fetched target data:', data);

        const order = [
            { targetMonth: 1, display: '1월' },
            { targetMonth: 2, display: '2월' },
            { targetMonth: 3, display: '3월' },
            { targetQuarter: 1, display: '1분기' },
            { targetMonth: 4, display: '4월' },
            { targetMonth: 5, display: '5월' },
            { targetMonth: 6, display: '6월' },
            { targetQuarter: 2, display: '2분기' },
            { targetMonth: 7, display: '7월' },
            { targetMonth: 8, display: '8월' },
            { targetMonth: 9, display: '9월' },
            { targetQuarter: 3, display: '3분기' },
            { targetMonth: 10, display: '10월' },
            { targetMonth: 11, display: '11월' },
            { targetMonth: 12, display: '12월' },
            { targetQuarter: 4, display: '4분기' },
            { targetMonth: null, display: '총계' }
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
                    goal: entry.targetPrice.toLocaleString(),
                    grade: entry.grade || 0,
                    require: entry.require || 0,
                    percent: entry.percent || 0,
                    teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null
                };
            } else if (quarter) {
                yearDataMap[year][`quarter-${quarter}`] = {
                    year,
                    displayMonthOrQuarter: `${quarter}분기`,
                    goal: entry.targetPrice.toLocaleString(),
                    grade: entry.grade || 0,
                    require: entry.require || 0,
                    percent: entry.percent || 0,
                    teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null
                };
            } else {
                yearDataMap[year]['total'] = {
                    year,
                    displayMonthOrQuarter: '총계',
                    goal: entry.targetPrice.toLocaleString(),
                    grade: entry.grade || 0,
                    require: entry.require || 0,
                    percent: entry.percent || 0,
                    teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null
                };
            }
        });

        targetData.value = [];
        for (const year of Object.keys(yearDataMap).sort((a, b) => b - a)) {
            for (const item of order) {
                const key = item.targetMonth ? `month-${item.targetMonth}` : item.targetQuarter ? `quarter-${item.targetQuarter}` : 'total';
                if (yearDataMap[year][key]) {
                    targetData.value.push(yearDataMap[year][key]);
                }
            }
        }

        uniqueYears.value = [...new Set(targetData.value.map(item => item.year))].sort((a, b) => b - a);

        // 기본 데이터를 불러오면 기본 연도 설정 후 필터링
        filterData();
    } catch (error) {
        console.error('Error fetching target data:', error);
        alert('실적 정보를 조회하는 중 오류가 발생했습니다.');
    }
};

const fetchTeamData = async (teamCodeId) => {
    try {
        console.log(`Fetching data for team: ${teamCodeId}`);
        const response = await axios.get(`http://localhost:7775/target/team/${teamCodeId}`);
        const data = response.data;

        console.log(`Fetched team data for team ${teamCodeId}:`, data);

        const order = [
            { targetMonth: 1, display: '1월' },
            { targetMonth: 2, display: '2월' },
            { targetMonth: 3, display: '3월' },
            { targetQuarter: 1, display: '1분기' },
            { targetMonth: 4, display: '4월' },
            { targetMonth: 5, display: '5월' },
            { targetMonth: 6, display: '6월' },
            { targetQuarter: 2, display: '2분기' },
            { targetMonth: 7, display: '7월' },
            { targetMonth: 8, display: '8월' },
            { targetMonth: 9, display: '9월' },
            { targetQuarter: 3, display: '3분기' },
            { targetMonth: 10, display: '10월' },
            { targetMonth: 11, display: '11월' },
            { targetMonth: 12, display: '12월' },
            { targetQuarter: 4, display: '4분기' },
            { targetMonth: null, display: '총계' }
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
                    goal: entry.targetPrice.toLocaleString(),
                    grade: entry.grade || 0,
                    require: entry.require || 0,
                    percent: entry.percent || 0,
                    teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null
                };
            } else if (quarter) {
                yearDataMap[year][`quarter-${quarter}`] = {
                    year,
                    displayMonthOrQuarter: `${quarter}분기`,
                    goal: entry.targetPrice.toLocaleString(),
                    grade: entry.grade || 0,
                    require: entry.require || 0,
                    percent: entry.percent || 0,
                    teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null
                };
            } else {
                yearDataMap[year]['total'] = {
                    year,
                    displayMonthOrQuarter: '총계',
                    goal: entry.targetPrice.toLocaleString(),
                    grade: entry.grade || 0,
                    require: entry.require || 0,
                    percent: entry.percent || 0,
                    teamCodeId: entry.team?.teamCodeId || entry.employee?.teamCode?.teamCodeId || null
                };
            }
        });

        targetData.value = [];
        for (const year of Object.keys(yearDataMap).sort((a, b) => b - a)) {
            for (const item of order) {
                const key = item.targetMonth ? `month-${item.targetMonth}` : item.targetQuarter ? `quarter-${item.targetQuarter}` : 'total';
                if (yearDataMap[year][key]) {
                    targetData.value.push(yearDataMap[year][key]);
                }
            }
        }

        filterData();
    } catch (error) {
        console.error('Error fetching team data:', error);
        alert('팀 실적 정보를 조회하는 중 오류가 발생했습니다.');
    }
};

const fetchTeams = async () => {
    const teamCodeId = selectedTeam.value;  // Use the selectedTeam value to determine the teamCodeId

    if (!teamCodeId) {
        filterData();  // Apply filtering for year only if no team is selected
        return;
    }

    try {
        await fetchTeamData(teamCodeId);  // Fetch data for the selected team
    } catch (error) {
        console.error('Error fetching teams:', error);
        alert('팀 목록을 조회하는 중 오류가 발생했습니다.');
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
    console.log('Filtered target data:', filteredData);
    filteredTargetData.value = filteredData;
};

const handleDropdownChange = () => {
    searchQuery.value = '';  // Clear the search input
    applyFilter();           // Apply filter immediately
};

onMounted(async () => {
    await fetchTargetData();  // Load initial target data
});

watch([selectedYear, selectedTeam], () => {
    filterData();
});
</script>



<style>
.target-list-content {
    margin-top: 4%;
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
    margin-top: 3%;
}

.year-filter {
    margin-bottom: 20px;
}

.year-filter label {
    margin-right: 10px;
    font-size: 16px;
}

.year-filter select {
    padding: 5px 10px;
    font-size: 16px;
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
    width: 100%;
    max-width: 1400px;
    margin: 20px auto;
    margin-top: 3%;
    margin-bottom: 7%;
    gap: 1px;
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

.filters {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
}

.year-filter,
.team-filter {
    margin-bottom: 20px;
}

.year-filter label,
.team-filter label {
    margin-right: 10px;
    font-size: 16px;
}

.year-filter select,
.team-filter select {
    padding: 5px 10px;
    font-size: 16px;
}

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

.target-list-content {
    margin-top: 4%;
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
    margin-top: 3%;
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
    width: 100%;
    max-width: 1400px;
    margin: 20px auto;
    margin-top: 3%;
    margin-bottom: 7%;
    gap: 1px;
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
