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
  <v-container>
    <v-layout  row justify-end>
      <v-btn @click="fetchAgents()" title="Actualizar" small>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn title="Insertar agente" @click="formAddAgent()" small color="primary">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
    <div>
      <v-toolbar flat>
        <v-toolbar-title>Listado</v-toolbar-title>
              <v-spacer></v-spacer>

        <v-text-field
          placeholder="Buscar"
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
      <v-data-table
        :search="search"
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
              @click="formUpdateAgent(props.item.docId)"
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
  <!-- Dialog -->
  <v-layout  row justify-end>
    <v-dialog v-model="active" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="active = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Formulario de alta</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="active = false">Cerrar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <br><br>
        <h3 class="panel-title">Añadir ag</h3>
        <v-flex xs10 offset-xs1>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="newAgent.name" :rules="emptyTextRules" label="Nombre" required></v-text-field>
            <v-text-field v-model="newAgent.surname" :rules="emptyTextRules" label="Apellido 1" required></v-text-field>
            <v-text-field v-model="newAgent.secondSurname" :rules="emptyTextRules" label="Apellido 2" required></v-text-field>
            <v-text-field v-model.number="newAgent.idAgent" type="number" :rules="emptyTextRules" label="Identificación" required></v-text-field>
            <v-text-field v-model="newAgent.alias" :rules="emptyTextRules" label="Alias" required></v-text-field>
            <v-btn v-if="editBtn" :disabled="!valid" @click="handleAgent">
              Modificar
            </v-btn>
            <v-btn v-else :disabled="!valid" @click="addAgent">
              Insertar
            </v-btn>
            <v-btn @click="cleanForm">
              Limpiar
            </v-btn>
          </v-form>
        </v-flex>
      </v-card>
    </v-dialog>
  </v-layout>
  <!-- End Dialog -->
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
      active: false,
      agents: [],
      alert: true,
      editBtn: false,
      emptyTextRules: [
        v => !!v || 'Debe rellenar este campo'
      ],
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
      loading: true,
      newAgent: {
        idAgent: '',
        name: '',
        secondSurname: '',
        surname: '',
        alias: ''
      },
      search: '',
      valid: true
    }
  },
  methods: {
    addAgent: function () {
      if (this.$refs.form.validate()) {
        if (!this.existAgentId(this.newAgent.idAgent)) {
          db.collection('agents').add(this.newAgent)
            .then((docRef) => {
              alert('Agente insertado correctamente')
            },
            function (err) {
              alert('Error al insertar... ' + err.message)
            })
        }
      }
    },
    cleanForm: function () {
      this.newAgent = {}
    },
    deleteAgent: function (docId) {
      db.collection('agents').doc(docId).delete()
        .then(() => {
          this.fetchAgents()
        })
        .catch((error) => {
          console.error('Error removing document: ', error)
        })
    },
    /* Async function?? */
    existAgentId: function (agentId) {
      db.collection('agents').where('idAgent', '==', agentId)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log('Exist False')
            return false
          } else {
            console.log('Exist True')
            return true
          }
        })
        .catch((error) => {
          console.error('Error al comprobar Id de agente ', error)
        })
    },
    logout: function () {
      Firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },
    formAddAgent: function () {
      this.cleanForm()
      this.active = true
      this.editBtn = false
    },
    formUpdateAgent: function (docId) {
      db.collection('agents').doc(docId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.newAgent = doc.data()
            this.active = true
            this.editBtn = true
          } else {
            alert('No existe usuario para editar')
          }
        })
        .catch((error) => {
          console.error('Error al comprobar agente ', error)
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
    updateAgent: function (docId) {
      db.collection('agents').doc(docId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.newAgent = doc.data()
            this.active = true
            this.editBtn = true
          } else {
            alert('No existe usuario para editar')
          }
        })
        .catch((error) => {
          console.error('Error al comprobar agente ', error)
        })
    }
  },
  mounted: function () {
    let idAgent = this.$route.params['idAgent']
    if (idAgent) {
      // this.active = true
    } else {
      this.fetchAgents()
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
