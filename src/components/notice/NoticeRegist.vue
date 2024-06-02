<template>
  <div class="post-form">
    <h2>게시물 작성</h2>
    <form @submit.prevent="submitPost" class="form">
      <div class="form-group">
        <label for="freeTitle">제목:</label>
        <input type="text" id="freeTitle" v-model="freeTitle" required>
      </div>
      
      <div class="form-group">
        <label for="freeContent">내용:</label>
        <textarea id="freeContent" v-model="freeContent" required></textarea>
      </div>

      <div class="form-group">
        <label for="images">사진 업로드:</label>
        <input type="file" id="images" multiple accept="image/*" @change="handleFileChange">
      </div>

      <button type="submit" class="submit-btn" :disabled="submitting">게시물 작성</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router/mainRouter';

const freeTitle = ref('');
const freeContent = ref('');
const images = ref([]);
const submitting = ref(false);

const submitPost = async () => {
  if (submitting.value) return;
  submitting.value = true;

  try {
    // 로컬 스토리지에서 userId 가져오기
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('noticeBoard', JSON.stringify({
      noticeTitle: freeTitle.value,
      noticeContent: freeContent.value,
      employee: { employeeId: userId },
      team: { teamCodeId: 1 }  
    }));

    if (images.value.length > 0) {
      images.value.forEach(image => {
        formData.append('files', image);
      });
    } else {
      formData.append('files', new Blob(), 'empty_image');
    }

    await axios.post('http://localhost:7775/notice_board/regist', formData);

    console.log('게시물 작성 완료');
    router.push('/notice/list');
  } catch (error) {
    console.error('게시물 작성 오류:', error);
  } finally {
    submitting.value = false;
  }
};

const handleFileChange = (event) => {
  images.value = Array.from(event.target.files);
};
</script>

<style scoped>
  .post-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
  }

  .post-form h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }

  .form-group input[type="text"],
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }

  .form-group textarea {
    height: 150px;
    resize: vertical;
  }

  .form-group input[type="file"] {
    display: block;
    margin-top: 10px;
  }

  .submit-btn {
    width: 100%;
    padding: 10px;
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

  .submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>