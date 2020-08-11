<template>
    <v-container>
        <v-row class="text-center">
            <!-- <v-card class="mx-auto" > -->
                    <!-- <v-card-title></v-card-title> -->
                    <!-- </v-card> -->
                    
                    <!-- {{ $store.getters.getData }}         
                    <br><br><br><br><br>
                    items:{{items}} -->

            <v-col cols="12">                
                    <div class="header-timeline">
                        <h1>Agenda de Reservas</h1>
                        <div class="legend">
                            <ul >
                                <li><span class="disponible"></span>Disponible</li>
                                <li><span class="reservado"></span>Reservado</li>
                                <li><span class="reserva-actual"></span>Mi Reserva Actual</li>
                            </ul>
                        </div>
                        
                    </div>
                    
                    <!-- <pre>
                    {{items}}
                    </pre> -->

                    <div class="overlay-items">
                        <timeline class="timeline"  ref="timeline" :items="items"  :groups="groups"  :options="options"  :events="['drop', 'changed']" > 
                        </timeline>
                        <span class="button-left">
                            <v-btn>
                                <v-icon @click="leftTimeLine()">mdi-chevron-left</v-icon>
                            </v-btn>
                        </span>

                        <span class="button-right">
                            <v-btn>
                                <v-icon @click="rightTimeLine()">mdi-chevron-right</v-icon>
                            </v-btn>
                        </span>


                        


                    </div>


                    <!-- <v-btn>
                        <v-icon @click="pruebaZoom()">mdi-heart</v-icon>
                    </v-btn> -->
                    
                     
                    <!-- {{ currentDateTimeLine() }}  -->                  

                    <!-- @drop="myDropCallback" 
                     @changed="myChangedCallback" -->
                
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
/* let moment = require('moment'); */

export default {
    data() {
        return {
            groups: [{id: 0,content: '' }],            
            /* orientation: {
                axis: "top",
                item: "top"
            }, */
            options: {
                editable: false,
                /* zoomMax: 87600900,
                zoomMin: 87600900, */      
                /* zoomMax: 315360000000000,*/
                //zoomMin:7200000,
                //zoomMin: 18000000, 
                /* zoomMin: 43200000, */
                locale: this.$moment().locale(),
                /* locales:{}, */
                orientation: {
                    axis: "top",
                    item: "top"
                },     
                showCurrentTime:true,
                height: '200px',
                /* zoomable:false, */
                /* moment: function(date) {
                    return this.$moment(date).utc();
                } */
                margin:{
                    axis:15
                },

            }
        }
    },
    created() {
        let reserva = [
            {name: "Alvarado, Eduardo Alonso", date: this.$moment(new Date()).format('YYYY-MM-DD'), timeStart: "09:30", timeEnd: "10:30"},
            {name: "Acuña Lopez, Juliana", date: this.$moment(new Date()).format('YYYY-MM-DD'), timeStart: "11:00", timeEnd: "12:30"},
            {name: "Arenales, Ingrid Lorena", date: this.$moment(new Date()).format('YYYY-MM-DD'), timeStart: "12:31", timeEnd: "13:30"},
            {name: "Barreto Ruiz, Aldana", date: this.$moment(new Date()).format('YYYY-MM-DD'), timeStart: "13:31", timeEnd: "16:00"},
            {name: "Buitrago Lozano, Daniel Esteban", date: this.$moment(new Date()).format('YYYY-MM-DD'), timeStart: "16:30", timeEnd: "17:30"},
            {name: "Delgado, Angel David", date: this.$moment(new Date()).format('YYYY-MM-DD'), timeStart: "17:31", timeEnd: "19:00"},
        ]
        this.$store.dispatch('setData',reserva);

        /* {name: "Reserva 23381", date: "2020-08-10", timeStart: "11:15", timeEnd: "12:14"},
            {name: "Reserva 48991", date: "2020-08-10", timeStart: "19:31", timeEnd: "23:20"},
            {name: "Reserva 38291", date: "2020-08-10", timeStart: "17:31", timeEnd: "21:20"}, */            
            /* */
    },
    computed:{      
        items(){            
            let idx = 1;       
            let rdo = [];     
            this.$store.getters.getData.forEach(element => {                         
                rdo.push({
                    id: idx,
                    group: 0,
                    content:element.name,                    
                    start:  this.getTimeStart(element),
                    end:  this.getTimeEnd(element),
                    type: 'range',
                    className: 'booked'
                });
                idx++;
            }); 
            
            let currentBooking = this.$store.getters.getCurrentBooking;             
            
            if(currentBooking.name != null  
            && currentBooking.date != null 
            && currentBooking.timeStart != null 
            && currentBooking.timeEnd !=null){
                rdo.push({
                    id: idx,
                    group: 0,
                    content:currentBooking.name,                    
                    start:  this.getTimeStart(currentBooking),
                    end:  this.getTimeEnd(currentBooking),
                    type: 'range',
                    //className:'current-booking'
                    className:this.getClassNameCurrentBooking(currentBooking)
                });
            }
            
            
            return rdo;
        }
    },
    methods:{
        getCurrentBookingError(currentBooking){
            let rdo = true;                         
            this.$store.getters.getData.forEach(element => {
                if(element.date == currentBooking.date){                    
                    let format = 'hh:mm'                    
                    let currentStartTime = this.$moment(currentBooking.timeStart,format);
                    let currentEndTime = this.$moment(currentBooking.timeEnd,format);

                    let elementStartTime = this.$moment(element.timeStart, format);
                    let elementEndTime = this.$moment(element.timeEnd, format);
                    if (
                        currentStartTime.isBetween(elementStartTime, elementEndTime) ||
                        currentEndTime.isBetween(elementStartTime, elementEndTime) ||
                        elementStartTime.isBetween(currentStartTime, currentEndTime) ||
                        elementEndTime.isBetween(currentStartTime, currentEndTime)
                    ) {                        
                        rdo = false;
                    }
                }                
            });
            return rdo;
        },
        getClassNameCurrentBooking(currentBooking){            
            return (this.getCurrentBookingError(currentBooking)) ? 'current-booking' : 'current-booking-error';            
        },        
        leftTimeLine(){                        
            this.move(0.2);            
        },
        rightTimeLine(){            
            this.move(-0.2);            
        },
        move(percentage) {                
                var range = this.$refs.timeline.getWindow();                
                var interval = range.end - range.start;
                let start = new Date(range.start.valueOf() - interval * percentage);
                let end = new Date(range.end.valueOf() - interval * percentage);
                this.$refs.timeline.setWindow(start,end);
        },

        getTimeEnd(element){            
            return this.$moment(element.date + " " +element.timeEnd );
        },
        getTimeStart(element){            
            return this.$moment(element.date + " " +element.timeStart );            
        }
  }
    
}
</script>
<style lang="scss">
.vis-item{
    margin-top: 20px;
    padding-top: 10px;
    height: 60px;
}
.vis-item.current-booking-error{   
    border-color: #fc2403;	
    background-color: #fc2403;
    color:#fff;    
} 
.vis-item.current-booking{    
    border-color: #69dcac;	
    background-color: #69dcac;
    margin-top:0;
}
.overlay-items{
    width: 100%;
    height: 100%;
    background-color:transparent;
    display: inline-block;
    .timeline{
        /* height: 100%; */
        .vis-timeline {
            /* height: 100%; */
            border:none;
            border:unset;
        }
    }
}

