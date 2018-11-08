<template>
  <div class="login">
    <h3>Gestión Policial</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="text" v-model="password" placeholder="Password"><br><br>
    <button v-on:click="signIn">Login</button><br><br>
    <router-link to="/sign-up">¿No tienes cuenta?</router-link>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  name: 'Login',
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signIn: function () {
      var that = this /* Check this */
      Firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(
          function (user) {
            alert('Te has conectado correctamente')
            that.$router.replace('hello')
          },
          function (err) {
            alert('Al ha salido mal... ' + err.message)
          }
        )
    }

  }

}
</script>

<style scoped>

</style>
