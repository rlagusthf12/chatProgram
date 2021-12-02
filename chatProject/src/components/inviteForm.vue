<template>
 <div class="wrap">
    <header class="header">
      <div class="header__inner header__inner--popup">
        <h1 class="header__title" >대화상대 검색</h1>
        <button type="button" class="header__close-button" title="닫기" @click="backIn">
          <img src="../images/pc/popup-close.svg" alt="">
        </button>
      </div>
    </header>
    <div class="contents">
      <!-- 대화상대 체크박스 클릭시 해당 영역 생성 -->
      <ul class="contents__search-chat-user-list-area"> 
        <li class="contents__search-chat-user-list"  v-for="(item,index) in state.inviteUserName" :key="index">
          <div class="contents__search-chat-user-profile-img-area">
            <img src="https://v-phinf.pstatic.net/20210215_158/1613399487967JjcF5_JPEG/20201112_195938.jpg?type=w1000" alt="" class="contents__search-chat-user-profile-img">
          </div>
          <span class="contents__search-chat-user-name">{{item}}</span>
          <button type="button" class="contents__search-chat-user-close-button" title="대화상대 선택 취소" @click="cancle(index)">
            <img src="../images/mobile/delete-icon-white-6.svg" alt="">
          </button>
        </li>      
      </ul>
      <input type="text" class="contents__list-search-input" placeholder="이름(초성), 전화번호 검색" v-model="state.searchUser"
       @keyup.enter="loadSearchUserList">
      <div class="contents__scroll-area">
        <div class="contents__chat-list-area">
          <h2 class="contents__search-chat-list-title">밸류마크그룹 <span>({{state.userList.length}})</span></h2>        
         <div class="contents__chat-list" v-for="(items,index) in state.userList"
                            :key="index"
                            @click="state.invitedUser.push(items), state.senderList.push(items.userName), state.inviting.push(items),state.inviteUserName.push(items.userName), state.inviteUser.push(items.userNo), state.inviteUserList.push({ userNo: items.userNo, inviteTimeStemp: time(), readTimeStemp: '', unReadMessageCount: 0, authority: 0 })">
          <div  v-if="!state.inviteUser.includes(items.userNo)&&!state.senderList.includes(items.userName)" >      
            <label for="a12" class="contents__chat-list-check-label">
              <div class="contents__chat-list-profile-img-area contents__chat-list-profile-img-area--40">
              </div>
              <div class="contents__chat-list-info-area">
                <div class="contents__chat-list-member">
                  <div class="contents__chat-list-member-name" >{{ items.userName }}</div>
                </div>
                <div class="contents__chat-list-chat-text">
                  철수와 영희팀
                </div>
              </div>
            </label>
          </div>
          </div>
        </div>
      </div>
      <div class="contents__bottom-button-area">
        <!-- 체크박스 클릭시 버튼에  클래스명 추가 -->
        <button type="button" class="contents__bottom-button contents__bottom-button--full" v-if="state.inviteUserName.length==0" >확인</button>
        <button type="button" class="contents__bottom-button contents__bottom-button--full contents__bottom-button--on" v-if="state.inviteUserName.length>=1&&!roomId" @click="[createRoom(), backIn()]">확인</button>      
        <button type="button" class="contents__bottom-button contents__bottom-button--full contents__bottom-button--on" v-if="state.inviteUserName.length>=1&&roomId" @click="[invite(), backIn()]">확인</button>
      </div>
    </div>
  </div>
 
</template>
<script lang="ts">
import { http } from '@/core';
import { reactive } from '@vue/reactivity';
import { defineComponent, onMounted } from '@vue/runtime-core';


interface UserList {
    userNo: String
    userName: String       
}

interface User {
    userNo: String
    inviteTimeStemp: String
    readTimeStemp: String
    unReadMessageCount: number
    authority: number
}


