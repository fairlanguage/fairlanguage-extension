import axios from 'axios';

const addText = (id) => {

  return (dispatch) => {

    dispatch({type: "DETECTED_INPUT", payload: id})
  
  }

}

const checkText = (text, id) => {

  return (dispatch) => {

    dispatch({type: "SUBMITTED_TEXT", payload: {id: id, text: text}})

    const payload = {
      id: id,
      suggestion: []
    }

    //If text is empty dispatch suggestions anyway to reset the counter
    if(text==='')
    dispatch({type: "RECEIVED_SUGGESTIONS", payload:payload})

 
    let url = `https://fairlanguage-api-dev.dev-star.de/checkDocument?json&data=${encodeURI(text)}`;
    //console.log(url)

    axios.get(`${url}`)
      .then((response) => {

        payload.suggestion = response.data
        
        if(response.data.length>0){
        dispatch({type: "RECEIVED_SUGGESTIONS", payload:payload})
        }else{
          payload.suggestion = []
          dispatch({type: "RECEIVED_SUGGESTIONS", payload:payload})
        }
      
      })
      .catch((err) => {
        //dispatch({type: "RECEIVE_BLOCKS_ERROR", payload: err})
      });
 
    //Text has been sent
    //dispatch({type: "RECEIVE_WORDS", payload: pseudo})

  }

}

export {addText, checkText}