// const uid = () => Math.random().toString(34).slice(2);

import axios from 'axios';
export const SET_ACTIVE_FIELD = 'SET_ACTIVE_FIELD';
var __CONFIG__ = require('__CONFIG__');

export function setActiveField(idx) {
  return {
    type: 'SET_ACTIVE_FIELD',
    payload: idx
  };
}

export const CLEAR_ALL = 'CLEAR_ALL';
export function clearAll() {
  return {
    type: 'CLEAR_ALL'
  };
}

export const SET_FIELD_SELECTION = 'SET_FIELD_SELECTION';
export function setFieldSelection(idx,selection) {
  return dispatch => {
    dispatch({
    type: 'SET_FIELD_SELECTION',
    payload: {
      idx: idx,
      selection: selection
    }
    });
  }
}



var buildQueryObj = function buildQueryObj(state){
    console.log('in buildQ actions', state.reducer);

 var queryRoot = {};
          state.reducer.getIn(['searchFields']).map(f => {
          //console.log('i&&^&^&^&^&^^&^& from selected', f.get('selected'));
          //console.log('i&&^&^&^&^&^^&^& ujsingField', f.get('id'));
          var theValue = f.get('selected');
          var theField = f.get('id');
          
          if( theField !== 'Opts' && theValue.length > 0) {
             //coding around that fucking react-select API inconsistency.....
             if (theValue[0].match(/,/)){
               theValue = theValue[0].split(',');
               //theValue=theValue.splice(0,theValue.length - 1);
              }

            if( theValue.length > 1) {
               //  console.log('mutli selection');
                var theObj = {};
                theObj.$in=theValue;
                queryRoot[f.get('id')]=theObj;
              }
              else {
                if (f.get('id') === 'Year') {
                  console.log('detected YEAR', theValue);
                  if (theValue[0].match(/,/)) {
                    console.log('multiple year');
                    var years = theValue[0].split(',');                       
                      year = years.map(function(v){
                        return parseInt(f);
                      });  
                  queryRoot[f.get('id')] = years;
                  } else {
                  queryRoot[f.get('id')] = parseInt(theValue);
                  }
                  
                } else {
                  queryRoot[f.get('id')] = theValue;
                }
              }
      } else if ( theValue.length > 0 && theField ==='Opts'){
        console.log('detected opts', theValue);
            if (theValue[0].match(/,/)){
                //trim damn API inconsistency
                

               var theObj={};
               var theValueArr = theValue[0].split(',');
               console.log('theValueArr', theValueArr);
               theObj.$in=theValueArr;
               queryRoot[theField] = theObj;  
            } else
            {
                var theObj = {};
                theObj.$in=theValue;
                queryRoot[theField] = theObj;  
            }   

      } else if (theValue.length === 0){
        console.log('no value set')
      }
      
      }) 

      return queryRoot;
}

export function setFieldSelectionAndFetchData(idx,selection){
  return function (dispatch, getState) {
    console.log('in sFSAFD what is my selection????', selection);
    dispatch(setFieldSelection(idx,selection));
    var state=getState();
    var qObj = buildQueryObj(state);
    //only get new count on Opts selection
    var nextFieldMap = state.reducer.getIn(['searchFields',idx+1]);
    if (idx!=7){
      var nextId = nextFieldMap.get('id');
      console.log('now fetch fields for ->', nextId);
      console.log('using ->', qObj);
      dispatch(fetchFields(nextId, qObj));
    } else {
      console.log('using ->', qObj);
      dispatch(fetchCount(qObj))      
    }
  } 
}//endfunc

export const REQUEST_FIELDS = 'REQUEST_FIELDS'
export function requestFields(field) {
  return {
    type: REQUEST_FIELDS,
    field,
    selectionObj
  }
}

export const RECEIVE_FIELDS = 'RECEIVE_FIELDS'
export function receiveFields(field, valArr, count) {
  return {
    type: RECEIVE_FIELDS,
    payload: {
      field: field,
      values: valArr,
      receivedAt: Date.now()
    }
  }
}

export const RECEIVE_COUNT = 'RECEIVE_COUNT'
export function receiveCount(count) {
  return {
    type: RECEIVE_COUNT,
    payload: {
      count: count,
    }
  }
}

export const API_ERROR = 'API_ERROR'
//todo: alert
export function apiError(error){
 return {error, type: API_ERROR}; 
}

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchFields(objectFieldId, queryObj) {
  console.log('in fetchFields', objectFieldId );
  console.log('in fetchFields', queryObj );
  console.log( __CONFIG__ );
  
  

    return dispatch =>
        axios.post( __CONFIG__.apiHost + '/api/pcnacarsmeta', 
          {
            distinct: objectFieldId,
            queryObj: queryObj,
          }).then(res => {
            console.log('RESRESRESRESRESRESRESRES', res);
            dispatch(receiveFields(objectFieldId, res.data.values));
            dispatch(receiveCount(res.data.count));
          }).catch(err => {
            dispatch(apiError(err));
          });
}

export function fetchCount(queryObj) {
  console.log('in fetchCount', queryObj );
  
    return dispatch =>
        axios.post( __CONFIG__.apiHost + '/api/pcnacarscount', 
          {
            queryObj: queryObj,
          }).then(res => {
            console.log('RESRESRESRESRESRESRESRES', res);
            dispatch(receiveCount(res.data.count));
          }).catch(err => {
            dispatch(apiError(err));
          });
}