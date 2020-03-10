/*node js  웹소켓 모듈 지원 여부 확인*/
var WebSocket = require("ws");
var http = require("http");
var fs = require("fs"); //File Sytem :  원래 자바스크립트는 웹용이라서
//로컬 파일을 제어할 수 없으나, node.js에서는 이게 가능하다!!!
//자바스크립트가 웹에서 --> 응용프로그램으로 발전한 것임!!

var clientArray=[]; //접속자가 발생할때마다, 소켓을 보관해놓자!!

var webServer = http.createServer(function(request , response){

    fs.readFile("client.html", "utf8", function(err, data){
        response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
        response.end(data);
    });
});

//console.log(WebSocket);
//서버 생성 
var server = new WebSocket.Server({port:7777});

//java ServerSocket과 같이 접속자를 감지하는 기능
//callback  함수의 인수로 대화용 소켓이 전달된다!!!
server.on("connection" , function(socket){

    //대화 참여자로 등록!!
    clientArray.push(socket);
    console.log("현재 접속자", clientArray.length,"명");

    //접속자와 대화하기!!!
    socket.on("message", function(data){
        console.log("클라이언트의 메시지: " , data);

        //클라이언트의 메시지를 다시 보내자 (echo)
        //모든 접속자를 대상으로 send를 호출한다 ( 멀티케스팅 )
        for(var i=0;i<clientArray.length;i++){
            clientArray[i].send(data);
        }
    });

});

webServer.listen(8888, function(){
    console.log("The server is running at 8888 port...");
});
