
package com.example.chatroomapp.controller;

import com.example.chatroomapp.models.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;

@RestController
public class MessageController {

    private final Set<String> chatrooms = new HashSet<>();

    @GetMapping("/chatrooms")
    public Set<String> getChatrooms() {
        return chatrooms;
    }

    @GetMapping("/create-chatroom")
    public String createChatroom(@RequestParam String chatroomName) {
        chatrooms.add(chatroomName);
        return chatroomName;
    }

    @MessageMapping("/{chatroom}/message")
    @SendTo("/topic/{chatroom}/return-to")
    public Message getContent(@DestinationVariable String chatroom, Message message) {
        return message;
    }
}