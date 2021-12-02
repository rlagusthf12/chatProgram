package com.litetalk.messenger.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.litetalk.messenger.contoroller.RoomController;
import com.litetalk.messenger.document.RoomList;
import com.litetalk.messenger.document.UserTimeStemp;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RoomListService {

	@Autowired
    private MongoTemplate mongoTemplate;

    public String createRoom(String name, List<UserTimeStemp> user) {
        RoomList roomList = RoomList.create(name,user);        
        mongoTemplate.insert(roomList);
        return roomList.getRoomId();
    }
     
    public List<RoomList> findAllRoom(String userNo) {       	
    	Query query = new Query(Criteria.where("user").elemMatch(Criteria.where("userNo").is(userNo)));    
    	return mongoTemplate.find(query,RoomList.class);
    }

    public List<RoomList> findRoomList(String room_name,String userNo) {
    	Query query = new Query(Criteria.where("name").regex(room_name));
    	query.addCriteria(Criteria.where("user").elemMatch(Criteria.where("userNo").is(userNo)));
        return mongoTemplate.find(query, RoomList.class);
    }
    
    public RoomList findUserList(String roomId){
    	Query query = new Query(Criteria.where("roomId").is(roomId));    	
        return mongoTemplate.findOne(query, RoomList.class);
    }
    
    public void readTime(String roomId, String userNo, String readTimeStemp) {
    	Query query = new Query(Criteria.where("roomId").is(roomId));       
    	Update update = new Update();     	
    	mongoTemplate.updateMulti(query,update.set("user.$[user].readTimeStemp",readTimeStemp).set("user.$[user].unReadMessageCount",0).filterArray(Criteria.where("user.userNo").is(userNo)) ,RoomList.class);
    	     	
    } 
        
    public void inviteUser(String roomId, List<UserTimeStemp> user) {
    	Query query = new Query(Criteria.where("roomId").is(roomId));
    	Update update = new Update();    
    	update.push("user").each(user);    	
    	mongoTemplate.updateFirst(query, update, RoomList.class);
    }
    
    public void updateRoomName(String roomId, String roomName) {
    	Query query = new Query(Criteria.where("roomId").is(roomId));
    	Update update = new Update();    
    	update.set("name",roomName);   	
    	mongoTemplate.updateFirst(query, update, RoomList.class);
    }
    
    public void lastMessage(String roomId, String message,String messageCreateTime) {
    	Query query = new Query(Criteria.where("roomId").is(roomId));
    	Update update = new Update();
    	update.set("message", message);
    	update.set("messageCreateTime", messageCreateTime);
    	mongoTemplate.updateFirst(query, update, RoomList.class);
    }
    
    public void outUser(String roomId, String userNo) {
    	Query query = new Query(Criteria.where("roomId").is(roomId));
    	Update update = new Update();
    	update.pull("user", Query.query(Criteria.where("userNo").is(userNo)));    	
    	mongoTemplate.updateFirst(query, update, RoomList.class);
    }
    
    public void unReadTimeRoomCount(String roomId) {
    	Query query = new Query(Criteria.where("roomId").is(roomId));       
    	Update update = new Update();     	    	
    	update.inc("user.$[].unReadMessageCount",1);
    	mongoTemplate.updateMulti(query,update,RoomList.class);      	
    }
    
    public void updateAutority(String roomId,String userNo) {
    	Query query = new Query(Criteria.where("roomId").is(roomId));
    	Update update = new Update();
    	update.set("user.$[user].authority",1).filterArray(Criteria.where("user.userNo").is(userNo));
    	mongoTemplate.updateFirst(query, update, RoomList.class);
    }
}