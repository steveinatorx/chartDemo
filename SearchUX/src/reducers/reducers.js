import { List, Map } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { sortBy } from 'lodash';

const init = new Map({
  uuid: null,
  email: null,
  searchCode: null,
  resultsCount: 0,
  lastAction: null,
  searchFields: new List([
    Map({ id: 'Model', navLabel: 'model', label: 'model', idx: 0, isActive: true, opts: [
    { label: "918 Spyder", value: "918 Spyder" },
    { label: "980 Carrera GT", value: "980 Carrera GT"},
    { label: "997 Speedster", value: "997 Speedster" },
    { label: "GT2", value: "GT2"}, 
    { label: "GT2 RS", value: "GT2 RS"}, 
    { label: "GT3 3.6", value: "GT3 3.6"},
    { label: "GT3 RS 3.6", value: "GT3 RS 3.6" },
    { label: "GT3 3.8", value: "GT3 3.8" },
    { label: "GT3 RS 3.8", value: "GT3 RS 3.8" },
    { label: "GT3 RS 4.0", value: "GT3 RS 4.0" },
    { label: "Turbo 3.6", value: "Turbo 3.6" },
    { label: "Turbo 3.8", value: "Turbo 3.8" },
    { label: "Turbo S 3.8", value: "Turbo S 3.8" },
  ], metaMulti: false,
  selected: [] }),
    Map({ id: 'Body', navLabel: 'body', label: 'body', idx: 1, isActive: false, opts: [], metaMulti: true, selected: [] }),
    Map({ id: 'Year', navLabel: 'year', label: 'year', idx: 2, isActive: false, opts: [], metaMulti: true, selected: [] }),
    Map({ id: 'Country', navLabel: 'country', label: 'country', idx: 3, isActive: false, opts: [], metaMulti: true, selected: [] }),
    Map({ id: 'Transmission', navLabel: 'trans', label: 'transmission', idx: 4, isActive: false, opts: [], metaMulti: true, selected: [] }),
    Map({ id: 'ExtLabel', navLabel: 'ext color', label: 'exterior color', idx: 5, isActive: false, opts: [], metaMulti: true, selected: [] }),
    Map({ id: 'IntLabel', navLabel: 'int color', label: 'interior color', idx: 6, isActive: false, opts: [], metaMulti: true, selected: [] }),
    Map({ id: 'Opts', navLabel: 'options', label: 'options', idx: 7, isActive: false, opts: [], metaMulti: true, selected: [] }),
  ])
});

export default function reducer (state = init, action) {
  // console.log('in reducer---->', action);
  switch (action.type) {
    case 'CLEAR_ALL':
      return init;
    case 'SET_UUID':
      return state.set('uuid', action.payload.uuid);
    case 'SET_ACTIVE_FIELD':
      var newSearchFields = state.getIn(['searchFields']).map(f => {
         // console.log('mapiing reducer->', f.get('idx'));
        if(f.get('idx') === action.payload) {
           // console.log('GOOD payload match idx?', f.get('idx'));
          return f.update('isActive', isActive => true);
        } else {
          return f.update('isActive', isActive => false);
        }
      });
      //return state.setIn(['searchFields', action.payload, 'isActive'], true); 
      return state.setIn(['searchFields'], newSearchFields);
    case 'RECEIVE_COUNT':
      //console.log('setting count', action.payload.count);
      return state.set('resultsCount', action.payload.count);
    case 'RECEIVE_FIELDS':

      var objId = state.getIn(['searchFields']).filter( f=>{
        if (f.get('id') === action.payload.field){
          return true;
        } else { 
          return false;
        }
      });
      //convert to multiselect object and strings?
      var optObjs = action.payload.values.map( o => {
            if (action.payload.field === 'Opts') {
              var code = o.substring(0,o.indexOf(' '));
              var label = o.substring(o.indexOf(' ') +1 ) + ' ' + code;
            } else {
              var label=o.toString();
            }
            return { label: label, value: o.toString()} 
      });
      //sort lexi
      optObjs = sortBy(optObjs);
      
      if ((action.payload.field !== 'Opts') && (objId.toJS()[0].metaMulti === true) && ( action.payload.values.length > 1 )) {
        //console.log('detected MULTI so add "all" to selections');
        optObjs.unshift({ label: 'All', value: 'all'});
      }
      //console.log('receive fields idx', objId.toJS()[0].idx);
      return state.setIn(['searchFields',objId.toJS()[0].idx,'opts'],optObjs);
      
    case 'SET_FIELD_SELECTION':
      const selection=action.payload.selection;
      const idx = action.payload.idx;
      //gather all existing selections, get idx +1 id for distinct
      return state.setIn(['searchFields', idx, 'selected'], action.payload.selection);
      //return state;
    case 'LOCATION_CHANGE':
     const pathname = action.payload.pathname;
     // /redux-history-demo/:operation
     const [_, operation = ""] = pathname.split('/');
     return operation;
    default:
      return state;
  }
};