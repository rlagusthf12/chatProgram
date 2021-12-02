<template>
 <div class="wrap">
    <header class="header">
      <div class="header__inner header__inner--popup">
        <h1 class="header__title" >관리자 임명</h1>
        <button type="button" class="header__close-button" title="닫기" @click="backAuth">
          <img src="../images/pc/popup-close.svg" alt="">
        </button>
      </div>
    </header>
    <div class="contents">
      <!-- 대화상대 체크박스 클릭시 해당 영역 생성 -->
      <ul class="contents__search-chat-user-list-area"> 
        <li class="contents__search-chat-user-list"  v-for="(item,index) in state.adminList" :key="index">
          <div class="contents__search-chat-user-profile-img-area">
            <img src="https://v-phinf.pstatic.net/20210215_158/1613399487967JjcF5_JPEG/20201112_195938.jpg?type=w1000" alt="" class="contents__search-chat-user-profile-img">
          </div>
          <span class="contents__search-chat-user-name">{{item.userName}}</span>
          <button type="button" class="contents__search-chat-user-close-button" title="대화상대 선택 취소" @click="cancle(index,item)">
            <img src="../images/mobile/delete-icon-white-6.svg" alt="">
          </button>
        </li>      
      </ul>
      <input type="text" class="contents__list-search-input" placeholder="이름(초성), 전화번호 검색" v-model="state.searchUser"
       @keyup.enter="loadSearchUserList">
      <div class="contents__scroll-area">
        <div class="contents__chat-list-area">
          <h2 class="contents__search-chat-list-title">목록 <span>({{state.invitedUser.length}})</span></h2>        
         <div class="contents__chat-list" v-for="(items,index) in state.invitedUser"
                            :key="index"
                            @click="[state.adminList.push(items),addList(index)]">
          <div v-if="con(items)">      
            <label for="a12" class="contents__chat-list-check-label">
              <div class="contents__chat-list-profile-img-area contents__chat-list-profile-img-area--40">
              </div>
              <div class="contents__chat-list-info-area">
                <div class="contents__chat-list-member">
                  <div class="contents__chat-list-member-name" >{{ items.userName}}</div>
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
        <button type="button" class="contents__bottom-button contents__bottom-button--full" v-if="state.adminList.length<=1" >확인</button>
        <button type="button" class="contents__bottom-button contents__bottom-button--full contents__bottom-button--on" v-if="state.adminList.length>1" @click="[updateAuth(),backAuth()]">확인</button>
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

export default defineComponent ({   
    
     props: {
        userNo: String,
        userName: String,    
        roomId: String    
    },
     emits: ["backAuth","updateAuth"],
    setup(props: any,{emit}) {
        const state = reactive<{                               
            userList: UserList[];                  
            messageCount?: Number           
            searchUser: String                
            invitedUser: UserList[]  
            senderList: String[]  
            adminList: UserList[]
        }>({                      
            userList: [],                          
            messageCount: undefined,          
            searchUser: "",                   
            invitedUser: [],
            senderList: [],     
            adminList:[]
        });

        function con(items: UserList){
          for(let a = 0;a< state.adminList.length; a++){
              if(state.adminList[a].userName==items.userName){
                return 0;
              }
           else{
            return 1;
          }
          }
        }
               

         //채팅방에 속한 유저 리스트 조회
        async function findUserList() {         
            let userNoList = []
            let adminList = []
            const data = await http.post("/chat/findUserList", { roomId: props.roomId });
            for (let a = 0; a < data.user.length; a++) {
                
                if(data.user[a].authority==1){
                   adminList.push(data.user[a].userNo);
                }else {
                  userNoList.push(data.user[a].userNo);
                }
            }
           
            const data1 = await http.post("/user/findUser", { userNoList: userNoList });
            state.invitedUser = []
            state.senderList = []
            for (let a = 0; a < data1.length; a++) {
                state.invitedUser.push(data1[a]);
                state.senderList.push(data1[a].userName);             
            }         
            
            const data2 = await http.post("/user/findUser", { userNoList: adminList });            
            state.adminList=[]
            for(let a =0; a<data2.length; a++){
              state.adminList.push(data2[a]);
            }
            
        }


        //검색한 유저 목록 불러오기
        async function loadSearchUserList() {    
            state.userList = [];          
            const data = await http.post("/user/searchUserList", { searchUser: state.searchUser });
            for (let a = 0; a < data.length; a++) {
               if(state.senderList.includes(data[a].userName)){
                state.userList.push(data[a]);
                }
            }
        }

        //뒤로가기
        function backAuth() {              
            emit('backAuth');                 
        }

        //권한부여
        async function updateAuth(){
          let adminList = []
          for(let i=0; i< state.adminList.length; i++){
            adminList.push(state.adminList[i].userNo);
          }
           await http.post("/chat/updateAuth",{roomId: props.roomId, adminList: adminList})
           emit("updateAuth",state.adminList);
        }

        //초대자 초대리스트에서 제거
        function cancle(index: number, item: UserList){         
          if(props.roomId){                                               
                   state.adminList.splice(index,1)  
                   state.invitedUser.push(item);               
               
          }
        }        

        function addList(index: number){
          for(let i = 0; i < state.invitedUser.length; i++) {
                if(i == index)  {                   
                    state.invitedUser.splice(i,1)
                }
          }
        }
      
        onMounted( () => {          
          findUserList()          
        });

        return {
            state,                              
            backAuth,
            loadSearchUserList,         
            cancle,
            con,
            addList,
            updateAuth           
        };
    }
})    

</script>

<style lang="scss">
@import "../style/css/m-index.css";
</style>