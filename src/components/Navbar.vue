<template>
    <nav class="navbar navbar-expand-md navbar-light navbar-laravel">
        <div class="container" id="nav-container">
            <router-link to="" class="navbar-brand" id="logo">Pothole Report</router-link>
            <div v-if="user.loggedIn" id="nav-authed">
                <ul>
                    <router-link to="profile"><li class="nav-item">{{user.data.username}}</li></router-link>
                    <li class="nav-item">
                        <a class="nav-link" @click.prevent="signOut">Sign Out</a>
                    </li>
                </ul>
            </div>
            <div v-else style="display: inline-block;" id="nav-auth">
                <ul>
                    <li class="nav-item">
                        <router-link to="login" class="nav-link">Sign In</router-link>
                    </li>
<!--                    <li class="nav-item">-->
<!--                        <router-link to="register" class="nav-link">Register</router-link>-->
<!--                    </li>-->
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    import { mapGetters } from 'vuex'
    import firebase from 'firebase'

    export default {
        computed: {
            ...mapGetters({
                user: 'user'
            })
        },
        methods: {
            signOut() {
                firebase
                    .auth()
                    .signOut()
                    .then(() => {
                        this.$router.replace({
                            name: 'login'
                        })
                    })
            }
        }
    }
</script>

<style>
    nav {
        background-color: #ab5f1d;
        padding: 10px 0px!important;
        margin-bottom: 80px;
    }

    #nav-container {
        width: 95%;
        margin: 0;
    }

    #logo {
        color: white;
        float: left;
        font-size: 25px;
        cursor: pointer;
    }

    #logo:hover {
        color: #a8b2b8;
    }

    #nav-auth {
        float: right;
    }
    #nav-auth ul {
        list-style-type: none;
        margin: 0px;
    }

    #nav-auth ul li {
        display: inline-block;
    }

    #nav-auth ul li a {
        color: white;
    }

    #nav-authed {
        float: right;
    }

    #nav-authed ul {
        list-style-type: none;
        margin: 0px;
    }

    #nav-authed ul li {
        display: inline-block;
        color: #cbcbcb;
        cursor: pointer;
    }

    #nav-authed ul li:hover {
        color: white;
    }

    #nav-authed ul li a {
        color: white;
        cursor: pointer;
    }

    #nav-authed ul li a:hover {
        color: #cbcbcb;
    }


</style>

