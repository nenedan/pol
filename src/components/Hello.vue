<template>
<div>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <button v-on:click="logout">Logout</button>
  </div>
  <hr>
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
            <input type="text" id="agentSurnamer" class="form-control" v-model="newAgent.surname">
          </div>
          <div class="form-group">
            <label for="agentAlias">Alias:</label>
            <input type="text" id="agentAlias" class="form-control" v-model="newAgent.alias">
          </div>
          <input type="submit" class="btn btn-primary" value="Add Agent">
        </form>
      </div>
    </div>
    <div>
      <b-alert
        :show="dismissCountDown"
        dismissible
        variant="success"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged">
        This alert will dismiss after {{dismissCountDown}} seconds...
      </b-alert>
    </div>
</div>
</template>

<script>
import Firebase from 'firebase'
import { db } from '../main'

export default {
  name: 'Hello',
  data () {
    return {
      msg: 'Bienvenido',
      dismissSecs: 5,
      dismissCountDown: 0,
      newAgent: {
        name: '',
        surname: '',
        alias: ''
      }
    }
  },
  methods: {
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    },
    logout: function () {
      Firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },
    addAgent: function () {
      var that = this
      db.collection('agents').add(this.newAgent)
        .then(
          function (docRef) {
            that.showAlert()
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
