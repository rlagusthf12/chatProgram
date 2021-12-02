package com.litetalk.messenger.document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserTimeStemp {
	String userNo;	
	String inviteTimeStemp;
	String readTimeStemp;
	int unReadMessageCount;
	int authority;
}
