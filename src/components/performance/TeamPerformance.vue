<template>
    <div class="team-list-content">
        <div class="team-list">
            <h1>Team 실적 조회</h1>
        </div>
        <div class="team-list-search">
            <div class="team-dropdown">
                <button class="team-dropdown-btn">{{ searchBy }} ▼</button>
                <div class="team-dropdown-content">
                    <a href="#" @click.prevent="setSearchBy('영업 1팀', 1)">영업 1팀</a>
                    <a href="#" @click.prevent="setSearchBy('영업 2팀', 2)">영업 2팀</a>
                    <a href="#" @click.prevent="setSearchBy('영업 3팀', 3)">영업 3팀</a>
                </div>
            </div>
            <div class="team-search-box">
                <input type="text" class="team-search-input" v-model="searchQuery" placeholder="검색어를 입력하세요">
                <button class="team-search-btn" @click="applyFilter">실적 조회</button>
            </div>
        </div>
        <div class="team-list-box">
            <table class="team-table" v-if="teamData && teamData.length > 0">
                <thead>
                    <tr>
                        <th>연도</th>
                        <th>월/분기</th>
                        <th>{{ teamName }} 목표 금액</th>
                        <th>{{ teamName }} 달성 금액</th>
                        <th>{{ teamName }} 달성 필요금액</th>
                        <th>{{ teamName }} 달성률</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(team, index) in teamData" :key="index"
                        :class="{ 'quarter-row': isQuarterRow(team.displayMonthOrQuarter), 'total-row': isTotalRow(team.displayMonthOrQuarter) }">
                        <td>{{ team.year }}</td>
                        <td>{{ team.displayMonthOrQuarter }}</td>
                        <td>{{ team.goal }}</td>
                        <td>{{ team.grade }}</td>
                        <td>{{ team.require }}</td>
                        <td>{{ team.percent }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const teamData = ref([]);
const teamName = ref('Team');
const searchQuery = ref('');
const searchBy = ref('Team');

const fetchTeamData = async (teamId, teamNameValue) => {
    try {
        const response = await axios.get(`http://localhost:7775/target/team/${teamId}`);
        const data = response.data;
        teamData.value = [];
        teamName.value = teamNameValue;

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

        order.forEach((item) => {
            const match = data.find(entry =>
                (entry.targetMonth && parseInt(entry.targetMonth) === item.targetMonth) ||
                (entry.targetQuarter && parseInt(entry.targetQuarter) === item.targetQuarter) ||
                (!entry.targetMonth && !entry.targetQuarter && item.display === '총계')
            );

            teamData.value.push(match ? {
                year: match.targetYear,
                displayMonthOrQuarter: item.display,
                goal: match.targetPrice.toLocaleString(),
                grade: 'N/A',
                require: 'N/A',
                percent: 'N/A'
            } : {
                year: 2024, // or any default value
                displayMonthOrQuarter: item.display,
                goal: 'N/A',
                grade: 'N/A',
                require: 'N/A',
                percent: 'N/A'
            });
        });
    } catch (error) {
        console.error('Error fetching team data:', error);
        alert('팀 정보를 조회하는 중 오류가 발생했습니다.');
    }
};

const setSearchBy = (criteria, teamId) => {
    searchBy.value = criteria;
    fetchTeamData(teamId, criteria);
};

const applyFilter = () => {
    // Assuming teamData is already filtered based on searchQuery
};

const isQuarterRow = (month) => {
    return ['1분기', '2분기', '3분기', '4분기'].includes(month);
};

const isTotalRow = (month) => {
    return month === '총계';
};
</script>

<style>
.team-list-content {
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.team-list {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 3%;
}

.team-list-search {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.team-dropdown {
    position: relative;
    display: inline-block;
}

.team-dropdown-btn {
    width: 200px;
    height: 43px;
    background-color: #0C2092;
    border: 3px solid #0C2092;
    border-radius: 10px;
    padding: 6px 30px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    color: white;
}

.team-dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 10px;
    width: 100%;
}

.team-dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ccc;
}

.team-dropdown-content a:hover {
    background-color: #E5F7FE;
}

.team-dropdown:hover .team-dropdown-content {
    display: block;
}

.team-search-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 2px;
}

.team-search-input {
    width: 170px;
    height: 12px;
    padding: 10px;
    border: 3px solid #0C2092;
    border-radius: 10px;
    outline: none;
    font-size: 16px;
    background-color: #E5F0FF;
    color: #0C2092;
}

.team-search-btn {
    background-color: #0C2092;
    border: none;
    color: white;
    padding: 8px 8px;
    width: 195px;
    height: 45px;
    margin-top: 9px;
    margin-bottom: 16px;
    font-size: 16px;
    border-radius: 10px;
    cursor: pointer;
    outline: none;
}

.team-list-box {
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

.team-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
}

.team-table th,
.team-table td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 13px;
    font-family: GmarketSansMedium;
}

.team-table th {
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
</style>
