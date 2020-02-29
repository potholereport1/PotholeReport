<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">Detail</div>
                    <div class="card-body" style="padding: 0; margin-bottom: 30px;">
                        <div class="row">
                            <div>
                                <button class="btn btn-warning mt-sm-6" id="btn-back" style="margin: 0 0 20px 30px;" v-on:click="backButtonClicked">Back</button>
                            </div>
                        </div>
                        <gmap-map
                            :center="center"
                            :zoom="12"
                            style="height: 280px; width: 95%; margin: auto; margin-bottom: 30px;"
                            >
                            <gmap-marker
                                :key="index"
                                v-for="(m, index) in markers"
                                :position="m.position"
                                @click="center=m.position"
                            ></gmap-marker>
                        </gmap-map>
                        <div class="row" style="margin: auto; padding-left: 70px; padding-right: 70px; text-align: center;">
                            <div class="col-md-6 pothole-item">
                                <ul>
                                    <li>
                                        Pothole Latitude: <span>{{pothole.lat}}</span>
                                    </li>

                                    <li>
                                        Pothole Longtitude: <span>{{pothole.lng}}</span>
                                    </li>

                                    <li>
                                        Number of Reports: <span>{{pothole.count}}</span>
                                    </li>

                                    <li>
                                        Size: <span>{{pothole.size}}</span>
                                    </li>

                                    <li>
                                        Days ago: <span>{{pothole.dateDiff}}</span>
                                    </li>
                                </ul>
                            </div>

                            <div class="col-md-6 user-list">
                                <ul>
                                    <v-collapse-wrapper class="user-report header" v-for="userReport in reports" v-bind:key="userReport.id" v-collapse>
                                        <span class="report-header" v-collapse-toggle>{{userReport.email}}</span>
                                        <ul v-for="report in userReport.reports" v-bind:key="report.id" class="user-reportItem" v-collapse-content>
                                            <li>
                                                Size: <span>{{report.size}}</span>
                                            </li>
                                            <li>
                                                Date: <span>{{report.reportDate}}</span>
                                            </li>
                                        </ul>
                                    </v-collapse-wrapper>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    // import firebase and vuex to use in this component
    import { mapGetters } from 'vuex'

    export default {
        // data to use in this component
        data() {
            return {
                center: { lat: 45.508, lng: -73.587 },
                markers: [],
                places: [],
                currentPlace: null,
                reports: []
            }
        },

        created() {
            this.pothole = this.$route.params.pothole
            // this.center.lat = this.pothole.lat
            this.getReporters()

            this.center.lat = this.pothole.lat
            this.center.lng = this.pothole.lng

            this.addMarker()
        },

        computed: {
            // map `this.user` to `this.$store.getters.user`
            ...mapGetters({
                user: 'user'
            }),
        },

        // methods to use in this component
        methods: {
             setPlace (place) {
                this.currentPlace = place
            },

            addMarker () {
                const marker = {
                    lat: this.pothole.lat,
                    lng: this.pothole.lng
                }
                this.markers.push({ position: marker })
                this.places.push(this.currentPlace)
                this.center = marker
                this.currentPlace = null
                
            },

            geolocate: function () {
                navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                })
            },

            backButtonClicked() {
                this.$router.replace({name: 'dashboard'})
            },

            async getReporters() {
                this.reports.slice(0, this.reports.length)
                
                this.$db.ref().child('reports').on('value', (reportCollection) => {
                    reportCollection.forEach(reportDocument => {
                        let userId = reportDocument.key
                        let reportUser = null

                        this.$db.ref('users/' + userId).once('value', (userItem) => {
                            reportUser = userItem.val().email
                            let reportDocument = []

                            if (reportUser != null) {
                                this.$db.ref().child('reports/' + userId).on('value', (reportItem) => {
                                    reportItem.forEach(item => {
                                        if (item.val().lat == this.pothole.lat && item.val().lng == this.pothole.lng) {
                                            reportDocument.push({ id: item.key, lat: item.val().lat, lng: item.val().lng, reportDate: item.val().reportDate, size: Math.floor(item.val().size * 100) / 100})
                                        }
                                    })

                                    if (reportDocument.length != 0) {
                                        this.reports.push({id: userId.key, email: reportUser, reports: reportDocument})
                                    }
                                })
                            }
                        })
                    })
                })
            }
        }
    }
</script>

<style>
    img {
        width: 200px;
        height: 200px;
        margin-bottom: 20px;
    }

    input#profile-name {
        border-width: 0px 0px 1px 0px;
        margin-bottom: 30px;
        border-color: black;
    }

    input#profile-email {
        border-width: 0px 0px 1px 0px;
        border-color: black;
    }

    .pothole-item {
        padding: 40px 20px 10px 20px;
        border: 2px solid #f0ad4e;
        background-color: #0000000d;
        height: 300px;
    }

    .pothole-item ul {
        text-align: left;
        list-style: none;
        padding: 0;
    }

    .pothole-item li {
        text-align: left;
        margin-bottom: 30px;
    }

    .pothole-item li span {
        color: #f0ad4e;
    }

    .report-header {
        background-color: #af70175c;
        padding: 5px;
        display: block;
        cursor: pointer;
    }

    .user-list {
        padding: 40px 20px 10px 20px;
        text-align: center;
        background-color: #f0ad4e7a;
        border: 2px solid #0000000d;
        height: 300px;
        overflow-y: auto;
    }

    .user-list ul {
        text-align: left;
        list-style: none;

        padding: 0;
    }

    .user-list ul.user-report li.user-report {
        background-color: #af7017;
        margin-bottom: 20px;
    }

    .user-reportItem {
        list-style: none;
        margin-top: 5px;

    }

    .user-reportItem li {
        margin-left: 30px;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    button#btn-back {
        margin-top: 30px;
    }

    .card-body input {
        padding: 10px;
        border: 1px solid #af7017;
        margin-right: 10px;
    }
</style>
