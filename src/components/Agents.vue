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
      <v-flex sm4 xs12>
        <h3 class="panel-title">Add New Ag</h3>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="newAgent.name" :rules="emptyTextRules" label="Nombre" required></v-text-field>
          <v-text-field v-model="newAgent.surname" :rules="emptyTextRules" label="Apellido 1" required></v-text-field>
          <v-text-field v-model="newAgent.secondSurname" :rules="emptyTextRules" label="Apellido 2" required></v-text-field>
          <v-text-field v-model.number="newAgent.idAgent" type="number" :rules="emptyTextRules" label="Identificación" required></v-text-field>
          <v-text-field v-model="newAgent.alias" :rules="emptyTextRules" label="Alias" required></v-text-field>
          <v-btn :disabled="!valid" @click="handleAgent">
            Guardar
          </v-btn>
          <v-btn @click="cleanForm">
            Limpiar
          </v-btn>
        </v-form>
      </v-flex>
      <v-flex sm8 xs12>
        <h3 class="panel-title">Ags</h3>
        <br>
        <v-data-table
          :headers="headers"
          :items="agents"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right">{{ props.item.data.idAgent }}</td>
            <td class="text-xs-right">{{ props.item.data.name }}</td>
            <td class="text-xs-right">{{ props.item.data.surname }}</td>
            <td class="text-xs-right">{{ props.item.data.secondSurname }}</td>
            <td class="text-xs-right">{{ props.item.data.alias }}</td>
            <td>
              <v-btn flat icon @click='deleteAgent(props.item.docId)'>
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
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
        { text: 'Id', value: false, sortable: true },
        { text: 'Nombre', value: false, sortable: false },
        { text: 'Apellido 1', value: false, sortable: false },
        { text: 'Apellido 2', value: false, sortable: false },
        { text: 'Alias', value: false, sortable: false },
        {
          text: '¿Borrar?',
          value: false,
          sortable: false
        }
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
      db.collection('agents').add(this.newAgent)
        .then((docRef) => {
          this.fetchAgents()
        },
        function (err) {
          alert('Error al insertar... ' + err.message)
        })
    },
    cleanForm: function () {
      this.newAgent = []
    },
    handleAgent: function () {
      if (this.$refs.form.validate()) {
        db.collection('agents').where('idAgent', '==', this.newAgent.idAgent)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.addAgent()
            } else {
              alert('Existe un usuario con la misma identificación')
            }
          })
          .catch((error) => {
            console.error('Error al comprobar agente ', error)
          })
      }
    },
    fetchAgents: function () {
      db.collection('agents').get()
        .then((querySnapshot) => {
          this.agents = []
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
