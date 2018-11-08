<template>
  <div class="sign-up">
    <h3>Crear nueva cuenta</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="passwordf" v-model="password" placeholder="Password"><br><br>
    <button v-on:click="signUp">Sign Up</button><br><br>
    <router-link to="/login">Volver a login </router-link>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  name: 'SignUp',
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signUp: function () {
      Firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(
          function (user) {
            alert('Tu cuenta ha sido creada !')
          },
          function (err) {
            alert('Al ha salido mal... ' + err.message)
          }
        )
    }
  }
}
</script>
