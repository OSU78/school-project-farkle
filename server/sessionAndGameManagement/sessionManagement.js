const farkelRoom        = {}
const farkelUser        = {}
const farkelWinScore    = 2000
const farkelLimitRoom   = 6

/**
 *  control if there is enought space in this room
 */
const isEnoughtSpaceInRoom = (room)=> { 
    if(farkelRoom[room].nbUserInRoom < farkelLimitRoom){
        return true
    }
    return false
}

/**
 *  control if there is another user with the same name
 */
const playerAlreadyExist = (name)=>{
    if(farkelUser[name]){
        return true
    }
    return false
}

/**
 * control if the room exist for creating or join room
 */
const roomAlreadyExist = (room)=>{
    if(farkelRoom[room]){
        return true
    }
    return false
}

/**
 * function to control if the game has begin 
 */
const roomIsInGame = (room)=>{
    if(farkelRoom[room].inGame){
        return true
    }
    return false
}


/**
 * function for upgrade room or creating another
 */
const joinOrCreateSession = (data,id,buildRoom=false)=>{
    if(buildRoom){
        farkelRoom[data.roomId] = {
            ...farkelRoom[data.roomId],
            [id]:{
                idRoom      : data.roomId,
                ready2play  : false,
                score       : 0,
                myTurn      : true,
                isAlive     : true,
                name        : data.name
            }
        }
        farkelRoom[data.roomId].nbUserInRoom += 1
        return
    }
    farkelRoom[data.roomId] = {
        [id]:{
            idRoom      : data.roomId,
            ready2play  : false,
            score       : 0,
            myTurn      : true,
            isAlive     : true,
            name        : data.name
        },
        nbUserInRoom    : 1,
        inGame          : false,
    }
    return
}


const Farkel = (socket)=>{

    /**
     * event to manage client login in game
     */
    socket.on('loginEvent',(payload)=>{
        if(playerAlreadyExist(payload.name)){                                  // control if user already exist 
            socket.emit('responseLogin',{state:false,reason:1})
        }
        else{
            if(roomAlreadyExist(payload.roomId)){                              // control if room targeted by the client exist
                if(!roomIsInGame(payload.roomId)){                             // control if game was started 
                    if(isEnoughtSpaceInRoom(payload.roomId)){                  // control if room has enought space 
                        joinOrCreateSession(payload,socket.id)                 // add client to the targeted room
                        joinUserList(payload,socket.id)                        // add client to the global list of user
                        socket.emit('responseLogin',{state:true,reason:0})     // send to client the confirmation that it's part of this room
                    }else{
                        socket.emit('responseLogin',{state:false,reason:2})    // send to client, the room is already full 
                    }
                }else{
                    socket.emit('responseLogin',{state:false,reason:4})        // send to client, the room is not available because the game was already launched 
                }
            }else{
                joinOrCreateSession(payload,socket.id,true)
                joinUserList(payload,socket.id)
                socket.emit('responseLogin',{state:true,reason:0})
            }
        }
    })

}

module.exports =  {  
    Farkel
}