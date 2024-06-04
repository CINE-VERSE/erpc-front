<template>
    <div>
      <table class="table">
        <tr class="top">
            <td class="post" colspan="3">
            <h1 class="boardTitle">공지사항</h1>
          </td>
          <td></td>
          <td class="thing">
            <button @click="goToWritePage" class="writebutton">게시글 작성</button>
          </td>
        </tr>
        <tr class="header2">
            <td></td>
          <td class="search" id="search-1">
            <div id="searchDropdown">
              <select class="form-control" name="search_type" v-model="search_type"
                style="height: 30px; font-size: 12px;">
                <option value="titleContent">제목 내용</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="writerId">작성자</option>
              </select>
            </div>
            <div>
              <input type="text" id='searchText' class="form-control" placeholder="Search..."
                v-model="search_condition" @keyup.enter="callData"
                style="height: 24px; font-size: 12px;">
                <button @click="search" class="searchButton">검색</button>
            </div>
          </td>
        </tr>
        <tr class="header1">
          <td class="num">번호</td>
          <td>제목</td>
          <td>작성자</td>
          <td>작성부서</td>
          <td>작성일자</td>
        </tr>
        <tbody>
    <tr v-for="(item, index) in filteredfree" :key="item.noticeId" class="allpost" @click="changeRouter(item.noticeId)">
      <td>{{ filteredfree.length - index }}</td>
      <td class="boardname">{{ item.noticeTitle }}</td>
      <td>{{ item.employee.employeeName }}</td>
      <td>{{ item.team.teamCode }}</td>
      <td>{{ item.noticeDate }}</td>
    </tr>
  </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from "vue";
  import axios from "axios";
  import router from "@/router/mainRouter";
  
  const notice = ref([]);
  const index = 1;
  const search_condition = ref("");
  const search_type = ref("titleContent");
  const filteredfree = ref([]);
  
  const fetchfree = () => {
    axios.get(`http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/notice_board`)
      .then(response => {
        notice.value = response.data;
        filteredfree.value = response.data; 
      })
      .catch(error => {
        console.error("Error fetching free:", error);
      });
  };
  
  onMounted(() => {
    fetchfree();
  });
  
  function changeRouter(noticeId) {
    router.push(`/notice/${noticeId}`);
  }
  
  function goToWritePage(){
    router.push(`/notice/regist`);
  }

  function search() {
  filterNotice();
}
  watch([search_condition, search_type], () => {
  if (search_condition.value && search_type.value) {
    filterNotice();
  } else {
    filteredfree.value = notice.value;
  }
});


function filterNotice() {
  const condition = search_condition.value.toLowerCase();
  const type = search_type.value;

  if (type === "titleContent") {
    filteredfree.value = notice.value.filter(item =>
      item.noticeTitle.toLowerCase().includes(condition) ||
      item.noticeContent.toLowerCase().includes(condition)
    );
  } else if (type === "title") {
    filteredfree.value = notice.value.filter(item =>
      item.noticeTitle.toLowerCase().includes(condition)
    );
  } else if (type === "content") {
    filteredfree.value = notice.value.filter(item =>
      item.noticeContent.toLowerCase().includes(condition)
    );
  } else if (type === "writerId") {
    filteredfree.value = notice.value.filter(item =>
      item.employee.employeeName.toLowerCase().includes(condition)
    );
  }
}
</script>
  
  <style scoped>
     @import url('@/assets/css/notice/NoticeList.css'); 
  </style>