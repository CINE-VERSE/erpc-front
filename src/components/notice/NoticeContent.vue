<template>
  <div class="wrapper">
    <div class="noticevboard">
      <div class="clickdiv" @click="mainBoard()">
        <h1 class="boardname">공지사항</h1> 
      </div>
    </div>
    <hr class="boardtitleLine">
    <div class="allboard">
      <div class="boardtitlediv">
        <h2 class="boardtitle">{{ notice.noticeTitle }}</h2>
      </div>
      <div class="datediv">
        <h3 class="date">작성일: {{ notice.noticeDate }}</h3>
      </div>
      <div class="writerdiv">
        <h3 class="writer">작성자: {{ notice && notice.employee ? notice.employee.employeeName : 'Unknown' }}</h3>
      </div>
      <div class="edit">
        <button type="button" @click="editPost" class="editbtn">수정</button>
      </div>
      <div class="delete">
        <button type="button" @click="confirmDelete" class="deletebtn">삭제</button>
      </div>
    </div>
    <hr class="titleLine">
    <div class="maincontent">
      <div v-if="notice.noticeFile && notice.noticeFile.length > 0" class="image-container">
        <img v-for="(image, index) in notice.noticeFile" :key="index" :src="image.accessUrl" :alt="'Image ' + (index + 1)" class="notice-image">
      </div>
    </div>
    <div class="content">
      <p v-html="notice.noticeContent"></p>
    </div>
    <FreeReply/>
  </div>
</template>

<script setup>
import router from '@/router/mainRouter';
import FreeReply from "@/components/notice/FreeReply.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const notice = ref({});
const route = useRoute();

const fetchNotice = async (noticeId) => {
  try {
    const response = await axios.get(`http://erpc-final-backend-env.eba-i73jvuqm.ap-northeast-2.elasticbeanstalk.com/notice_board/${noticeId}`);
    notice.value = response.data;
    console.log('서버로부터 받은 정보:', response.data);
  } catch (error) {
    console.error("Error fetching notice:", error);
  }
};

onMounted(() => {
  const noticeId = route.params.noticeId;
  fetchNotice(noticeId);
});

function mainBoard() {
  router.push('/notice/list');
}

async function deletePost() {
  const noticeId = route.params.noticeId;
  try {
    const response = await axios.patch(`http://erpc-final-backend-env.eba-i73jvuqm.ap-northeast-2.elasticbeanstalk.com/notice_board/delete/${noticeId}`);
    console.log('게시물이 성공적으로 삭제되었습니다.');
    router.push('/notice/list');
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
function confirmDelete() {
  if (confirm('게시물을 삭제하시겠습니까?')) {
    deletePost();
  }
}
function editPost() {
  router.push({ path: `/notice/modify/${route.params.noticeId}` });
}
</script>

<style scoped>
/* General Styling */
.wrapper {
    max-width: 1100px;
    margin: 50px auto; /* Center the wrapper */
    padding-bottom: 100px;
}

hr {
    border: 0;
    height: 2px;
    background-color: #6c7aa1;
    margin: 20px 0;
}

button {
    font-family: 'GmarketSansMedium';
    background-color: #6c7aa1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

button:hover {
    background-color: #5a6781;
}

/* Notice View Styling */
.allboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
}

.boardtitlediv, .writerdiv, .datediv {
    flex: 1;
    padding: 10px;
}

.boardtitlediv {
    flex: 2;
}

.maincontent {
    max-width: 100%;
    margin-top: 3%;
}

.image-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    width: 100%;
    margin-bottom: 20px;
}

.notice-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 5px;
    border: 2px solid black;
}

.content {
    clear: both;
    width: 100%;
    padding: 20px 0;
}

/* Reply Section Styling */
.replys {
    width: 100%;
    margin: 0 auto;
}

.allreply {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    border-bottom: 1px solid #6c7aa1;
}

.replywriterdiv, .replycontentdiv, .replydatediv, .closebuttondiv {
    flex: 1;
    padding: 10px;
}

.replycontentdiv {
    flex: 2;
}

textarea {
    width: 100%;
    max-width: 100%;
    height: 100px;
    padding: 10px;
    font-family: 'GmarketSansMedium';
    resize: none;
}

textarea::placeholder {
    font-size: 12px;
}

.btn {
    display: block;
    margin: 10px 0;
    width: 100px;
    font-size: 16px;
}

.closebutton2 {
    background-color: white;
    color: black;
    border: none;
    cursor: pointer;
    font-size: 15px;
    padding: 5px 10px;
}

.closebutton2:hover {
    background-color: #ccc;
}

/* Line Styling */
.replyregistline, .titleLine, .boardtitleLine {
    width: 100%;
    height: 2px;
    border: 0;
    background-color: #6c7aa1;
}

.noreply {
    text-align: center;
    font-size: 20px;
    margin: 50px auto;
}

.writer {
    font-size: 16px; 
    margin-left: 15px;
}

.datediv {
  font-size: 13px; 
  margin-left: 90px;
}
.editbtn {
  width: 80px;
    height: 40px;
    cursor: pointer;
    margin-left: 15px;
    margin-right: 15px;
}

.deletebtn {
  width: 80px;
    height: 40px;
    cursor: pointer;
    margin-left: 15px;
    margin-right: 15px;
}

</style>