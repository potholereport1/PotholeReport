<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Register</div>
                    <div class="card-body">
                        <div v-if="error" class="alert alert-danger">{{error}}</div>
                        <form action="#" @submit.prevent="submit">
                            <div class="form-group row">
                                <label for="name" class="col-md-4 col-form-label text-md-right">User name</label>
                                <div class="col-md-6">
                                    <input
                                        id="name"
                                        type="name"
                                        class="form-control"
                                        name="name"
                                        value
                                        required
                                        autofocus
                                        v-model="form.name"
                                    />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="name" class="col-md-4 col-form-label text-md-right">Phone Number</label>
                                <div class="col-md-6">
                                    <input
                                            id="phoneNumber"
                                            type="number"
                                            class="form-control"
                                            name="name"
                                            value
                                            required
                                            autofocus
                                            v-model="form.phone"
                                    />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="email" class="col-md-4 col-form-label text-md-right">Email Address</label>
                                <div class="col-md-6">
                                    <input
                                        id="email"
                                        type="email"
                                        class="form-control"
                                        name="email"
                                        value
                                        required
                                        autofocus
                                        v-model="form.email"
                                    />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                                <div class="col-md-6">
                                    <input
                                        id="password"
                                        type="password"
                                        class="form-control"
                                        name="password"
                                        required
                                        v-model="form.password"
                                    />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">Confirm Password</label>
                                <div class="col-md-6">
                                    <input
                                            id="confirmPassword"
                                            type="password"
                                            class="form-control"
                                            name="password"
                                            required
                                            v-model="form.confirmPassword"
                                    />
                                </div>
                            </div>
                            <div class="form-group row mb-0">
                                <div class="col-md-12 offset-md-0">
                                    <button type="submit" class="btn btn-warning">Register</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'

    export default {
        // data to use in this component
        data () {
            return {
                form: {
                    name: '',
                    phone: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                },
                error: null
            }
        },

        // methods to use in this component
        methods: {
            // method to register account in firebase
            submit () {
                if (this.form.password.length < 6 || this.form.confirmPassword.length < 6) {
                    this.error = 'password must be more 6 characters.'
                    return;
                }

                if (this.form.password != this.form.confirmPassword) {
                    this.error = "password must be same with confirm password."
                    return;
                }
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.form.email, this.form.password)
                    .then(data => {
                        data.user
                            .updateProfile({
                                username: this.form.username
                            })
                            .then(() => {
                                let currentUser = firebase.auth().currentUser
                                this.$db.ref().child('users/' + currentUser.uid).set({
                                    email: this.form.email.toLowerCase(),
                                    govId: '',
                                    phone: this.form.phone,
                                    username: this.form.name,
                                })
                                .then(() => {
                                    currentUser.sendEmailVerification()
                                    this.$router.replace({ name: "login" })
                                })
                                .catch((err) => {
                                    this.error = err.message
                                })
                            })
                    })
                    .catch(err => {
                        this.error = err.message
                    })
            }
        }
    }
</script>
