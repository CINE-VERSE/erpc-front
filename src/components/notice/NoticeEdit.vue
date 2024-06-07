<template>
  <div class="post-form" v-if="noticeId">
    <h2 class="title">공지사항 수정</h2>
    <form @submit.prevent="modifyNotice" class="form">
      <div class="form-group">
        <label for="noticeTitle" class="label">제목</label>
        <input type="text" id="noticeTitle" v-model="noticeTitle" class="input" placeholder="제목" required>
      </div>
      <div class="form-group">
        <label for="noticeContent" class="label">내용</label>
        <textarea id="noticeContent" v-model="noticeContent" class="textarea" placeholder="내용" required></textarea>
      </div>
      <div class="file-upload-area">
        <label for="noticeFiles" class="file-upload-label">
          <i class="fas fa-cloud-upload-alt"></i> 첨부 파일 추가
        </label>
        <input type="file" id="noticeFiles" @change="handleFileChange" multiple accept="image/*" hidden>
        <div v-if="files.length > 0" class="file-list">
          <div v-for="(file, index) in files" :key="index" class="file-item">
            {{ file.name }}
            <button @click="removeFile(index)" class="remove-btn">삭제</button>
          </div>
        </div>
      </div>
      <div v-if="existingFiles.length > 0" class="existing-file-list">
        <h3>기존 첨부 파일</h3>
        <div v-for="(file, index) in existingFiles" :key="index" class="file-item">
          {{ file.name }}
          <button @click="removeExistingFile(index)" class="remove-btn">삭제</button>
        </div>
      </div>
      <button type="submit" class="submit-btn" :disabled="submitting">수정</button>
    </form>
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
      existingFiles: [], // 서버에서 받아온 기존 파일 목록
      submitting: false
    };
  },
  methods: {
    handleFileChange(event) {
      this.files = Array.from(event.target.files);
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },
    removeExistingFile(index) {
      this.existingFiles.splice(index, 1);
    },
    async modifyNotice() {
      if (this.submitting) return;
      this.submitting = true;

      const formData = new FormData();
      formData.append('notice', JSON.stringify({
        noticeTitle: this.noticeTitle,
        noticeContent: this.noticeContent
      }));
      this.files.forEach(file => {
        formData.append('files', file);
      });

      try {
        const response = await axios.patch(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/notice_board/modify/${this.noticeId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Notice modified successfully:', response.data);
        this.$router.push('/notice/list');
      } catch (error) {
        console.error('Error modifying notice:', error.response ? error.response.data : error.message);
      } finally {
        this.submitting = false;
      }
    },
    async fetchNoticeDetails() {
      try {
        const response = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/notice_board/${this.noticeId}`);
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
    this.noticeId = this.$route.params.noticeId;
    this.fetchNoticeDetails();
  }
};
</script>

<style scoped>
.post-form {
  width: 800px; 
  margin: 40px auto; 
  padding: 30px;
  background-color: #e3e9f6; 
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
}

.form-group {
  margin-bottom: 25px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600; /* 폰트 굵기 조절 */
  color: #444; /* 진한 회색 */
}

.input,
.textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* 테두리 포함하여 너비 계산 */
  font-size: 16px;
}

.textarea {
  height: 200px;
  resize: vertical;
}

.file-upload-area {
  border: 2px dashed #007bff; 
  padding: 40px;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 8px; 
}

.file-upload-label {
  display: inline-block;
  padding: 15px 25px;
  background-color: #007bff; /* 파란색 배경 */
  color: white;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-upload-label:hover {
  background-color: #0056b3; /* 어두운 파란색 */
}

.file-upload-label i {
  margin-right: 10px; /* 아이콘과 텍스트 간격 */
}

.file-list,
.existing-file-list {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-btn {
  background-color: #e74c3c; /* 빨간색 */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: #c0392b; /* 어두운 빨간색 */
}

.submit-btn {
  display: block; /* 블록 요소로 변경 */
  width: auto; 
  margin: 0 auto; /* 가운데 정렬 */
  padding: 12px 20px;
  font-size: 18px;
  background-color: #0C2092; 
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #007bff;
}
</style>