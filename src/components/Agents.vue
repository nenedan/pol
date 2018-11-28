<template>
<div>
  <v-container>
    <br>
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
        rows-per-page-text="Filas por página"
        :rows-per-page-items="pagination"
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
          <td class="text-xs-left">{{ props.item.data.range }}</td>
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
              @click="formDeleteAgent(props.item.docId)"
            >
              delete
            </v-icon>
          </td>
        </template>
        <template slot="pageText" slot-scope="props">
          Filas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </div>
    <v-snackbar
      v-model="snackbar"
      :color="snackBarOpts.color"
      :timeout="snackBarOpts.timeout"
      :top="snackBarOpts.y"
      :right="snackBarOpts.x"
    >
      {{ snackBarOpts.text }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Cerrar
      </v-btn>
    </v-snackbar>
  </v-container>
  <!-- Agent Dialog -->
  <v-layout row justify-end>
    <v-dialog v-model="agentDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeDialog()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Formulario de alta</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="closeDialog()">Cerrar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <br><br>
        <h3 class="panel-title">Añadir ag</h3>
        <v-flex xs10 offset-xs1>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="newAgent.name" :rules="emptyTextRules" label="Nombre" required></v-text-field>
            <v-text-field v-model="newAgent.surname" :rules="emptyTextRules" label="Apellido 1" required></v-text-field>
            <v-text-field v-model="newAgent.secondSurname" :rules="emptyTextRules" label="Apellido 2" required></v-text-field>
            <v-select
              v-model="newAgent.range"
              :hint="`${select.docId}, ${select.name}`"
              :items="ranges"
              item-text="name"
              item-value="docId"
              label="Seleccione rango"
              persistent-hint
              hide-details
            ></v-select>
            <v-text-field v-model.number="newAgent.idAgent" type="number" :rules="emptyTextRules" label="Identificación" required></v-text-field>
            <v-text-field v-model="newAgent.alias" :rules="emptyTextRules" label="Alias" required></v-text-field>
            <v-btn v-if="editBtn" :disabled="!valid" @click="updateAgent">
              Modificar
            </v-btn>
            <v-btn v-else :disabled="!valid" @click="addAgent">
              Insertar
            </v-btn>
            <v-btn @click="cleanForm">
              Limpiar
            </v-btn>
          </v-form>
          {{ newAgent }}
        </v-flex>
      </v-card>
    </v-dialog>
  </v-layout>
  <!-- End Agent Dialog -->
  <!-- Delete Dialog -->
  <v-layout row justify-center>
    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">¿Desea borrar al usuario?</v-card-title>
          <v-btn color="primary" small @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" small @click="deleteAgent()">Borrar</v-btn>
      </v-card>
    </v-dialog>
  </v-layout>
  <br>
  <!-- End Delete Dialog -->
</div>
</template>

<script>
import { db } from '../main'

export default {
  name: 'Agents',
  data () {
    return {
      agentDialog: false,
      agents: [],
      editBtn: false,
      deleteDialog: false,
      docIdToDelete: '',
      docIdToEdit: '',
      emptyTextRules: [
        v => !!v || 'Debe rellenar este campo'
      ],
      headers: [
        { text: 'Id', value: 'data.idAgent' },
        { text: 'Nombre', value: 'data.name' },
        { text: 'Apellido 1', value: 'data.surname' },
        { text: 'Apellido 2', value: 'data.secondSurname' },
        { text: 'Alias', value: 'data.alias' },
        { text: 'Rango', value: 'data.range' },
        {
          text: 'Acciones',
          align: 'right',
          value: false,
          sortable: false
        }
      ],
      loading: true,
      newAgent: {
        idAgent: '',
        name: '',
        range: '',
        secondSurname: '',
        surname: '',
        alias: ''
      },
      pagination: [10, 20, {'text': 'Todos', 'value': -1}],
      ranges: [],
      search: '',
      select: { docId: '', name: '' },
      snackbar: false,
      snackBarOpts: {},
      valid: true
    }
  },
  methods: {
    addAgent: function () {
      if (this.$refs.form.validate()) {
        db.collection('agents').add(this.newAgent)
          .then((docRef) => {
            this.snackBarOpts = { color: 'success', timeout: 5000, text: 'Agente insertado correctamente', y: 'top', x: 'right' }
            this.snackbar = true
          },
          function (err) {
            alert('Error al insertar... ' + err.message)
          })
      }
    },
    cleanForm: function () {
      this.newAgent = {}
      if (this.alert) {
        this.alert = 0
      } else {
        this.alert = 1
      }
    },
    closeDialog: function () {
      this.fetchAgents()
      this.agentDialog = false
    },
    deleteAgent: function () {
      db.collection('agents').doc(this.docIdToDelete).delete()
        .then(() => {
          this.snackBarOpts = { color: 'success', timeout: 5000, text: 'Agente borrado correctamente', y: 'top', x: 'right' }
          this.snackbar = true
          this.fetchAgents()
          this.deleteDialog = false
        })
        .catch((error) => {
          console.error('Error removing document: ', error)
        })
    },
    formAddAgent: function () {
      this.cleanForm()
      this.agentDialog = true
      this.editBtn = false
      this.docIdToEdit = ''
    },
    formDeleteAgent: function (docId) {
      this.docIdToDelete = docId
      this.deleteDialog = true
    },
    formUpdateAgent: function (docId) {
      db.collection('agents').doc(docId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.newAgent = doc.data()
            this.agentDialog = true
            this.editBtn = true
            this.docIdToEdit = docId
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
      this.search = ''
      db.collection('agents').get()
        .then((querySnapshot) => {
          this.agents = []
          querySnapshot.forEach((doc) => {
            this.agents.push({ docId: doc.id, data: doc.data() })
          })
          this.loading = false
        })
    },
    fetchRanges: function () {
      db.collection('ranges').get()
        .then((querySnapshot) => {
          this.ranges = []
          querySnapshot.forEach((doc) => {
            this.ranges.push({ docId: doc.id, name: doc.data().name })
          })
        })
    },
    getRange: function (range) {
      db.collection('range').doc(range)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log(doc)
            return doc.data().name
          } else {
            return ''
          }
        })
    },
    updateAgent: function () {
      db.collection('agents').doc(this.docIdToEdit)
        .set(this.newAgent)
        .then(() => {
          this.snackBarOpts = { color: 'success', timeout: 5000, text: 'Agente actualizado correctamente', y: 'top', x: 'right' }
          this.snackbar = true
        })
        .catch(() => {
          alert('Error al actualizar')
        })
    }
  },
  mounted: function () {
    this.fetchAgents()
    this.fetchRanges()
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
