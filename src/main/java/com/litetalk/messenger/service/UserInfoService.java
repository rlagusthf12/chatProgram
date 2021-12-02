package com.litetalk.messenger.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.litetalk.messenger.contoroller.RoomController;
import com.litetalk.messenger.document.UserInfo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserInfoService {
	
	@Autowired
    private MongoTemplate mongoTemplate;
	
	public void createUser(String userId, String userPassword, String userName) {
        UserInfo user = UserInfo.create(userId,userPassword,userName);
        mongoTemplate.insert(user);
    }
	
	public List<UserInfo> loginUser(String userId, String userPassword) {
		Query query = new Query(Criteria.where("userId").is(userId));    
		query.addCriteria(Criteria.where("userPassword").is(userPassword));
       
        return mongoTemplate.find(query, UserInfo.class);
	}
	
	public List<UserInfo> UserList(){	
		return mongoTemplate.findAll(UserInfo.class);
	}
	
	public List<UserInfo> searchUserList(String userName){
		Query query = new Query(Criteria.where("userName").regex(userName));
		return mongoTemplate.find(query,UserInfo.class);
	}
	
	public UserInfo findUser(String userNo) {
		Query query = new Query(Criteria.where("userNo").is(userNo));    
		
		return mongoTemplate.findOne(query,UserInfo.class);
	}	
}
