<template>
    <div class="wrap" v-if="!state.inviteForm&&!state.roomSetting&&!state.authForm">       
      <header class="header" >
      <div class="header__inner header__inner--popup">
        <h1 class="header__title">{{ state.roomName }} <span class="header__user-count">{{state.invitedUser.length}}</span></h1>
        <button type="button" class="header__close-button" title="뒤로가기" @click="back">      
          <img src="../images/mobile/back-arrow-icon-black-24.svg" alt="">
        </button>
        <button type="button" class="header__menu-button" title="메뉴 열기"  @click="state.modal_state=true">
          <img src="../images/mobile/menu-icon-black-24.svg" alt="">
        </button>
      </div>
    </header>
        
       <div class="contents" >
            <div class="contents__scroll-area" id="contents__scroll-area" @scroll="handleScroll">
        <div class="contents__chat-area">
           
          <div  v-for="(message,index) in state.messages" :key="index">
          <div class="contents__chat-date" v-if="index>1&&state.messages[index-1].createTime.slice(0,8)!=message.createTime.slice(0,8)">
            <span class="contents__chat-date-history">{{message.createTime?.slice(0, 4) + '-' + message.createTime?.slice(4, 6) + '-' + message.createTime?.slice(6, 8)}}</span>
          </div>

          <div class="contents__chat-date" v-if="index==(state.messages.length-state.readT)&&state.readMark" >
            <span class="contents__chat-date-history">여기까지 읽으셨습니다</span>
          </div>

          
           <div class="contents__chat-text-area" v-if="message.sender!=sender" >
            <div class="contents__chat-text-profile-img-area">
              <img src="https://mblogthumb-phinf.pstatic.net/MjAyMDAzMThfNDUg/MDAxNTg0NTA2MTc3NDA4.tN6JzQkuCNuCqYKqsqxwfPiQQttaGblIkksKIU-BPDUg.OF0uEL83Ka9Y1Jjw6_xZNnjpbCiTbMDl0Whn8euNgOwg.JPEG.sunnyabcd/IMG_2341_polarr.jpg?type=w800" alt="">
            </div>
            <div class="contents__chat-text-box">
              <div class="contents__chat-text-user-name">{{ message.sender }}</div>
              <div class="contents__chat-text">
                {{ message.message }}
              </div>
            </div>
                <span class="contents__chat-text-date-time">
                 {{(parseInt(message.createTime?.slice(8, 10)) > 12 ? '오후 ' + (parseInt(message.createTime?.slice(8, 10)) - 12) : '오전 ' + message.createTime?.slice(8, 10)) + ':' + message.createTime?.slice(10, 12) }}
                </span>
                &nbsp;           
                <span class="contents__chat-text-date-time" style="color:rgb(7, 7, 5)">
                 {{((message.unReadCount - readMessage(message.createTime)) > 0 ? (message.unReadCount - readMessage(message.createTime)) : '')}}
                </span>
          </div>          
         <!-- 내 채팅일 경우 contents__chat-text-area--me 클래스 추가 -->
          <div class="contents__chat-text-area contents__chat-text-area--me" v-if="message.sender==sender">
          
            <div class="contents__chat-text-box">
           
              <div class="contents__chat-text">
                  {{ message.message }}
              </div>
            </div>
            
            <span class="contents__chat-text-date-time">
                 {{(parseInt(message.createTime?.slice(8, 10)) > 12 ? '오후 ' + (parseInt(message.createTime?.slice(8, 10)) - 12) : '오전 ' + message.createTime?.slice(8, 10)) + ':' + message.createTime?.slice(10, 12) }}
            </span>
                &nbsp;
             <span class="contents__chat-text-date-time " style="color:rgb(7, 7, 5)">
                 {{((message.unReadCount - readMessage(message.createTime)) > 0 ? (message.unReadCount - readMessage(message.createTime)) : '')}}
            </span>
          </div>           
          </div>
         
      </div>
      <button class="scroll_down" v-if="state.scrollState&&state.scrollDown>=800" @click="scrollDown">아래로</button>
    </div>
    
  <div class="contents__chat-input-area">
    
        <label class="contents__chat-add-file-button" title="파일 추가" for="file">
          <input type="file" @change="selectFile" style="display: none;" id="file">
          <img src="../images/mobile/add-button-icon-gray-24.svg" alt="">
        </label>
        <div class="contents__chat-textarea-inner">
          <div class="contents__chat-textarea-box">
            <textarea class="contents__chat-textarea" v-model="state.message"
                @keyup.enter="sendMessage"></textarea>
          </div>
          <button type="button" class="contents__chat-textarea-emoticon-button" title="채팅 이모티콘">            
            <img src="../images/mobile/emoticon-icon-gray-24.svg" alt="">
          </button>
        </div>
        <button type="button" class="contents__chat-send-button" @click="sendMessage">전송</button>
      </div>           
    </div>
    </div>

    <div class="dimmed" v-if="state.modal_state" @click="state.modal_state=false">
    <div class="popup popup--chat-setting">
      <div class="contents">
        <div class="contents__scroll-area">
          <div class="contents__chat-member-setting-area">
            <div class="contents__chat-member-setting-box">
              <h2 class="contents__chat-member-setting-title">대화상대</h2>
              <div class="contents__chat-member-list-area">
                <button type="button" class="contents__chat-member-add-button" @click="state.inviteForm=true, state.modal_state=false">
                  <div class="contents__chat-member-add-icon">
                    <img src="../images/mobile/add-icon-blue-10.svg" alt="">
                  </div>
                  <span class="contents__chat-member-add-text">새로운 대화상대 초대</span>
                </button>
              
                <div class="contents__chat-list" v-for="(item,index) in state.invitedUser" :key="index">
                  <div class="contents__chat-member-list-inner">
                    <div class="contents__chat-list-profile-img-area contents__chat-list-profile-img-area--40">
                    </div>
                    <div class="contents__chat-list-info-area">
                      <div class="contents__chat-list-member">
                        <div class="contents__chat-list-member-name">{{item.userName}}</div>
                      </div>
                      <div class="contents__chat-list-chat-text">
                        철수와 영희팀
                      </div>
                    </div>
                  </div>
                  <button type="button" class="contents__chat-member-list-delete-button" title="현재 대화상대 삭제" v-if="sender!=null&&state.adminList.includes(sender)" @click="forcedExit(item)">
                    <img src="../images/pc/popup-close.svg" alt="">
                  </button>
                </div>

              </div>
            </div>
            <div class="contents__chat-member-setting-box">
              <h2 class="contents__chat-member-setting-title">관리자</h2>
              <div class="contents__chat-member-list-area">

                <div class="contents__chat-list" v-for="(item,index) in state.adminList" :key="index">
                  <div class="contents__chat-member-list-inner">
                    <div class="contents__chat-list-profile-img-area contents__chat-list-profile-img-area--40">
                    </div>
                    <div class="contents__chat-list-info-area">
                      <div class="contents__chat-list-member">
                        <div class="contents__chat-list-member-name">{{item}}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="button" class="contents__chat-member-admin-setting-button" title="관리자 설정으로 이동" @click="state.authForm=true">
                  <div class="contents__chat-member-admin-setting-text-area">
                    <img src="../images/mobile/admin-setting-icon-black-24.svg" alt="">
                    <span class="contents__chat-member-admin-setting-text">관리자 설정</span>
                  </div>
                  <img src="../images/mobile/next-arrow-icon-gray-24.svg" alt="">
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="contents__chat-member-bottom-area">
          <button type="button" class="contents__chat-out-button" title="채팅방 나가기" @click="out()">
            <img src="../images/mobile/out-icon-black-24.svg" alt="">
          </button>
          <button type="button" class="contents__chat-setting-button" title="채팅방 설정" v-if="sender!=null&&state.adminList.includes(sender)" @click="state.roomSetting=true">
            <img src="../images/mobile/setting-icon-black-24.svg" alt=""> 
          </button>
        </div>
      </div>
    </div>
  </div>

    <InviteForm 
        v-if="state.inviteForm"
        @backIn="backIn"
        @invite="invite"
        :userNo = "userNo"
        :userName="sender"
        :roomId="roomId"
        />

     <RoomSetting
     v-if="state.roomSetting"
     @backRS="backRS"
     :roomId="roomId"
     :roomName="roomName"
    />

    <AuthForm
    v-if="state.authForm"
    @backAuth="backAuth"
    @updateAuth="updateAuth"
    :userNo = "userNo"
    :userName="sender"
    :roomId="roomId"
    />

