package com.litetalk.messenger.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.litetalk.messenger.document.MessageLog;

import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class MessageService {
	@Autowired
    private MongoTemplate mongoTemplate;

    public void messageInsert(MessageLog messages) {        
        mongoTemplate.insert(messages);     
    }
    
    public List<MessageLog> messageSelect(String roomId, String inviteTimeStemp, int page) {  
    	Query query = new Query(Criteria.where("roomId").is(roomId));
    	query.addCriteria(Criteria.where("createTime").gt(inviteTimeStemp));
    	query.with(Sort.by(Sort.Direction.DESC, "createTime"));
    	query.skip((page-1)*10).limit(10);
    	
    	List<MessageLog> messages = mongoTemplate.find(query,MessageLog.class);   	
    	return messages;    
    }   
    
    
    
}