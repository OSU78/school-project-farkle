/**
 *  control if there is enought space in this room
 */
const isEnoughtSpaceInRoom = (farkelRoom,farkelLimitRoom,room)=> { 
    if(farkelRoom[room].nbUserInRoom < farkelLimitRoom){
        return true
    }
    return false
}

/**
 *  control if there is another user with the same name
 */
const playerAlreadyExist = (farkelUser,idUser)=>{
    if(farkelUser[idUser]){
        return true
    }
    return false
}

/**
 * control if the room exist for creating or join room
 */
const roomAlreadyExist = (farkelRoom,room)=>{
    if(farkelRoom[room]){
        return true
    }
    return false
}

/*
* function to control if the game has begin 
*/
const roomIsInGame = (farkelRoom,room)=>{
   if(farkelRoom[room].inGame){
       return true
   }
   return false
}

/**
 * function to control if a specific user in specific room is ready
 */
const userIsReady = (farkelRoom,id,room)=>{
    if(farkelRoom[room][id].ready2play){
        return true
    }
    return false
}

module.exports = {
    isEnoughtSpaceInRoom,
    playerAlreadyExist,
    roomAlreadyExist,
    roomIsInGame,
    userIsReady,
}