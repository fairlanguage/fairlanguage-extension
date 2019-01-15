const init = [];

export default (state = init, action) => {

  switch(action.type){

    case "DETECTED_INPUT":
      
      let oldState = state;

      oldState.push({
            id: action.payload,
            text: '',
            detectedWords: []
          })

      let newState = new Array()

      oldState.forEach((el) => {
        newState.push(el)
      })

      return newState;
    break;

    case "SUBMITTED_TEXT":
      const id = action.payload.id;
      const text = action.payload.text;

      newState = new Array()
      
      oldState = state;

      oldState.forEach((el) => {
        if(el.id===id)
        el.text = text

        newState.push(el)
      })

      return newState
    break;

    case "RECEIVED_SUGGESTIONS":
    
      newState = new Array()
      
      oldState = state;

      oldState.forEach((el) => {
        if(el.id===action.payload.id)
        el.detectedWords = action.payload.suggestion

        newState.push(el)
      })

      return newState
    break;

  }

  return state;
  
}