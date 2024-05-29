<template>
    <div>
      <input v-model="noticeTitle" placeholder="제목">
      <textarea v-model="noticeContent" placeholder="내용"></textarea>
      <input type="file" @change="handleFileChange" multiple>
      <button @click="modifyNotice">등록</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        noticeId: null,
        noticeTitle: '',
        noticeContent: '',
        files: []
      };
    },
    methods: {
      handleFileChange(event) {
        this.files = event.target.files;
      },
      async modifyNotice() {
        const formData = new FormData();
        formData.append('notice', JSON.stringify({
          noticeTitle: this.noticeTitle,
          noticeContent: this.noticeContent
        }));
        for (let i = 0; i < this.files.length; i++) {
          formData.append('files', this.files[i]);
        }
    
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
      }
    },
    mounted() {
      // URL 파라미터에서 noticeId 가져오기
      this.noticeId = this.$route.params.noticeId;
    }
  };
  </script>