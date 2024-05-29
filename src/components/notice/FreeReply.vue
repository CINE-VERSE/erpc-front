<template>
  <hr class="replyregistline">
  <div class="replys">
    <div class="allreply" v-for="reply in replies" :key="reply.notice_comment_id">
      <div class="replywriterdiv">
        <span>{{ reply.employee.employeeName }}</span>
      </div>
      <div class="replycontentdiv">
        <p>{{ reply.commentContent }}</p>
      </div>
      <div class="replydatediv">
        <p>작성일: {{ reply.commentDate }}</p>
      </div>
      <div class="closebuttondiv">
        <form action="" name="deleteReply" method="post">
          <button type="button" class="closebutton" @click="removeReply(reply.noticeCommentId)"></button>
        </form>
      </div>
    </div>
    <div class="noreply" v-if="!replies.length">
      <p>댓글이 없습니다.</p>
    </div>
    <div class="registreplywriterdiv">
      <span>{{ employeeName }}</span>
    </div>
    <div class="registreplydiv">
      <form id="comment" @submit.prevent="submitReply">
        <div class="commentbox">
          <textarea type="text" class="box" id="reply" v-model="newComment" placeholder="타인의 권리를 침해하거나 명예를 훼손하는 댓글은 운영원칙 및 관련 법률에 의거, 제재를 받을 수 있습니다." required></textarea>
        </div>
        <input type="submit" class="btn" value="등록">
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const replies = ref([]);
const newComment = ref('');
const employeeName = ref('');
const employeeId = ref('');

// 사용자 이름 추출 함수
const extractEmployeeNameFromLocalStorage = () => {
  try {
    const name = localStorage.getItem('employeeName');
    if (!name) {
      console.error('사용자 닉네임 정보가 없습니다.');
      return null;
    }
    return name;
  } catch (error) {
    console.error('사용자 닉네임 추출 중 에러 발생:', error);
    return null;
  }
};

// 사용자 ID 추출 함수
const extractUserIdFromLocalStorage = () => {
  try {
    const id = localStorage.getItem('userId');
    if (!id) {
      console.error('사용자 ID 정보가 없습니다.');
      return null;
    }
    return id;
  } catch (error) {
    console.error('사용자 ID 추출 중 에러 발생:', error);
    return null;
  }
};

// 페이지 로드 시 실행되는 로직
onMounted(() => {
  const name = extractEmployeeNameFromLocalStorage();
  console.log('onMounted에서 가져온 employeeName:', name);
  if (name) {
    employeeName.value = name;
  } else {
    localStorage.setItem('employeeName', 'null');
    employeeName.value = 'null';
  }

  const userId = extractUserIdFromLocalStorage();
  console.log('onMounted에서 가져온 userId:', userId);
  if (userId) {
    employeeId.value = userId;
  } else {
    console.error('로컬 스토리지에서 사용자 ID를 가져올 수 없습니다.');
  }
});

// 댓글 등록 함수
const submitReply = async () => {
  try {
    const noticeId = router.currentRoute.value.params.noticeId;

    await getEmployeeId();

    console.log('사용되는 employeeId:', employeeId.value);
    console.log(noticeId)
    console.log(newComment.value)

    // API로 댓글 등록 요청
    const response = await axios.post('http://localhost:7775/notice_comment/regist', {
      commentContent: newComment.value,
      employee: {
        employeeId: employeeId.value,
      },
      noticeId: noticeId  
    });

    // 등록된 댓글을 replies 배열에 추가
    replies.value.push(response.data);
    newComment.value = '';
  } catch (error) {
    console.error('댓글 작성 중 에러 발생:', error);
  }
};

// 사용자 ID 가져오는 함수
const getEmployeeId = async () => {
  const userId = localStorage.getItem('userId');
  console.log('onMounted에서 가져온 userId:', userId);
  if (userId) {
    employeeId.value = userId; 
  } else {
    console.error('로컬 스토리지에서 사용자 ID를 가져올 수 없습니다.');
  }
};
  
// 댓글 삭제 함수
const removeReply = async (commentId) => {
  try {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      await axios.patch(`http://localhost:7775/notice_comment/delete/${commentId}`);
      // 삭제된 댓글을 화면에서 제거
      replies.value = replies.value.filter(reply => reply.noticeCommentId !== commentId);
    }
  } catch (error) {
    console.error('댓글 삭제 중 에러 발생:', error);
  }
};
  
// 페이지 로드 시 실행되는 로직
onMounted(async () => {
  try {
    const noticeId = router.currentRoute.value.params.noticeId;
    // 해당 공지에 대한 댓글 가져오기
    const response = await axios.get(`http://localhost:7775/notice_comment`);
    // 가져온 댓글을 화면에 표시
    replies.value = response.data.filter(comment => parseInt(comment.noticeId) === parseInt(noticeId));
    console.log('서버로부터 받은 정보:', replies.value);
  } catch (error) {
    console.error('데이터 가져오는 중 에러 발생:', error);
  }
});
</script>

<style scoped>.closebutton {
  background-color: transparent;
  border: none;
  color: red; /* 버튼 색상 설정 */
  font-size: 16px;
  cursor: pointer;
}

.closebutton:hover {
  color: darkred; /* 마우스 호버 시 버튼 색상 변경 */
}</style>