<template>
    <div class="wrap" v-if="!state.selectYN&&!state.inviteForm" @click="state.context = false">
        <header class="header">
            <div class="header__inner">
                <h1 class="header__title">대화방</h1>               
                <div class="header__button-list-area">
                    <button type="button" class="header__button">
                        <img src="../images/mobile/empty-icon.svg" alt="" />
                    </button>
                    <button type="button" class="header__button">
                        <img src="../images/mobile/empty-icon.svg" alt="" />
                    </button>
                    <button type="button" class="header__button">
                        <img src="../images/mobile/empty-icon.svg" alt="" />
                    </button>
                </div>
            </div>
        </header>
        <div class="contents">
            <input
                type="text"
                class="contents__list-search-input"
                placeholder="검색어 입력"
                v-model="state.room_search_name"
                @keyup.enter="findRoom()"
            />
            <div class="contents__scroll-area">
                <div class="contents__chat-list-area">
                    <div
                        class="contents__chat-list"
                        v-for="(item,index) in state.chatrooms"
                        :key="index"
                        @click="selectRoom(item.name, item.roomId)"
                        @contextmenu.prevent="showContextMenu($event, item.roomId, item.user.length, item.name)"
                    >
                        <div class="contents__chat-list-left">
                            <div class="contents__chat-list-profile-img-area">
                                <img
                                    src="https://mblogthumb-phinf.pstatic.net/MjAyMDAzMThfNDUg/MDAxNTg0NTA2MTc3NDA4.tN6JzQkuCNuCqYKqsqxwfPiQQttaGblIkksKIU-BPDUg.OF0uEL83Ka9Y1Jjw6_xZNnjpbCiTbMDl0Whn8euNgOwg.JPEG.sunnyabcd/IMG_2341_polarr.jpg?type=w800"
                                    alt=""
                                    class="contents__chat-list-profile-img"
                                />
                            </div>
                            <div class="contents__chat-list-info-area">
                                <div class="contents__chat-list-member">
                                    <div class="contents__chat-list-member-name">{{ item.name }}</div>
                                    <span
                                        class="contents__chat-list-member-count"
                                    >{{ item.user.length }}</span>
                                </div>
                                <div
                                    class="contents__chat-list-chat-text"
                                    v-if="item.message"
                                >{{ item.message }}</div>
                            </div>
                        </div>
                        <div class="contents__chat-list-right">
                            <div
                                class="contents__chat-list-date-time"
                                v-if="item.messageCreateTime"
                            >
                                {{
                                    item.messageCreateTime?.slice(2, 4) + '/' + item.messageCreateTime?.slice(4, 6) + '/' + item.messageCreateTime?.slice(6, 8) + ' ' + (parseInt(item.messageCreateTime?.slice(8, 10)) > 12 ? '오후 ' + (parseInt(item.messageCreateTime?.slice(8, 10)) - 12) : '오전 ' + item.messageCreateTime?.slice(8, 10)) + ':' +
                                        item.messageCreateTime?.slice(10, 12)
                                }}
                            </div>
                            <div
                                class="contents__chat-list-chat-count"
                                v-if="unReadCount(item.user)"
                            >{{ unReadCount(item.user) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="contents__tab">
                <a href="#" class="contents__tab-link contents__tab-link--on">
                    <img src="../images/mobile/empty-icon.svg" alt="" class="contents__tab-icon" />
                    <span class="contents__tab-link-name">근태</span>
                </a>
                <a href="#" class="contents__tab-link">
                    <img src="../images/mobile/empty-icon.svg" alt="" class="contents__tab-icon" />
                    <span class="contents__tab-link-name">대화방</span>
                </a>
                <a href="#" class="contents__tab-link">
                    <img src="../images/mobile/empty-icon.svg" alt="" class="contents__tab-icon" />
                    <span class="contents__tab-link-name">경비관리</span>
                </a>
                <a href="#" class="contents__tab-link">
                    <img src="../images/mobile/empty-icon.svg" alt="" class="contents__tab-icon" />
                    <span class="contents__tab-link-name">결제</span>
                </a>
                <a href="#" class="contents__tab-link">
                    <img src="../images/mobile/empty-icon.svg" alt="" class="contents__tab-icon" />
                    <span class="contents__tab-link-name">더보기</span>
                </a>
            </div>
            <button type="button" class="contents__add-button" @click="state.inviteForm=true">
                <img src="../images/mobile/plus-icon-white-20.svg" alt="" />
            </button>
        </div>
    </div>

    <ul
        :style="{
            top: state.position.y + 'px',
            left: state.position.x + 'px',
            position: 'absolute', background: 'white',
            boxShadow: '#000 ' + 0 + 'px ' + 0 + 'px ' + 3 + 'px ',
            paddingLeft: 0 + 'px'
        }"
        v-if="state.context"
    >
        <li id="menu" @click="out">방 나가기</li>        
    </ul>
    <Room
        v-if="state.selectYN"
        @back="back"
        :roomId="state.selectRoomId"
        :sender="userName"
        :userNo="userNo"
        :roomName="state.selectRoomName"        
    />
    <InviteForm 
        v-if="state.inviteForm"
        @backIn="backIn"
        :userNo = "userNo"
        :userName="userName"
    />  
</template>

<script lang="ts">
import { http } from '@/core';
import { reactive } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import Room from './room.vue'
import InviteForm from './inviteForm.vue'
import Stomp, { Client } from 'webstomp-client';
import SockJS from 'sockjs-client/dist/sockjs.min.js';


interface Chatrooms {
    roomId: string
    name: string
    user: User[]
    message: string
    messageCreateTime: string
}

interface UserList {
    userNo: string
    userName: string
}

interface User {
    userNo: string
    inviteTimeStemp: string
    readTimeStemp: string
    unReadMessageCount: number
    authority: number
}

interface Position {
    x: number
    y: number
}

export default {
    props: {
        userNo: String,
        userName: String
    },
    setup(props: any) {
        const state = reactive<{
            chatrooms: Chatrooms[];
            connectYN: boolean;
            room_search_name: string;           
            userList: UserList[];
            inviteUserList: User[]
            inviteUser: string[];
            selectRoomId?: string
            selectRoomName?: string
            selectYN: boolean
            stompClient?: Client
            messageCount?: Number                
            context: boolean
            position: Position
            doRoomId: string
            doRoomName: string
            doUserlength: number
            inviteForm: boolean           
        }>({
            chatrooms: [],
            connectYN: false,
            room_search_name: "",          
            userList: [],
            inviteUserList: [],
            inviteUser: [],
            selectRoomId: undefined,
            selectRoomName: undefined,
            selectYN: false,
            stompClient: undefined,
            messageCount: undefined,              
            context: false,
            position: { x: 0, y: 0 },
            doRoomId: "",
            doRoomName:"",
            doUserlength: 0,
            inviteForm: false          
        });
      

        function showContextMenu(event: MouseEvent, roomId: string, userlength: number, roomName: string) {
            // Disable the default context menu  
            state.position.x = event.pageX;
            state.position.y = event.pageY;
            state.doRoomId = roomId;
            state.doRoomName= roomName;
            state.doUserlength = userlength;
            if (state.context) {
                state.context = false;
                state.context = true;
            } else {
                state.context = true;
            }          
        };

        //유저가 속한 모든 채팅방 조회
        async function findAllRoom() {
            const data = await http.post("/chat/findrooms", { userNo: props.userNo });
            state.chatrooms = [];
            for (let a = 0; a < data.length; a++) {
                state.chatrooms.push(data[a]);
            }
        }

        //안읽은 메세지 카운트
        function unReadCount(list: User[]) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].userNo == props.userNo) {
                    return list[i].unReadMessageCount;
                }
            }
        }

        //채팅방 검색
        async function findRoom() {
            const data = await http.post("/chat/room_name", { room_name: state.room_search_name, userNo: props.userNo });
            state.chatrooms = [];
            for (let a = 0; a < data.length; a++) {
                state.chatrooms.push(data[a]);
            }

        }

        //채팅방 입장시 connect 끊기
        function selectRoom(name: string, roomId: string) {
            state.selectRoomId = roomId;
            state.selectRoomName = name;
            state.stompClient?.disconnect();
            state.selectYN = true;
        }

        //소켓 연결
        function connect() {
            const URL = "http://localhost:8080"
            let sock = new SockJS(URL);
            state.stompClient = Stomp.over(sock);
            state.stompClient.connect({}, function (frame: any) {
                if (state.stompClient)
                    state.stompClient.connected = true;
                console.log('소켓 연결 성공', frame);
                state.stompClient?.subscribe("/send", async function (message) {
                    let content = JSON.parse(message.body)
                    await findAllRoom();
                    await findAllRoom();                    
                    content;
                });
            }, (error: any) => {
                // 소켓 연결 실패
                console.log('소켓 연결 실패', error);
                if (state.stompClient) state.stompClient.connected = false;
            })
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

        // 채팅방에서 뒤로가기
        async function back() {
            state.selectYN = false;
            connect();
           await findAllRoom();
           await findAllRoom();
        }

         //초대창에서 뒤로가기
        async function backIn() {
            state.inviteForm = false;         
             await findAllRoom();
             await findAllRoom();
        }
     
        //채팅방에 마지막 메세지 저장
        async function lastMessage(roomId: String | undefined, message: String, messageCreateTime: String) {
            await http.post('/chat/lastMessage', { roomId: roomId, message: message, messageCreateTime: messageCreateTime });
        }

        //나가기
        async function out() {
            if (confirm("나가시겠습니까?")) {
                await http.post("/chat/outUser", { roomId: state.doRoomId, userNo: props.userNo });
                state.stompClient?.send("/receive", JSON.stringify({ roomId: state.doRoomId, sender: "알림", message: props.userName + "님이 나가셨습니다.", createTime: time(), unReadCount: state.doUserlength }), {})
                await http.post('/save', { roomId: state.doRoomId, sender: "알림", message: props.userName + "님이 나가셨습니다.", createTime: time(), unReadCount: state.doUserlength });
                await lastMessage(state.doRoomId, props.userName + "님이 나가셨습니다.", time());
            }
            findAllRoom();
            state.context=false;
        }

 
        onMounted(async () => {
            connect();
            await findAllRoom();
            await findAllRoom();
        });

        return {
            state,          
            findRoom,           
            selectRoom,
            back,
            time,
            unReadCount,           
            showContextMenu,
            out,
            backIn            
        };
    },
    components: { Room,InviteForm }
}
</script>

<style lang="scss">
@import "../style/css/m-index.css";
#menu {
    cursor: pointer;
    padding: 5px 5px;
}
#menu:hover {
    background-color: #fafafa;
}
#room {
    cursor: pointer;
    height: 30px;
}
#room:hover {
    background-color: #fafafa;
}
</style>