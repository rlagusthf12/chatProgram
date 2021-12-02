package com.litetalk.messenger.document;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;



@AllArgsConstructor
@Getter
@Setter
@Document("message_log")

public class MessageLog {	
	    @Id
	    private String messageId;
	    private String roomId;
	    private String sender; 
	    private String message;
	    private String createTime;
	    private int unReadCount;
}
