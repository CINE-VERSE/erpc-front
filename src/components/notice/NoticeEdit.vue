<template>
  <div class="regist-content" v-if="noticeId">
    <h1>공지사항 수정</h1>
    <div class="notice-section">
      <label for="noticeTitle" class="notice-label">제목</label>
      <input type="text" id="noticeTitle" v-model="noticeTitle" class="notice-input" placeholder="제목">
    </div>
    <div class="notice-section">
      <label for="noticeContent" class="notice-label">내용</label>
      <textarea id="noticeContent" v-model="noticeContent" class="notice-textarea" placeholder="내용"></textarea>
    </div>
    <div class="notice-section">
      <label for="noticeFiles" class="notice-label">첨부파일</label>
      <input type="file" id="noticeFiles" @change="handleFileChange" multiple class="notice-file-input">
      <ul v-if="files.length > 0" class="file-list">
        <li v-for="(file, index) in files" :key="index" class="file-item">{{ file.name }}</li>
      </ul>
    </div>
    <div class="notice-button-section">
      <button class="notice-submit-btn" @click="modifyNotice">수정</button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      noticeId: null,
      noticeTitle: '',
      noticeContent: '',
      files: [],
      existingFiles: [] // 서버에서 받아온 기존 파일 목록
    };
  },
  methods: {
    handleFileChange(event) {
      this.files = Array.from(event.target.files);
    },
    async modifyNotice() {
      const formData = new FormData();
      formData.append('notice', JSON.stringify({
        noticeTitle: this.noticeTitle,
        noticeContent: this.noticeContent
      }));
      this.files.forEach(file => {
        formData.append('files', file);
      });

      try {
        const response = await axios.patch(`http://localhost:7775/notice_board/modify/${this.noticeId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Notice modified successfully:', response.data);
        // 등록 성공 후 이동
        this.$router.push('/notice/list');
      } catch (error) {
        console.error('Error modifying notice:', error.response.data);
      }
    },
    async fetchNoticeDetails() {
      try {
        const response = await axios.get(`http://localhost:7775/notice_board/${this.noticeId}`);
        const notice = response.data;
        this.noticeTitle = notice.noticeTitle;
        this.noticeContent = notice.noticeContent;
        this.existingFiles = notice.files || []; // 기존 파일 목록 설정
      } catch (error) {
        console.error('Error fetching notice details:', error);
      }
    }
  },
  mounted() {
    // URL 파라미터에서 noticeId 가져오기
    this.noticeId = this.$route.params.noticeId;
    // 공지사항 정보 가져오기
    this.fetchNoticeDetails();
  }
};
</script>

<style>
.regist-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.notice-section {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.notice-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.notice-input,
.notice-textarea,
.notice-file-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.notice-textarea {
  height: 200px;
  resize: vertical;
}

.file-list {
  margin-top: 10px;
  list-style-type: none;
  padding: 0;
}

.file-item {
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
}

.notice-button-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.notice-submit-btn {
  padding: 10px 20px;
  font-size: 16px;
  text-align: center;
  border: none;
  border-radius: 5px;
  background-color: #0C2092;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.notice-submit-btn:hover {
  background-color: #007bff;
}
</style>