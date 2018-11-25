<template>
<div>
  <v-container>
    <v-layout  row justify-end>
      <v-btn @click="fetchRanges()" title="Actualizar" small>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn title="Insertar rango" @click="formAddRange()" small color="primary">
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
        :items="ranges"
        :loading="loading"
        class="elevation-1"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.data.level }}</td>
          <td class="text-xs-left">{{ props.item.data.name }}</td>
          <td class="text-xs-left">{{ props.item.data.printOrder }}</td>
          <td class="text-xs-right">
            <v-icon
              small
              class="mr-2"
              @click="formUpdateRange(props.item.docId)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="formDeleteRange(props.item.docId)"
            >
              delete
            </v-icon>
          </td>
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
  <!-- Range Dialog -->
  <v-layout row justify-end>
    <v-dialog v-model="rangeDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
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
            <v-text-field v-model="newRange.level" :rules="emptyTextRules" type="number" label="Jerarquía" required></v-text-field>
            <v-text-field v-model="newRange.name" :rules="emptyTextRules" label="Nombre" required></v-text-field>
            <v-text-field v-model="newRange.printOrder" :rules="emptyTextRules" type="number" label="Order de impresión" required></v-text-field>
            <v-btn v-if="editBtn" :disabled="!valid" @click="updateRange">
              Modificar
            </v-btn>
            <v-btn v-else :disabled="!valid" @click="addRange">
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
  <!-- End Range Dialog -->
  <!-- Delete Dialog -->
  <v-layout row justify-center>
    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">¿Desea borrar al usuario?</v-card-title>
          <v-btn color="primary" small @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" small @click="deleteRange()">Borrar</v-btn>
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
  name: 'Ranges',
  data () {
    return {
      rangeDialog: false,
      ranges: [],
      editBtn: false,
      deleteDialog: false,
      docIdToDelete: '',
      docIdToEdit: '',
      emptyTextRules: [
        v => !!v || 'Debe rellenar este campo'
      ],
      headers: [
        { text: 'Jerarquía', value: 'data.level' },
        { text: 'Nombre', value: 'data.name' },
        { text: 'Impresión', value: 'data.printOrder' },
        {
          text: 'Acciones',
          align: 'right',
          value: false,
          sortable: false
        }
      ],
      loading: true,
      newRange: {
        level: '',
        name: '',
        printOrder: ''
      },
      search: '',
      snackbar: false,
      snackBarOpts: {},
      valid: true
    }
  },
  methods: {
    addRange: function () {
      if (this.$refs.form.validate()) {
        db.collection('ranges').add(this.newRange)
          .then((docRef) => {
            this.snackBarOpts = { color: 'success', timeout: 5000, text: 'Rangee insertado correctamente', y: 'top', x: 'right' }
            this.snackbar = true
          },
          function (err) {
            alert('Error al insertar... ' + err.message)
          })
      }
    },
    cleanForm: function () {
      this.newRange = {}
      if (this.alert) {
        this.alert = 0
      } else {
        this.alert = 1
      }
    },
    closeDialog: function () {
      this.fetchRanges()
      this.rangeDialog = false
    },
    deleteRange: function () {
      db.collection('ranges').doc(this.docIdToDelete).delete()
        .then(() => {
          this.snackBarOpts = { color: 'success', timeout: 5000, text: 'Rangee borrado correctamente', y: 'top', x: 'right' }
          this.snackbar = true
          this.fetchRanges()
          this.deleteDialog = false
        })
        .catch((error) => {
          console.error('Error removing document: ', error)
        })
    },
    formAddRange: function () {
      this.cleanForm()
      this.rangeDialog = true
      this.editBtn = false
      this.docIdToEdit = ''
    },
    formDeleteRange: function (docId) {
      this.docIdToDelete = docId
      this.deleteDialog = true
    },
    formUpdateRange: function (docId) {
      db.collection('ranges').doc(docId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.newRange = doc.data()
            this.rangeDialog = true
            this.editBtn = true
            this.docIdToEdit = docId
          } else {
            alert('No existe usuario para editar')
          }
        })
        .catch((error) => {
          console.error('Error al comprobar rango ', error)
        })
    },
    fetchRanges: function () {
      this.loading = true
      this.search = ''
      db.collection('ranges').get()
        .then((querySnapshot) => {
          this.ranges = []
          querySnapshot.forEach((doc) => {
            this.ranges.push({ docId: doc.id, data: doc.data() })
          })
          this.loading = false
        })
    },
    updateRange: function () {
      db.collection('ranges').doc(this.docIdToEdit)
        .set(this.newRange)
        .then(() => {
          this.snackBarOpts = { color: 'success', timeout: 5000, text: 'Rangee actualizado correctamente', y: 'top', x: 'right' }
          this.snackbar = true
        })
        .catch(() => {
          alert('Error al actualizar')
        })
    }
  },
  mounted: function () {
    let idRange = this.$route.params['idRange']
    if (idRange) {
      // this.rangeDialog = true
    } else {
      this.fetchRanges()
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
