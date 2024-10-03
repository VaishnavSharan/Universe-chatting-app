var stompClient = null;
var currentChatroom = null;

function sendMessage() {
    let jsonOb = {
        name: localStorage.getItem("name"),
        content: $("#message-value").val()
    };

    stompClient.send(`/app/${currentChatroom}/message`, {}, JSON.stringify(jsonOb));
}

function connect(room) {
    let socket = new SockJS('/server1');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log("Connected : " + frame);

        $("#room-selection").addClass('d-none');
        $("#name-from").addClass('d-none');
        $("#chat-room").removeClass('d-none');

        stompClient.subscribe(`/topic/${room}/return-to`, function (response) {
            showMessage(JSON.parse(response.body));
        });
    });
}

function showMessage(message) {
    $("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`);
}

function fetchChatrooms() {
    $.get("/chatrooms", function (data) {
        let bar = $("#chatroom-bar");
        bar.empty();
        data.forEach(function (room) {
            let className = 'chatroom-item';
            bar.append(`<div class="${className}" data-room="${room}">${room}</div>`);
        });
    });
}

$(document).ready(() => {
    $("#get-started-btn").click(() => {
        $("#landing-page").addClass('d-none');
        $("#name-from").removeClass('d-none');
    });

    $("#login").click(() => {
        let name = $("#name-value").val();
        if (name) {
            localStorage.setItem("name", name);
            $("#name-from").addClass('d-none');
            $("#room-selection").removeClass('d-none');
            fetchChatrooms();
        }
    });

    $("#create-room").click(() => {
        let newRoom = $("#room-value").val();
        if (newRoom) {
            $.get(`/create-chatroom?chatroomName=${newRoom}`, function () {
                fetchChatrooms();
                $("#room-value").val('');
            });
        }
    });

    $(document).on("click", ".chatroom-item", function () {
        currentChatroom = $(this).data("room");
        localStorage.setItem("chatroom", currentChatroom);
        connect(currentChatroom);
    });

    $("#send-btn").click(() => {
        if (stompClient) {
            sendMessage();
            $("#message-value").val('');
        }
    });

    $("#logout-btn, #logout-btn-chat").click(() => {
        localStorage.removeItem("chatroom");
        localStorage.removeItem("name");
        location.reload(); // Reload the page to redirect to the name entry page
    });

    $("#back-btn").click(() => {
        $("#room-selection").removeClass('d-none');
        $("#chat-room").addClass('d-none');
    });

    // On page load
    currentChatroom = localStorage.getItem("chatroom");
    if (!currentChatroom) {
        $("#room-selection").addClass('d-none');
        $("#name-from").removeClass('d-none');
    } else {
        connect(currentChatroom);
    }
});
