package com.litetalk.messenger.document;

import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Document("room_list")

public class RoomList {
		@Id
		private String roomId;		
		private List<UserTimeStemp> user;	
	    private String name;
	    private String message;
	    private String messageCreateTime;
	    
	    public static RoomList create(String name,List<UserTimeStemp> user) {
	        RoomList roomList = new RoomList();
	        roomList.roomId = UUID.randomUUID().toString();
	        roomList.name = name;
	        roomList.user= user;
	        roomList.message="";
	        roomList.messageCreateTime="";
	        return roomList;
	    }

		public RoomList() {
			// TODO Auto-generated constructor stub
		}

}