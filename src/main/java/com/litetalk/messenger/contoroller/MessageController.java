package com.litetalk.messenger.contoroller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.litetalk.messenger.document.MessageLog;
import com.litetalk.messenger.service.MessageService;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class MessageController {

	private final MessageService messageService;

	
	@MessageMapping("/receive")   
    @SendTo("/send")    
    public MessageLog message(MessageLog messages) {	
        return messages; 
    }  
	
	@MessageMapping("/connect")   
    @SendTo("/send")    
    public int read() {	
        return 1; 
    } 
	
    
    @PostMapping("/save")
    public void saveMessage(@RequestBody Map<String, Object> param) {
    	String roomId = (String)param.get("roomId");
    	String sender = (String)param.get("sender");
    	String message = (String)param.get("message");
    	String messageId = UUID.randomUUID().toString();
    	String createTime = (String)param.get("createTime");
    	int unReadCount = (Integer)param.get("unReadCount");
    	MessageLog messages = new MessageLog(messageId,roomId,sender,message,createTime,unReadCount);
    	messageService.messageInsert(messages);   
    }
    
    @PostMapping("/load")
    public List<MessageLog> loadMessage(@RequestBody Map<String, Object> param) {
    	String roomId =(String)param.get("roomId");
    	String inviteTimeStemp =(String)param.get("inviteTimeStemp");
    	int page = (int)param.get("page");
    	return messageService.messageSelect(roomId,inviteTimeStemp,page);
    	
    }

}