</template>


<script lang="ts" >
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { http } from '@/core';
import { defineComponent, onMounted, reactive} from 'vue';
import Stomp, { Client } from 'webstomp-client';
import InviteForm from './inviteForm.vue';
import RoomSetting from './roomSetting.vue';
import AuthForm from './authForm.vue';


interface Chatrooms {
    roomId: String
    name: String
    user: User[]
    message: String
    messageCreateTime: String
}


interface User {
    userNo: string
    inviteTimeStemp: string
    readTimeStemp: string
    unReadMessageCount: number
}


interface Messages {
    roomId: string
    sender: string
    message: string
    createTime: string
    unReadCount: number
}


interface UserList {
    userNo: String
    userName: String
}


export default defineComponent({
    props: {
        roomId: String,
        sender: String,
        roomName: String,
        userNo: String,
    },
    emits: ["back"],
    setup(props, { emit }) {
        const state = reactive<{
            roomId?: string
            sender?: string
            roomName?: String
            message: string
            messages: Messages[]
            stompClient?: Client
            modal_state: boolean
            userList: UserList[]
            invitedUser: UserList[]
            senderList: String[]           
            chatRoom?: Chatrooms
            readList: String[]                   
            inviteForm: boolean
            attachFile?: Event
            roomSetting: Boolean
            adminList: String[]
            authForm: boolean      
            scrollLength: number                       
            readT: number
            readMark:boolean
            page: number
            topScroll: number
            scrollDown: number
            scrollState:boolean           
        }>({
            roomId: undefined,
            sender: undefined,
            roomName: undefined,
            message: "",
            messages: [],
            stompClient: undefined,
            modal_state: false,
            userList: [],
            invitedUser: [],
            senderList: [],          
            chatRoom: undefined,
            readList: [],                 
            inviteForm: false,
            attachFile:undefined,
            roomSetting: false,
            adminList:[],
            authForm: false,
            scrollLength: 0,
            readT:0,
            readMark:true,                
            page:1,
            topScroll:0,
            scrollDown:0,
            scrollState:false
            })

      
       //첨부파일 선택
       function selectFile(payload: Event){
          state.attachFile =payload;
          console.log(state.attachFile);
       }       
     

        //스크롤 제일 아래로
        function scrollDown(){
          let log = document.querySelector("#contents__scroll-area");
          state.scrollState=false;
           if(log!=null){      
             state.scrollLength=log.scrollHeight;                  
             log.scrollTop=state.scrollLength                
          }
        }

        //입장시 스크롤
       function scrollRecent(){
           let log = document.querySelector("#contents__scroll-area");
           if(log!=null){    
             state.scrollLength= log.scrollHeight; 
             log.scrollTop=log.scrollHeight-(state.readT*63.2+100);                              
          }
        }

        //메세지 읽은 사람 목록 불러오기
        async function read() {
            state.readList = [];
            let data = await http.post("/chat/findInviteTime", { roomId: props.roomId });
            for (let i = 0; i < data.user.length; i++) {
                state.readList.push(data.user[i].readTimeStemp);               
            }              
        }

        //안읽은 메세지 수 불러오기
        async function unReadMessageCount() {            
            let data = await http.post("/chat/findInviteTime", { roomId: props.roomId });
            for (let i = 0; i < data.user.length; i++) {               
                if(data.user[i].userNo==props.userNo){
                state.readT=data.user[i].unReadMessageCount;
                }
            }              
        }

        //메세지 읽은 사람 수 카운트
        function readMessage(createTime: String) {
            let count = 0;
            for (let i = 0; i < state.readList.length; i++) {
                if (createTime < state.readList[i]) {
                    count++
                }
            }
            return count;
        }

        //메세지 조회
        async function loadMessage() {
            let inviteTimeStemp = '';
            let data = await http.post('/chat/findInviteTime', { roomId: state.roomId });
            for (let a = 0; a < data.user.length; a++) {
                if (data.user[a].userNo == props.userNo) {
                    inviteTimeStemp = data.user[a].inviteTimeStemp;
                }
            }
            let j = state.readT/10+1;
            for(let k = 0; k<=j; k++){            
            let con = await http.post('/load', { roomId: state.roomId, inviteTimeStemp: inviteTimeStemp, page:state.page});
            for (let a = 0; a <con.length; a++) {
                state.messages.unshift(con[a]);
            }  
             state.page= state.page+1;         
            }
        }

        //메세지 읽은 시간 저장
        async function readTime() {
            await http.post("/chat/readTimeStemp", { roomId: props.roomId, userNo: props.userNo, readTimeStemp: time() });
        }

        //메세지 데이터베이스에 저장
        async function saveMessage() {           
            await http.post('/save', { roomId: props.roomId, sender: props.sender, message: state.message, createTime: time(), unReadCount: state.invitedUser.length });
        }

        //안읽은 메세지 개수 카운트
        async function unReadTimeRoomCount(roomId: String | undefined) {
            await http.post('/chat/unReadTimeRoomCount', { roomId: roomId });
        }

        //메세지 전송
        function sendMessage() {
            if(state.message!=null){
            state.stompClient?.send("/receive", JSON.stringify({ roomId: state.roomId, sender: state.sender, message: state.message, createTime: time(), unReadCount: state.invitedUser.length }), {})
            saveMessage()
            unReadTimeRoomCount(props.roomId); 
            lastMessage(props.roomId, state.message, time());                      
            state.message = '';
            }            
        }

        //채팅방에 마지막 메세지 저장
        async function lastMessage(roomId: String | undefined, message: String, messageCreateTime: String) {
            await http.post('/chat/lastMessage', { roomId: roomId, message: message, messageCreateTime: messageCreateTime });
        }


        //소켓 연결
        function connect() {
            const URL = "http://localhost:8080"
            let sock = new SockJS(URL);
            state.stompClient = Stomp.over(sock);            
            state.stompClient.connect({}, function (frame: any) {
                if (state.stompClient) {
                    state.stompClient.connected = true;
                    state.stompClient?.subscribe("/send", async function (message) {
                        let content = JSON.parse(message.body)
                        if (content != 1) {
                            if (content.roomId == state.roomId) {
                              state.messages.push(content); 
                                await readTime();
                                await read();                                  
                                if(content.sender==props.sender){                                                                          
                                scrollDown();                                      
                                }else if(state.scrollDown<=800){
                                  scrollDown();                                
                                } else{                                  
                                  state.scrollState=true;                                
                                    
                                }                 
                            }
                        } else {
                           await read();                                                       
                        }
                    });
                }               
               readman();
            },
                (error: any) => {
                    // 소켓 연결 실패
                    console.log('소켓 연결 실패', error);
                    if (state.stompClient) state.stompClient.connected = false;
                })

        }

        //유저 채팅방 접속시 메세지 읽음처리
        function readman() {
            state.stompClient?.send("/connect");   
        }

        //채팅방에 속한 유저 리스트 조회
        async function findUserList() {
            let userNoList = []
            let adminList =[]
            const data = await http.post("/chat/findUserList", { roomId: props.roomId });
            for (let a = 0; a < data.user.length; a++) {
                userNoList.push(data.user[a].userNo);
                if(data.user[a].authority==1){
                   adminList.push(data.user[a].userNo);
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
              state.adminList.push(data2[a].userName);
            }
        }
         

        //초대
        async function invite(inviting:UserList[]) {
            let user = [];
            let userName = [];
            if (inviting.length > 0) {
                for (let a = 0; a < inviting.length; a++) {
                    user.push({ userNo: inviting[a].userNo, inviteTimeStemp: time(), readTimeStemp: '', unReadMessageCount: 0 })
                    userName.push(inviting[a].userName);
                }              
                state.stompClient?.send("/receive", JSON.stringify({ roomId: state.roomId, sender: "알림", message: state.sender + "님이 " + userName + "님을 초대했습니다.", createTime: time(), unReadCount: 0 }), {})
                await http.post('/save', { roomId: props.roomId, sender: "알림", message: state.sender + "님이 " + userName + "님을 초대했습니다.", createTime: time(), unReadCount: 0 });
                await lastMessage(props.roomId, state.sender + "님이 " + userName + "님을 초대했습니다.", time());                
            }
            state.modal_state = false;                        
            findUserList();
        }

        //뒤로가기
        function back() {
            state.messages = []
            state.stompClient?.disconnect();
            emit('back');
        }

        //초대창 뒤로가기
        function backIn(){
           state.inviteForm = false;                         
        }

        // 채팅방이름 변경에서 뒤로가기
        async function backRS(roomName: String) {
           state.roomName = roomName;
           state.roomSetting = false;                    
        }

        //관리자 설정에서 뒤로가기
        function backAuth(){          
          state.authForm = false;    
        }

        //나가기
        async function out() {
            if (confirm("나가시겠습니까?")) {
                await http.post("/chat/outUser", { roomId: props.roomId, userNo: props.userNo });
                state.stompClient?.send("/receive", JSON.stringify({ roomId: state.roomId, sender: "알림", message: state.sender + "님이 나가셨습니다.", createTime: time(), unReadCount: 0 }), {})
                await http.post('/save', { roomId: props.roomId, sender: "알림", message: state.sender + "님이 나가셨습니다.", createTime: time(), unReadCount: 0 });
                await lastMessage(props.roomId, state.sender + "님이 나가셨습니다.", time());                
                back();
            }
        }
        
        //강제퇴장
        async function forcedExit(user :UserList){
          if (confirm("퇴장시키시겠습니까?")) {
                await http.post("/chat/outUser", { roomId: props.roomId, userNo: user.userNo });
                state.stompClient?.send("/receive", JSON.stringify({ roomId: state.roomId, sender: "알림", message: user.userName + "님이 퇴장당하셨습니다.", createTime: time(), unReadCount: 0 }), {})
                await http.post('/save', { roomId: props.roomId, sender: "알림", message: user.userName + "님이 퇴장당하셨습니다.", createTime: time(), unReadCount: 0 });
                await lastMessage(props.roomId, user.userName + "님이 퇴장당하셨습니다.", time());
                findUserList()  
                if(user.userName==props.sender){
                  back();
                }   
            }
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

        //관리자 권한 부여
        function updateAuth(adminList: UserList[]){
          state.adminList=[];
          for(let a=0; a<adminList.length;a++){
          state.adminList.push(adminList[a].userName);
          }
        }
       
        //무한 스크롤       
        function handleScroll(){
          let element =document.querySelector("#contents__scroll-area");                    
          if(element!=null){    
            state.topScroll = element.scrollTop;                         
          if ( element.scrollTop <=1) {
            state.page=state.page+1;           
            loadMessage();
            if(element.scrollHeight<1900){
                element.scrollTop=element.scrollHeight
            } else{                                                   
            element.scrollTop=element.scrollHeight-state.scrollLength;
            }         
            state.scrollLength=element.scrollHeight;   
          }
          state.scrollDown = element.scrollHeight-element.scrollTop;        
          }             
        };

         onMounted( async () => {
            state.roomId = props.roomId;
            state.sender = props.sender;
            state.roomName = props.roomName;                         
            await unReadMessageCount();                    
            await read();               
            connect();
            findUserList();
            readTime();   
            await loadMessage();
            scrollRecent();                          
        })      
        
        return {
            state,
            saveMessage,           
            sendMessage,
            connect,
            findUserList,   
            invite,
            back,
            out,
            readMessage,           
            backIn,
            selectFile,
            backRS,
            forcedExit,
            backAuth,
            updateAuth,
            handleScroll,
            scrollDown                                         
        };
    },   components:{InviteForm,RoomSetting,AuthForm}
});
</script>

<style lang="scss">
@import "../style/css/m-index.css";
</style>