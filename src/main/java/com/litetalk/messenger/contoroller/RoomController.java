package com.litetalk.messenger.contoroller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.litetalk.messenger.document.RoomList;
import com.litetalk.messenger.document.UserTimeStemp;
import com.litetalk.messenger.service.RoomListService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat")
@Slf4j
public class RoomController {

	@Autowired
	private RoomListService roomList;
   
	//유저의 모든 채팅방 조회
    @PostMapping("/findrooms")   
    public List<RoomList> room(@RequestBody Map<String, Object> param) {
    	String userNo = (String)param.get("userNo");    	
        return roomList.findAllRoom(userNo);
    }
    
    //초대할 유저 목록 조회
    @PostMapping("/findUserList")
    public RoomList findUserList(@RequestBody Map<String, Object>param) {
    	String roomId = (String)param.get("roomId");
    	return roomList.findUserList(roomId);
    }
    
    //채팅방 생성
    @PostMapping("/room")     
    public String createRoom(@RequestBody Map<String, Object> param) {
    	String name = (String)param.get("room_name");
    	List<UserTimeStemp> user = (List<UserTimeStemp>)param.get("user");    	
        String roomId =roomList.createRoom(name,user);        
        return name;
    }   

    //채팅방 검색
    @PostMapping("/room_name")    
    public List<RoomList> roomInfo(@RequestBody Map<String, Object> param) {    	
    	String room_name = (String)param.get("room_name"); 
    	String userNo = (String)param.get("userNo");
        return roomList.findRoomList(room_name,userNo);   
    }
    
    //유저 초대하기
    @PostMapping("/inviteUser")
    public void inviteUser(@RequestBody Map<String, Object> param) {
    	String roomId = (String)param.get("roomId");
    	List<UserTimeStemp> user = (List<UserTimeStemp>)param.get("user");
    	roomList.inviteUser(roomId,user);
    }
    
    //유저 채팅방 나가기
    @PostMapping("/outUser")
    public void outUser(@RequestBody Map<String, Object> param) {
    	String roomId = (String)param.get("roomId");
    	String userNo = (String)param.get("userNo");
    	roomList.outUser(roomId,userNo);
    }
    
    //채팅방 마지막 메세지, 시간 저장
    @PostMapping("/lastMessage")
    public void lastMessage(@RequestBody Map<String, Object> param) {
    	String roomId = (String)param.get("roomId");
    	String message = (String)param.get("message");
    	String messageCreateTime = (String)param.get("messageCreateTime");    	
    	roomList.lastMessage(roomId,message,messageCreateTime);
    	
    }
    
    //유저 초대 시간 저장
    @PostMapping("/findInviteTime")
    public RoomList findInviteTime(@RequestBody Map<String,Object> param) {
    	String roomId = (String)param.get("roomId");    	
    	return roomList.findUserList(roomId);
    }
    
    //유저 채팅방 접속 시간 저장
    @PostMapping("/readTimeStemp")
    public void readTimeStemp(@RequestBody Map<String,Object> param) {
    	String roomId = (String)param.get("roomId");
    	String userNo = (String)param.get("userNo");
    	String readTimeStemp = (String)param.get("readTimeStemp");
    	roomList.readTime(roomId, userNo, readTimeStemp);
    }
    
    //안읽은 메세지 수 증가
    @PostMapping("/unReadTimeRoomCount")
    public void unReadTimeRoomCount(@RequestBody Map<String,Object> param) {
    	String roomId = (String)param.get("roomId");
    	roomList.unReadTimeRoomCount(roomId);
    }
    
    //방이름 변경
    @PostMapping("/updateRoomName")
    public void updateRoomName(@RequestBody Map<String,Object> param) {
    	String roomId = (String)param.get("roomId");
    	String roomName = (String)param.get("roomName");
    	roomList.updateRoomName(roomId, roomName);    	
    }
    
    //관리자 권한 부여
    @PostMapping("/updateAuth")
    public void updateAuth(@RequestBody Map<String,Object> param) {
    	String roomId= (String)param.get("roomId");
    	List<String> adminList = (List<String>)param.get("adminList");
    	for(int i =0; i<adminList.size(); i++) {
    		roomList.updateAutority(roomId, adminList.get(i));
    	}
    }
   
		
}
