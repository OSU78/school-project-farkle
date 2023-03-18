/**
 *  control if there is enought space in this room
 */
const isEnoughtSpaceInRoom = (farkelRoom,farkelLimitRoom,room)=> { 
    if(farkelRoom[room]){
        if(farkelRoom[room].nbUserInRoom < farkelLimitRoom){
            return true
        }
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
    if(farkelRoom[room]){
        if(farkelRoom[room].inGame){
            return true
        }
    }
   return false
}

/**
 * function to control if a specific user in specific room is ready
 */
const userIsReady = (farkelRoom,id,room)=>{
    if(farkelRoom[room]){
        if(farkelRoom[room][id]){
            if(farkelRoom[room][id].ready2play){
                return true
            }
        }
    }
    return false
}

/**
 * function for check if there is only one player in the room
 */
const isTheOnlyOnePlayerInThisRoomInGame = (farkelRoom,room)=>{
    if(farkelRoom[room]){
        if(farkelRoom[room].inGame && farkelRoom[room].nbUserInRoom === 1){
            return true
        }
    }
    return false
}

/**
 * function to check if there is nobody in the room
 */
const isThisRoomIsEmpty = (farkelRoom,room)=>{
    if(farkelRoom[room]){
        if(farkelRoom[room].nbUserInRoom === 0 && !farkelRoom[room].inGame){
            return true
        }
    }
    return false
}

/**
 * function to check if the decision is to continue
 */
const isTheUserWantToContinue = (decision)=>{
    if(decision){
        return true
    }
    return false
}

/**
 * function to check if this user is the winner
 */
const isThisPlayerIsTheWinner = (limit,valueScored)=>{
    if(valueScored >= limit){
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
    isTheOnlyOnePlayerInThisRoomInGame,
    isThisRoomIsEmpty,
    isTheUserWantToContinue,
    isThisPlayerIsTheWinner,
}