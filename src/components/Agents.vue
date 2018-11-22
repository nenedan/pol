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
        <v-toolbar-title v-bind="active = true">Listado</v-toolbar-title>
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
              @click="editAgent(props.item.docId)"
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
        { text: 'Id', value: 'data.idAgent' },
        { text: 'Nombre', value: 'data.name' },
        { text: 'Apellido 1', value: 'data.surname' },
        { text: 'Apellido 2', value: 'data.secondSurname' },
        { text: 'Alias', value: 'data.alias' },
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
    editAgent: function (docId) {
      console.log('Editar agente' + docId)
      this.$router.push({name: 'Agents', params: { idAgent: docId }})
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
  mounted: function () {
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
