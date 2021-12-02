<template>
    <div class="login" v-if="state.login_state">
        <br />
        <br />
        <br />
        <br />
        <br />아이디:
        <input type="text" v-model="state.userId" />
        <br />
        <br />
        <br />패스워드:
        <input type="text" v-model="state.userPassword" @keyup.enter="loginUser" />
        <br />
        <br />
        <br />
        <button @click="loginUser">로그인</button>
        <label id="modal__btn" @click="state.modal_state = true">회원가입</label>
    </div>

    <div>
        <Rooms v-if="!state.login_state" :userNo="state.userNo" :userName="state.userName" />
    </div>
    <!--회원가입 모달-->
    <div id="modal-wrap" v-if="state.modal_state">
        <div id="modal-box">
            아이디:
            <input type="text" class="form-control" v-model="state.signUserId" />
            비밀번호:
            <input type="text" class="form-control" v-model="state.signUserPassword" />
            닉네임:
            <input
                type="text"
                class="form-control"
                v-model="state.signUserName"
                @keyup.enter="createUser"
            />
            <label class="input-group-append">
                &nbsp;
                <button class="btn btn-primary" type="button" @click="createUser">가입 하기</button>
            </label>
            <button @click="state.modal_state = false">닫기</button>
        </div>
        <label id="modal-bg" />
    </div>
</template>

<script lang="ts" setup>
import { http } from '@/core';
import { reactive } from '@vue/reactivity';
import Rooms from './rooms.vue'

const state = reactive({
    modal_state: false,
    signUserId: "",
    signUserPassword: "",
    signUserName: "",
    userId: "",
    userPassword: "",
    login_state: true,
    userName: "",
    userNo: ""
})

//유저 생성
async function createUser() {

    await http.post("/user/sign_in", { userId: state.signUserId, userPassword: state.signUserPassword, userName: state.signUserName });
    alert("회원가입 완료");
    state.signUserId = "";
    state.signUserPassword = "";
    state.signUserName = "";
    state.modal_state = false;
}

//유저 로그인
async function loginUser() {

    let val = await http.post("/user/login", { userId: state.userId, userPassword: state.userPassword });    

    if (val.length == 1) {
        state.userName = val[0].userName;
        state.userNo = val[0].userNo;
        state.login_state = false;
    } else {
        alert("아이디/ 패스워드를 확인해주세요");
    }
}

</script>

<style>
.login {
    width: 100%;
    height: 1200px;
    margin: auto;
    text-align: center;
}

#modal__btn {
    display: inline-block;
    margin: 10px;
    border-radius: 20px;
    box-shadow: #000 0px 0px 3px;
    padding: 5px 20px;
    cursor: pointer;
    user-select: none;
}

#modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    height: 100%;
    width: 100%;
    background: #ddd;
    opacity: 0.6;
    z-index: 100;
}

#modal-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 500px;
    min-height: 500px;
    background: #fff;
    z-index: 101;
}
</style>