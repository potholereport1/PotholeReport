<template>
    <div class="container">
        <pulse-loader v-show="sentVerifyCode"></pulse-loader>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Login</div>
                    <div class="card-body">
                        <div v-if="error" class="alert alert-danger">{{error}}</div>
                        <form action="#" @submit.prevent="submit" v-show="!emailAuthed">
                            <div class="form-group row">
                                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>
                                <div class="col-md-6 col-sm-5">
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
                            <div class="form-group row" v-show="!emailAuthed">
                                <label for="governmentID" class="col-md-4 col-form-label text-md-right">Government ID</label>
                                <div class="col-md-6 col-sm-5">
                                    <input
                                        id="governmentID"
                                        type="text"
                                        class="form-control"
                                        name="governmentID"
                                        required
                                        v-model="form.password"
                                    />
                                </div>
                            </div>
                            <div class="form-group row" v-show="!emailAuthed" style="text-align: center;">
                                <div class="col-md-12 offset-md-0" style="text-align: center;">
                                    <button type="submit" class="btn btn-warning">Login</button>
                                </div>
                            </div>
                            <p id="txt-createNewUser">If you would like a Government ID to access pothole data, please email potholereport1@gmail.com</p>
                        </form>
                        <div class="form-group row" v-show="emailAuthed">
                            <label clafor="password" class="col-md-4 col-form-label text-md-right">Code</label>
                            <div class="col-md-4">
                                <input
                                        id="code"
                                        type="text"
                                        class="form-control"
                                        name="code"
                                        required
                                        v-model="form.code"
                                />
                            </div>
                        </div>
                        <div id="recaptcha-container" class="form-group row"></div>
                        <div class="form-group row mb-0" v-show="emailAuthed">
                            <div class="col-md-12 offset-md-0">
                                <button class="btn btn-warning" v-on:click="submitVerifyAuthCode">Verify</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import store from "../stores/store";
    import PulseLoader from 'vue-spinner/src/ClipLoader'

    export default {
        components: {
            PulseLoader
        },

        // data to use in this component
        data() {
            return {
                form: {
                    email: '',
                    governmentID: '',
                    password: '',
                    phoneNumber: null,
                    code: ''
                },
                newUser: false,
                currentUser: null,
                error: null,
                emailAuthed: false,
                sentVerifyCode: false
            }
        },

        created: function () {
            let currentUser = firebase.auth().currentUser

            if (currentUser != null) {
                this.$set(this.$data.form, 'email', currentUser.email)
            }
        },

        // methods to use in this component
        methods: {
            async signFunction() {
                await firebase
                            .auth()
                            .signInWithEmailAndPassword(this.form.email, this.form.password)
                            .then(data => {

                                // let normalUser = this.$db.ref('users/' + data.user.uid)
                                // alert(normalUser)
                                this.$db.ref('governmentUsers/' + data.user.uid).set({
                                    email: data.user.email,
                                    govId: this.form.password
                                }).then(() => {
                                    firebase.auth().onAuthStateChanged((user) => {
                                        store.dispatch('fetchUser', user)
                                    })
                                    this.$router.replace({name: 'dashboard'}).then(
                                        this.sentVerifyCode = false
                                    )
                                })
                                .catch((err) => {
                                    this.sentVerifyCode = false
                                    this.error = err.message
                                })
                            })
                            .catch(err => {
                                this.error = err.message
                                this.sentVerifyCode = false
                            })
            },
            // login in firebase with form data, email and password
            async submit() {
                this.error = ''
                this.sentVerifyCode = true

                let governmentUser = true

                await this.$db.ref().child('users').on('value', (collection) => {
                    collection.forEach(document => {
                        if (document.val().email == this.form.email) {
                            this.error = 'This user is not government user.'
                            this.sentVerifyCode = false
                            governmentUser = false
                            this.error = 'This user is not government user.'
                            this.sentVerifyCode = false
                        }
                    })

                    if (governmentUser) {
                        this.signFunction()
                    }
                })
            },

            // call api to send phone number
            submitPhoneNumberAuth() {
                firebase
                    .auth()
                    .signInWithPhoneNumber(this.form.phoneNumber, window.recaptchaVerifier)
                    .then((confirmationResult) => {
                        window.confirmationResult = confirmationResult
                        this.sentPhoneNumber = true
                    })
                    .catch(function(error) {
                        this.error = error
                    })
            },

            // verify phone number auth code
            submitVerifyAuthCode() {
                let code = this.form.code
                this.sentVerifyCode = true
                if (code == '') {
                    this.error = 'Please type verify code'
                    return
                }

                if (firebase.auth().currentUser.uid != '') {
                    this.$db.ref('users/' + firebase.auth().currentUser.uid + '/').once('value')
                    .then((snapshot) => {
                        if (code == snapshot.val().govId) {
                            firebase.auth().onAuthStateChanged(user => {
                                store.dispatch('fetchUser', user)
                            })
                            this.sentVerifyCode = false
                            this.$router.replace({ name: 'dashboard' })
                        } else {
                            this.sentVerifyCode = false
                            this.error = 'Invalid verify code'
                        }
                    })
                }
            }
        }
    }
</script>

<style>
    .card-body {
        padding-top: 30px;
    }

    #txt-createNewUser {
        margin-top: 50px;
        padding-left: 50px;
        padding-right: 50px;
        color: #00000078;
    }

    /*#txt-createNewUser:hover {*/
    /*    color: #ba4ef0;*/
    /*}*/

</style>