export default defineComponent ({   
    
     props: {
        userNo: String,
        userName: String,    
        roomId: String    
    },
     emits: ["backIn","invite"],
    setup(props: any,{emit}) {
        const state = reactive<{                    
            room_search_name: String;         
            userList: UserList[];
            inviteUserList: User[]
            inviteUser: String[];           
            messageCount?: Number
            inviteUserName: String[]
            searchUser: String  
            inviteForm: boolean  
            invitedUser: UserList[]  
            senderList: String[]     
            inviting: UserList[] 
            count: number
        }>({                 
            room_search_name: "",           
            userList: [],
            inviteUserList: [],
            inviteUser: [],                           
            messageCount: undefined,
            inviteUserName: [],
            searchUser: "", 
            inviteForm: false,      
            invitedUser: [],
            senderList: [],
            inviting: [],
            count: 0     
        });

         //초대
        async function invite() {
            let user = [];
            let userName = [];
            if (state.inviting.length > 0) {
                for (let a = 0; a < state.inviting.length; a++) {
                    user.push({ userNo: state.inviting[a].userNo, inviteTimeStemp: time(), readTimeStemp: '', unReadMessageCount: 0 , authority: 0})
                    userName.push(state.inviting[a].userName);
                }
                await http.post("/chat/inviteUser", { roomId: props.roomId, user: user });                            
            }          
            emit("invite",state.inviting); 
            state.inviting = [];
            state.searchUser="";
            await findUserList();           
        }

  

        //채팅방 유저 목록 불러오기
        async function loadUserList() {
            state.inviteUser = [];
            state.inviteUserList = [];
            state.inviteUserName = [];

            if(!props.roomId){  
            state.inviteUser = [props.userNo];
            state.inviteUserList = [{ userNo: props.userNo, inviteTimeStemp: time(), readTimeStemp: '', unReadMessageCount: 0, authority:1}];
            state.inviteUserName = [];   

            const data = await http.get("/user/userList");
            for (let a = 0; a < data.length; a++) {
              if(!state.inviteUser.includes(data[a].userNo)&&!state.senderList.includes(data[a].userName)){
                state.userList.push(data[a]);                
              }
            }       
                
            } else{                
                findUserList()
            }
        }

         //채팅방에 속한 유저 리스트 조회
        async function findUserList() {
            let userNoList = []

            const data = await http.post("/chat/findUserList", { roomId: props.roomId });
            for (let a = 0; a < data.user.length; a++) {
                userNoList.push(data.user[a].userNo);
            }
            const data1 = await http.post("/user/findUser", { userNoList: userNoList });
            state.invitedUser = []
            state.senderList = []
            for (let a = 0; a < data1.length; a++) {
                state.invitedUser.push(data1[a]);
                state.senderList.push(data1[a].userName);
                state.count++;
            }

             const data2 = await http.get("/user/userList");
            for (let a = 0; a < data2.length; a++) {
              if(!state.inviteUser.includes(data2[a].userNo)&&!state.senderList.includes(data2[a].userName)){
                state.userList.push(data2[a]);               
              }
            }             
        }


        //검색한 유저 목록 불러오기
        async function loadSearchUserList() {
            state.inviteUser = [props.userNo];
            state.inviteUserList = [{ userNo: props.userNo, inviteTimeStemp: time(), readTimeStemp: '', unReadMessageCount: 0, authority: 1 }];
            state.inviteUserName = [];
            state.userList = [];          
            const data = await http.post("/user/searchUserList", { searchUser: state.searchUser });
            for (let a = 0; a < data.length; a++) {
               if(!state.inviteUser.includes(data[a].userNo)&&!state.senderList.includes(data[a].userName)){
                state.userList.push(data[a]);
                }
            }
        }

        //채팅방 생성
        async function createRoom() {
            state.userList = [];
            let roomName = "";
            if (state.inviteUserName.length == 1) {
                roomName += state.inviteUserName[0]
            } else {

                for (let k = 0; k < state.inviteUserName.length; k++) {

                    if (k < state.inviteUserName.length-1) {
                        roomName += state.inviteUserName[k] + ","
                    } else {
                        roomName += state.inviteUserName[k]
                    }
                }
            }
            await http.post("/chat/room", { room_name: roomName, user: state.inviteUserList });  

        }

         //메세지 시간 format
        function time() {
            let today = new Date();
            let year = today.getFullYear(); // 년도
            let month = today.getMonth() + 1;  // 월                           
            let date = today.getDate();  // 날짜  
            let hours = today.getHours(); // 시
            let minutes = today.getMinutes();  // 분
            let seconds = today.getSeconds();  // 초
            let milliseconds = today.getMilliseconds();

            let createTimeToken = '' + year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date) + (hours < 10 ? '0' + hours : hours) + (minutes < 10 ? '0' + minutes : minutes) + (seconds < 10 ? '0' + seconds : seconds) +
                (milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds);

            return createTimeToken;
        }
      
    
        //뒤로가기
        function backIn() {
            state.userList = [];
            state.inviteUser = [];
            state.inviteUserName = [];             
            state.inviteForm = false; 
            emit('backIn');
        }

        //초대자 초대리스트에서 제거
        function cancle(index: number){
          if(props.roomId){
          for(let i = 0; i < state.inviteUser.length; i++) {
                if(i == index)  {
                   state.inviteUserList.splice(i,1);
                   state.inviteUser.splice(i,1);
                   state.inviting.splice(i,1);
                   state.inviteUserName.splice(i,1);             
                   state.invitedUser.splice(state.count+i,1)
                   state.senderList.splice(state.count+i,1)                 
                }
          }
          }
          else{
               for(let i = 0; i < state.inviteUser.length; i++) {
                if(i == index)  {
                   state.inviteUserList.splice(i+1,1);
                   state.inviteUser.splice(i+1,1);
                   state.inviteUserName.splice(i,1);  
                    state.inviting.splice(i+1,1); 
                    state.invitedUser.splice(state.count+i,1)
                   state.senderList.splice(state.count+i,1)     
                 
                }
          }
          }
        }
      
        onMounted(() => {          
           loadUserList()       
        });

        return {
            state,
            createRoom,          
            loadUserList,               
            backIn,
            loadSearchUserList,
            time,
            cancle,
            invite
        };
    }
})    

</script>

<style lang="scss">
@import "../style/css/m-index.css";
</style>