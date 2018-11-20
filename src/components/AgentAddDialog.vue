<template>
  <v-layout row justify-end>
    <v-dialog v-model="active" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-btn title="Insertar agente" slot="activator" fab small color="primary">
        <v-icon>add</v-icon>
      </v-btn>
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
            <v-btn :disabled="!valid" @click="handleAgent">
              Guardar
            </v-btn>
            <v-btn @click="cleanForm">
              Limpiar
            </v-btn>
          </v-form>
        </v-flex>
      </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
import { db } from '../main'

export default {
  name: 'AgentAddDialog',
  data () {
    return {
      active: false,
      agents: [],
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
    addAgent: function () {
      db.collection('agents').add(this.newAgent)
        .then((docRef) => {
          alert('Agente insertado correctamente')
        },
        function (err) {
          alert('Error al insertar... ' + err.message)
        })
    },
    cleanForm: function () {
      this.newAgent = {}
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
    }
  },
  created: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .panel-title{
    text-transform: uppercase;
    font-weight: 400
  }
</style>
