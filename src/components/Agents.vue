<template>
<div>
  <br>
  <div class="agents">
    <v-btn @click="logout">
      Logout
    </v-btn>
  </div>
  <br>
  <hr>
  <br>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex sm12 xs12>
        <h3 class="panel-title">Add New Ag</h3>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="newAgent.name" :rules="emptyTextRules" label="Nombre" required></v-text-field>
          <v-text-field v-model="newAgent.surname" :rules="emptyTextRules" label="Apellido 1" required></v-text-field>
          <v-text-field v-model="newAgent.secondSurname" :rules="emptyTextRules" label="Apellido 2" required></v-text-field>
          <v-text-field v-model="newAgent.idAgent" :rules="emptyTextRules" label="Identificación" required></v-text-field>
          <v-text-field v-model="newAgent.alias" :rules="emptyTextRules" label="Alias" required></v-text-field>
          <v-btn :disabled="!valid" @click="addAgent">
            Guardar
          </v-btn>
        </v-form>
      </v-flex>
      <v-flex sm12 xs12>
        <br><br>
        <h3 class="panel-title">Ags</h3>
        <br>
        <v-data-table
          :headers="headers"
          :items="agents"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.data.idAgent }}</td>
            <td>{{ props.item.data.name }}</td>
            <td>{{ props.item.data.surname }}</td>
            <td>{{ props.item.data.secondSurname }}</td>
            <td>{{ props.item.data.alias }}</td>
            <td><v-icon @click="deleteAgent(props.item.docId)">delete</v-icon></td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import Firebase from 'firebase'
import { db } from '../main'

export default {
  name: 'Agents',
  data () {
    return {
      agents: [],
      msg: 'Bienvenido',
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido 1', value: 'apellido-1' },
        { text: 'Apellido 2', value: 'apellido-2' },
        { text: 'Alias', value: 'alias' },
        { text: '¿Borrar?', value: 'borrar' }
      ],
      emptyTextRules: [
        v => !!v || 'Debe rellenar este campo'
      ],
      newAgent: {
        idAgent: '',
        name: '',
        secondSurname: '',
        surname: '',
        alias: ''
      },
      valid: true
    }
  },
  methods: {
    logout: function () {
      Firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },
    addAgent: function () {
      if (this.$refs.form.validate()) {
        db.collection('agents').add(this.newAgent)
          .then((docRef) => {
            this.fetchAgents()
          },
          function (err) {
            alert('Error al insertar... ' + err.message)
          })
      }
    },
    fetchAgents: function () {
      this.agents = []
      db.collection('agents').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.agents.push({ docId: doc.id, data: doc.data() })
          })
          console.log(this.agents)
        })
    },
    deleteAgent: function (docId) {
      db.collection('agents').doc(docId).delete()
        .then(() => {
          this.fetchAgents()
        })
        .catch((error) => {
          console.error('Error removing document: ', error)
        })
    }
  },
  created: function () {
    this.fetchAgents()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
