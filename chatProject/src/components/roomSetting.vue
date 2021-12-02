<template>
 <div class="wrap">
    <header class="header">
      <div class="header__inner header__inner--popup">
        <h1 class="header__title">대화방 설정</h1>
        <button type="button" class="header__close-button" title="뒤로가기">
          <img src="../images/pc/popup-close.svg" alt="" @click="backRS()">
        </button>
      </div>
    </header>
    <div class="contents">
      <div class="contents__inner">
        <div class="contents__chat-room-img-area">
          <form action="" class="contents__chat-room-profile-form contents__chat-room-profile-form--one" enctype="multipart/form-data">
            <input type="file" id="chat-room-img" accept="image/*" class="hidden">
            <label for="chat-room-img" class="contents__chat-room-profile-img-label contents__chat-room-profile-img-label--one" title="대화방 이미지 업로드">
              <div class="contents__chat-room-profile-img-area contents__chat-room-profile-img-area--file contents__chat-room-profile-img-area--one">
                <img src="https://mblogthumb-phinf.pstatic.net/MjAyMDAzMThfNDUg/MDAxNTg0NTA2MTc3NDA4.tN6JzQkuCNuCqYKqsqxwfPiQQttaGblIkksKIU-BPDUg.OF0uEL83Ka9Y1Jjw6_xZNnjpbCiTbMDl0Whn8euNgOwg.JPEG.sunnyabcd/IMG_2341_polarr.jpg?type=w800" alt="" class="contents__search-chat-user-profile-img">
              </div>
            </label>
          </form>
        </div>
        <div class="contents__chat-room-name">
          <p class="contents__chat-room-name-title">대화방 제목</p>
          <input type="text" class="contents__chat-room-name-input" v-model="state.roomName">
        </div>
      </div>
    </div>
    <div class="contents__bottom-button-area">
      <!-- 대화방 제목 조건 성립시 버튼에 contents__bottom-button--on 클래스명 추가 -->
      <button type="button" class="contents__bottom-button contents__bottom-button--full" v-if="!state.roomName">확인</button>
      <button type="button" class="contents__bottom-button contents__bottom-button--full contents__bottom-button--on" v-if="state.roomName" @click="changeRoomName">확인</button>
    </div>
  </div>
</template>

<script lang="ts" >
import { http } from '@/core';
import { defineComponent, onMounted, reactive } from 'vue';

export default defineComponent({
    props: {
        roomId: String,  
        roomName: String     
    },
    emits: ["backRS"],
    setup(props, { emit }) {
        const state = reactive<{
            roomName?: String
        }>({     
            roomName: ""
        })

       async function changeRoomName(){           
           await http.post("/chat/updateRoomName",{roomId: props.roomId,roomName:state.roomName});
           backRS();
       }
       
       function backRS(){
           emit('backRS',state.roomName);
       }
       
       onMounted(()=>{
           state.roomName=props.roomName;
       })

        return {
            state,                   
            backRS,
            changeRoomName
        };
    }
});

</script>
<style lang="scss">
@import '../style/css/m-index.css';
</style>