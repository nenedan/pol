<template>
  <v-layout align-center justify-center row fill-height>
    <div class="login-form">
      <h3>Gestión Login</h3>
      <br>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          :rules="passwordRules"
          label="Contraseña"
          required
        ></v-text-field>
        <br>
        <v-btn
          :disabled="!valid"
          @click="signIn"
        >
          Login
        </v-btn>
      </v-form><br>
      <router-link to="/sign-up">¿No tienes cuenta?</router-link>
    </div>
  </v-layout>
</template>

<script>
import Firebase from 'firebase'

export default {
  name: 'Login',
  data: function () {
    return {
      email: '',
      emailRules: [
        v => !!v || 'El email es obligatorio',
        v => /.+@.+/.test(v) || 'El email debe ser válido'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'La contraseña es obligatoria',
        v => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caractéres'
      ],
      valid: true
    }
  },
  methods: {
    signIn: function () {
      if (this.$refs.form.validate()) {
        Firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            location.reload(true)
          }, (err) => {
            alert('Al ha salido mal... ' + err.message)
          })
      }
    }
  }

}
</script>

<style lang="sass" scoped>
@import 'src/assets/main.scss'

.login-form
  border-top: 1px solid $plain-color;
  border-bottom: 1px solid $plain-color;
  padding: 30px 50px;
  border-radius: -5px;
.login-form input
  font-size: 20px;
</style>
