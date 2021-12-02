package com.litetalk.messenger.document;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Document("user_info")
public class UserInfo {
	
	@Id
	private String userNo;
    private String userName;
    private String userId;
    private String userPassword;

    public static UserInfo create(String userId, String userPassword, String userName) {
        UserInfo user = new UserInfo();
        user.userNo = UUID.randomUUID().toString();
        user.userName = userName;
        user.userId= userId;
        user.userPassword= userPassword;
        return user;
    }

	public UserInfo() {
		// TODO Auto-generated constructor stub
	}

}
