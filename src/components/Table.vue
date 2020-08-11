<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">                 
                    <v-data-table :headers="headers" :items="reservas" :items-per-page="10"  >
                        <template v-slot:item.action="{ item }">
                            <!-- {{ item }}       -->                      
                            <v-btn icon @click="deleteItem(item)">
                                 <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>                
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
/*reservas
                date:this.date,
                timeStart:this.timeStart,
                timeEnd:this.timeEnd
*/

export default {
    computed: {
        /* getData () {      
            return this.$store.getters.getData;
        } */        
        reservas(){
            //console.log(this.$store.getters.getData);
            //let dataSet = this.$store.getters.getData;
            let rdo = [];
            this.$store.getters.getData.forEach((element,idx) => {
                rdo.push({
                    name:element.name,
                    fecha:this.$moment(element.date,"YYYY-MM-DD").format('DD/MM/YYYY'),                    
                    horario:'de ' + element.timeStart + ' a ' + element.timeEnd,
                    id:idx
                });
            });
            return rdo;
        }
    },
    methods:{
        deleteItem(item){
            this.$store.dispatch('removeBooking',item);            
        }
    },
    data () {
        return {            
            headers: [
                {text:'Nombre', value: 'name'},
                {text:'Fecha', value: 'fecha'},
                {text:'Horario', value: 'horario'},
                {text: 'Accion', value: "action" }                
            ]
        }
    }
}
</script>
<style lang="scss">

</style>