<template>
  <v-app>
    <v-main>
      <!-- <HelloWorld/> -->
      <Form />
      <TimeLine />
      <Table />
    </v-main>
  </v-app>
</template>

<script>
/* import HelloWorld from './components/HelloWorld'; */
import Form from './components/Form';
import TimeLine from './components/TimeLine';
import Table from './components/Table';

export default {
  name: 'App',

  components: {
    Form,
    TimeLine,
    Table
  },

  data: () => ({
    //
  }),
};
</script>
