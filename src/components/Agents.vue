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
    <div>
      <v-toolbar flat>
        <v-toolbar-title>Listado de agentes</v-toolbar-title>
        <agent-add-dialog></agent-add-dialog>
        <v-btn @click="fetchAgents()" title="Actualizar" outline fab small color="primary">
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="agents"
        :loading="loading"
        class="elevation-1"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.data.idAgent }}</td>
          <td class="text-xs-left">{{ props.item.data.name }}</td>
          <td class="text-xs-left">{{ props.item.data.surname }}</td>
          <td class="text-xs-left">{{ props.item.data.secondSurname }}</td>
          <td class="text-xs-left">{{ props.item.data.alias }}</td>
          <td class="text-xs-right">
            <v-icon
              small
              class="mr-2"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteAgent(props.item.docId)"
            >
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </div>
  </v-container>
</div>
</template>

<script>
import Firebase from 'firebase'
import { db } from '../main'
import AgentAddDialog from '@/components/AgentAddDialog'

export default {
  components: {
    AgentAddDialog
  },
  name: 'Agents',
  data () {
    return {
      alert: true,
      agents: [],
      headers: [
        { text: 'Id', value: false, sortable: true },
        { text: 'Nombre', value: false, sortable: false },
        { text: 'Apellido 1', value: false, sortable: false },
        { text: 'Apellido 2', value: false, sortable: false },
        { text: 'Alias', value: false, sortable: false },
        {
          text: '¿Borrar?',
          align: 'right',
          value: false,
          sortable: false
        }
      ],
      emptyTextRules: [
        v => !!v || 'Debe rellenar este campo'
      ],
      loading: true,
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
    fetchAgents: function () {
      this.loading = true
      db.collection('agents').get()
        .then((querySnapshot) => {
          this.agents = []
          querySnapshot.forEach((doc) => {
            this.agents.push({ docId: doc.id, data: doc.data() })
          })
          this.loading = false
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
