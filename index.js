const http = require("http");
const WebSocketServer = require("websocket").server;
const { router } = require("websocket");

let connections = [];


//Although, it is not required, but out of simplicity,
//I am creating a welcome page for the server.
const routes = {
    "/": (req, res) => {
        res.writeHead(200, {"Content-Type": "text/plain"})
        res.end("Welcome to the server!")
    }
}

const httpserver = http.createServer((req, res) => {
    if(req.url in routes) {
        routes[req.url](req, res)
    }
    else {
        res.writeHead(404, {"Content-Type": "text/plain"})
        res.end("URL not found")
    }
});

//websocket is the bidirectional protocol
//bcz it is implemented underneath TCP
const websocket = new WebSocketServer({ "httpServer" : httpserver });

websocket.on("request", request => {
    const connection = request.accept(null, request.origin)
    connection.on("message", message => {
        connections.forEach(c => c.send(`User${connection.socket.remotePort} says ${message.utf8Data}`))
    })

    connections.push(connection)
    connections.forEach(c => c.send(`User${connection.socket.remotePort} just connected.`))
})

//listen on the TCP socket
httpserver.listen(8080, () => {
    console.log("Server running on port 8080");
});