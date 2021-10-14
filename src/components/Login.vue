<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <!-- <v-toolbar dark>
            <v-toolbar-title class="text-md-center">Access Code</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>-->
          <v-card-text>
            <v-form v-model="loginFormValid" ref="LoginForm">
              <v-flex xs12>
                <v-text-field
                  label="Access Code"
                  v-model="accessCode"
                  outline
                  clearable
                  required
                  counter="5"
                  mask="#-#-#-#-A"
                  :rules="codeRules"
                ></v-text-field>
              </v-flex>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="Login" :disabled="!loginFormValid">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showChopeLoader" persistent width="300">
      <v-card color="black" dark>
        <v-card-text>Loading...Please Hold on...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showAlertBar"
      color="error"
      :timeout="3000"
      multi-line
      vertical
      auto-height
    >
      {{errorMesg}}
      <v-btn dark flat @click="showAlertBar=false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Api from "@/services/Api";
export default {
  data: () => ({
    accessCode: "",
    showAlertBar: false,
    loginFormValid: false,
    showChopeLoader: false,
    errorMesg: "",
    codeRules: [v => !!v || "Code is required"]
  }),
  methods: {
    Login: function() {
      if (this.$refs.LoginForm.validate()) {
        this.showChopeLoader = true;
        Api.post("api/movuee/LoginCode/" + this.accessCode)
          .then(response => {
            this.showChopeLoader = false;
            localStorage.setItem("jwt", response.data.token);
            localStorage.setItem("user", response.data.user);
            this.$store.dispatch("setUser");
            this.$store.dispatch("setIsNew", response.data.isN);
            this.$router.push("/");
          })
          .catch(e => {
            this.showChopeLoader = false;
            this.showAlertBar = true;
            this.errorMesg = e.response.data;
          });
      }
    }
  }
};
</script>

<style>
</style>
