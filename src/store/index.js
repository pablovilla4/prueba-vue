import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        data:[],
        currentBooking:{
            name:null,
            date:null,
            timeStart:null,
            timeEnd:null
        },
        currentBookingSave:false
    },
    mutations: {
        setData(state,payload){
            state.data = payload;
        },
        addData(state,val){            
            let add = true;
            state.data.forEach(element => {
                if(JSON.stringify(element) === JSON.stringify(val)){
                    console.log(JSON.stringify(element));
                    console.log(JSON.stringify(val));                      
                    add = false;
                }
            });

            if(add){
                state.data.push(val);
                state.currentBooking = {
                    name:null,
                    date:null,
                    timeStart:null,
                    timeEnd:null
                }
                state.currentBookingSave = true;
            }
        },
        removeBooking(state,val){
            /* console.log("removeBooking mutations");
            console.log(state); */
            state.data.splice(val.id, 1);
            /* console.log(val.id);
            console.log(state); */
        },
        setCurrentBooking(state,val){
            state.currentBooking = val;
        },
        setCurrentBookingSave(state,val){
            state.currentBookingSave = val;
        }
    },
    actions: {
        setData({commit},payload){
            commit('setData',payload);
        },
        save({state, commit}){                        
            commit('addData',state.currentBooking);
        },
        setCurrentBooking({commit},payload){            
            commit('setCurrentBooking',payload);            
        },
        setCurrentBookingSave({commit},payload){
            commit('setCurrentBookingSave',payload);            
        },
        removeBooking({commit},payload){
            commit('removeBooking',payload);            
        }
    },
    getters: {
        getData: state => {
          return state.data;
        },
        getCurrentBooking: state => {
            return state.currentBooking;
        }
    }
})