.header-timeline{
    display: inline;
    h1, .legend{        
        width: 50%;
        margin-bottom:35px;
    }
    h1{
        float: left;
        text-align: left;
        font-weight: normal;
    }
    .legend{ 
        float: right;
        text-align: right;
        ul{
            list-style-type: none;
            display: inline;            
            li {
                display: inline;                
            }    
            .disponible, .reservado,.reserva-actual{                
                height: 25px;
                width: 25px;
                padding-right: 12px;
                padding-left: 5px;
                margin-left: 30px;
                margin-right: 8px;                
                border-color: #000;
                box-shadow:0 2px 4px rgba(0,0,0,0.2);
            }
            .disponible{
                background-color:#fff;
            }
            .reservado{
                background-color:#fff48c;
            }
            .reserva-actual{
                background-color:#036d5e;
            }
        }
    } 
    /* div{
        
    }
    .legend{
         display: inline-block;
    } */
    
}
.button-left, .button-right {
    margin-top: -200px;
    .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {        
        background-color: rgba(255,255,255,0.6);
        min-height: 200px;    
    }    
    /* position:relative; */
    .v-btn--icon.v-size--default, 
    .v-btn.v-btn--contained.theme--light.v-size--default{
        /* height: 200px;         */
        .v-icon.v-icon {            
            font-size: 64px;
        }
    }    
    z-index: 99;
}
.button-left{
    position: relative;
    float:left;
    left:0;
} 
.button-right {
    position: relative;
    float:right;
    right:0;
}
/************************************************** */
 .vis-time-axis .vis-grid.vis-saturday,
  .vis-time-axis .vis-grid.vis-sunday {
    background: gray;
  }
  .vis-time-axis .vis-text.vis-saturday,
  .vis-time-axis .vis-text.vis-sunday {
    color: white;
  }



</style>