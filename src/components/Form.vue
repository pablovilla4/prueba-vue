<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                 <v-card class="mx-auto" >
                    <v-card-title>
                        RESERVAR
                    </v-card-title>
                    
                    <!-- aca ve el form -->
                    <v-form v-model="valid">
                        <v-container>
                            <v-row>
                                <v-col cols="5">
                                    <!-- :counter="10" :rules="nameRules"-->
                                    <v-text-field v-model="name" label="Nombre" required outlined ></v-text-field>
                                </v-col>
                                
                                <v-col cols="2">
                                    <v-menu ref="datePick" v-model="datePick" :close-on-content-click="false" transition="scale-transition" offset-y >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="dateFormatted" label="Fecha" hint="DD/MM/YYYY format" persistent-hint append-icon="event" v-bind="attrs" @blur="date = parseDate(dateFormatted)" v-on="on" outlined></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" no-title @input="datePick = false"></v-date-picker>
                                    </v-menu>
                                    <!-- <p>Date in ISO format: <strong>{{ date }}</strong></p> -->
                                </v-col>

                                <v-col cols="2">
                                    <v-menu ref="timePickStart" v-model="timePickStart" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeStart" transition="scale-transition" offset-y >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="timeStart" outlined label="Desde" append-icon="access_time" readonly v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-time-picker v-if="timePickStart" v-model="timeStart" full-width @click:minute="$refs.timePickStart.save(timeStart)"></v-time-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="2">                                    
                                    <v-menu ref="timePickEnd" v-model="timePickEnd" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeEnd" transition="scale-transition" offset-y >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="timeEnd" outlined label="Hasta" append-icon="access_time" readonly v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-time-picker v-if="timePickEnd" v-model="timeEnd" full-width @click:minute="$refs.timePickEnd.save(timeEnd)"></v-time-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="1">
                                    <v-btn large color="primary" @click="guardar()">GUARDAR</v-btn>
                                </v-col>

                            </v-row>
                        </v-container>
                    </v-form> 
                    <!-- aca ve el form -->

                 </v-card>
            </v-col>
        </v-row>

        <!-- name: {{ name }}<br>
        date: {{ date }} => new Date().toISOString().substr(0, 10) <br>
        dateFormatted: {{ dateFormatted }} => "08/08/2020" <br>
        timeStart:{{ timeStart }} <br>
        timeEnd:{{ timeEnd }} <br>
        timePickStart: {{ timePickStart }} <br>
        timePickEnd:{{ timePickEnd }} <br>
        valid:{{ valid }} <br>
        datePick:{{ datePick }} <br>
        time:{{time}} <br> --> 
        <br>        
        
    </v-container>
</template>
<script>
export default {
    data () {
      return {
        name:null,
        date: new Date().toISOString().substr(0, 10),
        dateFormatted:null,
        timeStart:null,
        timeEnd:null,
        timePickStart:false,
        timePickEnd:false,        
        valid:false,
        datePick:false,
        time:null,
      }
    },
    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
        this.setCurrentBooking();
      },
      name: function (val) {
        this.name = val; 
        this.setCurrentBooking();
      },
      timeStart:function (val) {
        this.timeStart = val; 
        this.setCurrentBooking();
      },
      timeEnd:function (val) {
        this.timeEnd = val; 
        this.setCurrentBooking();
      },

    },
   
    methods:{        
        setCurrentBooking(){
                let reserva = {
                    name:this.name,
                    date:this.date,
                    timeStart:this.timeStart,
                    timeEnd:this.timeEnd
                }
                this.$store.dispatch('setCurrentBooking',reserva);
        },
        clearForm(){            
            this.name = null;
            this.date = new Date().toISOString().substr(0, 10);
            this.dateFormatted = null;
            this.timeStart = null;
            this.timeEnd = null;
            this.timePickStart = false;
            this.timePickEnd = false;        
            this.valid = false;
            this.datePick = false;
            this.time = null;
        },
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
        guardar(){
            let reserva = {
                    name:this.name,
                    date:this.date,
                    timeStart:this.timeStart,
                    timeEnd:this.timeEnd
            }
            if(this.getCurrentBookingError(reserva)){                
                this.$store.dispatch('setCurrentBooking',reserva);
                this.$store.dispatch('save');
                this.clearForm();
                /* if(this.$store.getters.currentBookingSave == true){                    
                    this.$store.dispatch('setCurrentBookingSave',false);
                    this.clearForm();
                } */
            }
        },
        formatDate (date) {
            if (!date) return null
            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        parseDate (date) {
            if (!date) return null
            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    }
}
</script>
<style lang="scss">

</style>