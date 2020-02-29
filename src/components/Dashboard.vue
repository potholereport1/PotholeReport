<template>
    <div class="container dashboard-container">
        <div class="row justify-content-center">
            <pulse-loader v-show="loading"></pulse-loader>
            <div class="col-md-12">
                <div class="card" style="text-align: center; padding-bottom: 30px; overflow-x: auto;">
                    <div class="card-header">
                        Potholes
                    </div>
                    <sorted-table class="table table-striped table-bordered" :values="potholes" style="width: 90%; margin: auto;">
                        <thead>
                            <tr>
                                <th scope="col"><sort-link name="no">No</sort-link></th>
                                <th scope="col"><sort-link name="lat">Pothole Latitude</sort-link></th>
                                <th scope="col"><sort-link name="lng">Pothole Longitude</sort-link></th>
                                <th scope="col"><sort-link name="count">Number of Reports</sort-link></th>
                                <th scope="col"><sort-link name="size">Size(1-10)</sort-link></th>
                                <th scope="col"><sort-link name="date">Days Since Earliest Report</sort-link></th>
                                <th>remove</th>
                            </tr>
                        </thead>
                        <template #body="sort">
                            <tbody>
                                <tr v-for="pothole in sort.values" v-bind:key="pothole.id">
                                    <td v-on:click="clickedPothole(pothole)">{{pothole.no}}</td>
                                    <td v-on:click="clickedPothole(pothole)">{{pothole.lat}}</td>
                                    <td v-on:click="clickedPothole(pothole)">{{pothole.lng}}</td>
                                    <td v-on:click="clickedPothole(pothole)">{{pothole.count}}</td>
                                    <td v-on:click="clickedPothole(pothole)">{{pothole.size}}</td>
                                    <td v-on:click="clickedPothole(pothole)">{{pothole.dateDiff}} days ago</td>
                                    <td><button class="btn btn-outline-warning" v-on:click="deletePothole(pothole.id, pothole.lat, pothole.lng)">remove</button></td>
                                </tr>
                            </tbody>
                        </template>
                    </sorted-table >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import columnSortable from 'vue-column-sortable'
    import PulseLoader from 'vue-spinner/src/ClipLoader'

    export default {
        components: {
            PulseLoader
        },

        directives: {
            columnSortable
        },
        data() {
            return {
                potholes: [],
                message: '',
                page: 1,
                perPage: 10,
                pages: [],
                selected: 10,
                loading: false,
                reverse: false,
                sortKey: 'name',
            }
        },

        methods: {
            sortBy(sortKey) {
                this.reverse = (this.sortKey == sortKey) ? ! this.reverse : false
                this.sortKey = sortKey
            },

            clickedPothole(pothole) {
                this.$router.replace({name: 'pothole', params: {pothole: pothole}})
            },

            async getPotholes() {
                this.potholes = []
                const a = []
                let count = 0
                await this.$db.ref().child('potholes').on('value', function (snapshot) {
                    snapshot.forEach(document => {
                        let currentDate = new Date()
                        let reportDate = new Date(document.val().reportDate)
                        let dateDiff = Math.round((currentDate-reportDate)/(1000*60*60*24))

                        count++

                        a.push({ id: document.key, no: count, lat: document.val().lat, lng: document.val().lng, count: document.val().count, size: Math.floor(document.val().size * 100) / 100, dateDiff: dateDiff })
                    })
                })
                this.potholes = a
            },

            setPages() {
                this.pages.splice(0, this.pages.length)
                let numberOfPages = Math.ceil(this.potholes.length / this.perPage)

                for (let index = 1; index <= numberOfPages; index++) {
                    this.pages.push(index)
                }
            },

            paginate(potholes) {
                let page = this.page
                let perPage = this.perPage
                let from = (page * perPage) - perPage
                let to = (page * perPage)

                return potholes.slice(from, to)
            },

            async deletePothole(id, lat, lng) {
                this.loading = true
                await this.$db.ref().child('potholes').child(id).remove().then(
                    this.$db.ref().child('reports').once('value', (snapshot) => {
                        snapshot.forEach(documents => {
                            this.$db.ref('reports/' + documents.key).once('value', (subDocuments) => {
                                subDocuments.forEach(document => {
                                    if (document.val().lat == lat && document.val().lng == lng) {
                                        this.$db.ref('reports/' + documents.key + "/" + document.key).remove().then(

                                        )
                                    }
                                })
                            })
                        })
                    })
                )

                this.getPotholes()
                this.loading = false
            },

            onSelectChanged($event) {
                this.perPage = parseInt($event.target.value)
                this.setPages()
            },

            orderBy(sortFn) {
                // sort your array data like this.userArray
                this.potholes.sort(sortFn);
            },
        },

        computed: {
            // map `this.user` to `this.$store.getters.user`
            ...mapGetters({
                user: 'user'
            }),

            displayPotholes() {
                return this.paginate(this.potholes)
            }
        },

        watch: {
            potholes() {
                this.setPages()
            }
        },

        created() {
            this.getPotholes()
        },

        filters: {
            trimWords(value) {
                return value.split("").splice(0, 20).join(" ") + '...'
            }
        }
    }
</script>

<style>
    .card-header {
        margin-bottom: 30px;
    }

    .card-pagination {
        width: 90%;
        margin: auto;
    }

    ul.pagination {
        padding: 0;
    }

    ul.bottom-pagination {
        width: 90%;
        margin: auto;
        text-align: right;
    }

    th {
        text-align: center;
    }

    th:hover {
        color: #f0ad4e;
    }

    th a {
        color: black;
        text-decoration: none;
    }

    th a:hover {
        color: #f0ad4e;
        text-decoration: none;
    }

    th a:focus {
        color: #f0ad4e;
        text-decoration: none;
    }

    th a:active {
        color: #f0ad4e;
        text-decoration: none;
    }

    .pagination {
        display: inline-block;
    }

    .pagination ul li {
        display: inline-block;
    }

    .page-item {
        display: inline-block;
    }

    button.page-link {
        display: inline-block!important;
    }

    button.page-link {
        color: #f0ad4e;
    }

    button.page-link:hover {
        color: #f0ad4e;
    }

    button.page-link:active {
        color: #f0ad4e;
    }

    .pagination {
        text-align: right;
        padding-right: 55px;
    }

    .card label {
        width: 100px;
        display: inline-block;
    }

    .card select {
        display: inline-block;
        width: 100px;
    }

    .card-pagination {
        text-align: right;
    }

    .card-pagination label {
        margin-right: 10px;
    }

    .card-pagination select {
        margin-right: 30px;
    }

    .card-pagination option:hover {
        background-color: #f0ad4e;
    }

    .card-pagination option:focus {
        background-color: #f0ad4e;
    }

    .card-pagination option:visited {
        background-color: #f0ad4e;
    }

    svg {
        margin-left: 5px;
    }

    .container {
        text-align: center;
    }

    svg {
        display: none;
    }

    tr {
        cursor: pointer;
    }

    .dashboard-container {
        width: 90%;
    }

    @media only screen and (max-width: 600px) {
        .card select {
            width: 80px;
            margin: 0;
        }
    }

    @media only screen and (max-width: 433px) {
        .card select {
            width: 42px;
            margin: 0;
            margin-bottom: 20px;
        }
    }
</style>
