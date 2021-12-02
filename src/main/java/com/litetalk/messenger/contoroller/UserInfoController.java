package com.litetalk.messenger.contoroller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.litetalk.messenger.document.UserInfo;
import com.litetalk.messenger.service.UserInfoService;

@RestController
@RequestMapping("/user")
public class UserInfoController {
	
	@Autowired
	private UserInfoService user;
	
	//회원가입
	@PostMapping("/sign_in")
	 public void signInUser(@RequestBody Map<String, Object> param) {
    	String userId = (String)param.get("userId");
    	String userPassword = (String)param.get("userPassword");
    	String userName = (String)param.get("userName");
        user.createUser(userId,userPassword,userName);        
    }
	
	//로그인
	@PostMapping("/login")
	public List<UserInfo> loginUser(@RequestBody Map<String,Object> param) {
		String userId = (String)param.get("userId");
		String userPassword = (String)param.get("userPassword");
		return user.loginUser(userId,userPassword);		 
	}
	
	//유저 목록 조회
	@GetMapping("/userList")
	public List<UserInfo> userList(){
		return user.UserList();
	}
	
	//검색 유저 목록 조회
	@PostMapping("/searchUserList")
	public List<UserInfo> searchUserList(@RequestBody Map<String,Object> param){
		String userName = (String)param.get("searchUser");
		return user.searchUserList(userName);
	}
	
	//채팅방 유저 조회
	@PostMapping("/findUser")
	public UserInfo[] findUser(@RequestBody Map<String,Object> param) {
		List<String> userList = (List<String>)param.get("userNoList"); 
		UserInfo[] a= new UserInfo[userList.size()];
		for(int i=0; i<userList.size(); i++) {
			a[i]=user.findUser(userList.get(i));
		}
		return a;
	}
	
}
