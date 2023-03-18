const farkelRoom        = {}
const farkelUser        = {}
const farkelWinScore    = 2000
const farkelLimitRoom   = 6
const nbDice            = 6
const {isEnoughtSpaceInRoom,playerAlreadyExist,roomAlreadyExist,roomIsInGame,userIsReady} = require('./funcSessionManagement')


/**
 * function for sending intel of room to every participant
 */
const sendIntelOfUserInRoom = (socket,room)=>{
    socket.emit('refreshListStatus',{payload : [farkelRoom[room]]})
    for(const user in farkelRoom[room]){
        if(user !== "nbUserInRoom" && user !== "inGame" ){
            socket.broadcast.to(user).emit('refreshListStatus',{payload : farkelRoom[room]})
        }
    }
}

/**
 * function for create user in global liste
 */
const joinUserList = (payload,id)=>{
    farkelUser[id] = {
            name : payload.name,
            roomId : payload.roomId,
        }
}


/**
 * function for upgrade room or creating another
 */
const joinOrCreateSession = (data,id,buildRoom=false)=>{
    if(!buildRoom){
        farkelRoom[data.roomId].nbUserInRoom += 1
        farkelRoom[data.roomId] = {
            ...farkelRoom[data.roomId],
            [id]:{
                idRoom          : data.roomId,
                ready2play      : false,
                currentScore    : 0,
                score           : 0,
                myTurn          : false,
                isAlive         : true,
                name            : data.name,
                position        : farkelRoom[data.roomId].nbUserInRoom,
                canPlay         : false,
                choice          : false,
                nbDice          : nbDice,
            }
        }
        return
    }
    farkelRoom[data.roomId] = {
        [id]:{
            idRoom              : data.roomId,
            ready2play          : false,
            currentScore        : 0,
            score               : 0,
            myTurn              : true,
            isAlive             : true,
            name                : data.name,
            position            : 1,
            canPlay             : false,
            choice              : false,
            nbDice              : nbDice,
        },
        selectPositionInGame    : 1,
        nbUserInRoom            : 1,
        inGame                  : false,
    }
    return
}

/**
 * function to regulate login in server
 */

const manageLoginUser = (socket,payload)=>{
    if(playerAlreadyExist(farkelUser,socket.id)){                                           // control if user already exist 
        socket.emit('responseLogin',{state:false,reason:1})
    }
    else{
        if(roomAlreadyExist(farkelRoom,payload.roomId)){                                    // control if room targeted by the client exist
            if(!roomIsInGame(farkelRoom,payload.roomId)){                                   // control if game was started 
                if(isEnoughtSpaceInRoom(farkelRoom,farkelLimitRoom,payload.roomId)){        // control if room has enought space 
                    joinOrCreateSession(payload,socket.id)                                  // add client to the targeted room
                    joinUserList(payload,socket.id)                                         // add client to the global list of user
                    socket.emit('responseLogin',{state:true,reason:0})                      // send to client the confirmation that it's part of this room
                    sendIntelOfUserInRoom(socket,payload.roomId)                              // send to everyone in the room targeted intel about room 
                }else{
                    socket.emit('responseLogin',{state:false,reason:2})                     // send to client, the room is already full 
                }
            }else{
                socket.emit('responseLogin',{state:false,reason:4})                         // send to client, the room is not available because the game was already launched 
            }
        }else{
            joinOrCreateSession(payload,socket.id,true)                                     // build room and add user in this room
            joinUserList(payload,socket.id)
            socket.emit('responseLogin',{state:true,reason:0})                              // send to client the confirmation that it's part of this room
            sendIntelOfUserInRoom(socket,payload.roomId)                                      // send to everyone in the room targeted intel about room 
        }
    }
}


/**
 * function for control disconnection
 */
const manageDisconnectionUser = (socket,idUserDisconnected)=>{
    let roomIdOfDisconnectedUser = farkelUser[idUserDisconnected].roomId
    if(roomIsInGame(farkelRoom,roomIdOfDisconnectedUser)){
        farkelRoom[roomIdOfDisconnectedUser][idUserDisconnected].isAlive = false
    }else{
        farkelRoom[roomIdOfDisconnectedUser].nbUserInRoom -= 1
        delete farkelRoom[roomIdOfDisconnectedUser][idUserDisconnected]
    }
    sendIntelOfUserInRoom(socket,roomIdOfDisconnectedUser)
}


/**
 * function to change readyState in waiting room
 */
const manageReadyStateUser = (socket,payload)=>{
    if(!userIsReady(farkelRoom,socket.id,payload.room)){
        farkelRoom[payload.room][socket.id].ready2play = true
        sendIntelOfUserInRoom(socket,payload.room)
    }
}


const Farkel = (socket)=>{
    /**
     * event to manage client login in game
     */
    socket.on('loginEvent',(payload)=>{
        console.log("login : ",payload)
        manageLoginUser(socket,payload)
    })

    socket.on("clientIsReady",(payload)=>{
        manageReadyStateUser(socket,payload)
    })

    socket.on('disconnect',()=>{
        console.log("deco : ",socket.id)
        if(playerAlreadyExist(farkelUser,socket.id)){
            manageDisconnectionUser(socket,socket.id)
        }
    })


}

module.exports =  {  
    Farkel
}