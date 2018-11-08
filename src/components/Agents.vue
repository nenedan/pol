<template>
<div>
  <div class="agents">
    <button v-on:click="logout">Logout</button>
  </div>
  <hr>
  <v-form v-model="valid" lazy-validation>
    <v-text-field
      v-model="newAgent.name"
      :counter="10"
      label="Nombre"
      required
    ></v-text-field>
    <v-text-field
      v-model="newAgent.surname"
      label="Apellido 1"
      required
    ></v-text-field>
    <v-text-field
      v-model="newAgent.secondSurname"
      label="Apellido 2"
      required
    ></v-text-field>
    <v-text-field
      v-model="newAgent.idAgent"
      label="Identificación"
      required
    ></v-text-field>
    <v-btn
      :disabled="!valid"
      @click="addAgent"
    >
      Guardar
    </v-btn>
  </v-form>
  <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Agents</h3>
      </div>
      <div class="panel-body">
         <form id="form" class="form-inline" v-on:submit.prevent="addAgent">
          <div class="form-group">
            <label for="agentName">Name:</label>
            <input type="text" id="agentName" class="form-control" v-model="newAgent.name">
          </div>
          <div class="form-group">
            <label for="agentSurname">Surname:</label>
            <input type="text" id="agentSurname" class="form-control" v-model="newAgent.surname">
          </div>
          <div class="form-group">
            <label for="agentAlias">Alias:</label>
            <input type="text" id="agentAlias" class="form-control" v-model="newAgent.alias">
          </div>
          <input type="submit" class="btn btn-primary" value="Add Agent">
        </form>
      </div>
    </div>
</div>
</template>

<script>
import Firebase from 'firebase'
import { db } from '../main'

export default {
  name: 'Agents',
  data () {
    return {
      msg: 'Bienvenido',
      dismissSecs: 5,
      dismissCountDown: 0,
      newAgent: {
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
      db.collection('agents').add(this.newAgent)
        .then(
          function (docRef) {
            alert('Insertado correctamente')
          },
          function (err) {
            alert('Error al insertar... ' + err.message)
          }
        )
    }
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
