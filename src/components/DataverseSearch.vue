<template>
  <div class="container">
    <!-- input for search -->
    <div class="jumbotron">
      <h1 class="display-3">{{ msg }}</h1>
      <p class="lead">Enter search query for DemoDataverse and press Enter:</p>

      <input
        class="form-control form-control-lg mb-4"
        type="text"
        id="message"
        v-model="message"
        placeholder="Search Text"
        v-on:keyup="getResults"
        style="background-color: white;"
      >

      <p class="lead">
        <a
          class="btn btn-primary btn-lg"
          href="#"
          role="button"
          @click="getResults('button')"
        >Search</a>
      </p>
    </div>

    <!-- results -->
    <div class="results card_containter">
      <div class="row" v-for="item in results" v-bind:key="item.global_id">
        <div class="card">
          <h3 class="card-header">{{item.name}}</h3>
          <div class="card-body">
            <h5 v-if="item.authors" class="card-title">{{ item.authors[0] }}</h5>
            <!-- <h6 class="card-subtitle text-muted">Support card subtitle</h6> -->
            <p class="card-text">{{ item.description }}</p>
          </div>
          <div class="card-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="gotoURL(item.global_id)"
            >Go to source</button>
          </div>
        </div>
      </div>
      <br>
      <br>
      <div
        class="alert alert-dismissible alert-warning card"
        v-if="results.length === 0"
      >Oh no 😢. No results found!</div>
    </div>
  </div>
</template>

<script>
import { DataverseClient } from "js-dataverse";

export default {
  name: "DataverseSearch",
  props: {
    msg: String
  },
  data: function() {
    return {
      results: [],
      message: "",
      dataverseURL: "https://dataverse.harvard.edu",
      client: {}
    };
  },
  created() {
    this.client = new DataverseClient(this.dataverseURL);
    console.log(this.client);
  },
  methods: {
    getDeepLink(doi) {
      return `https://${this.dataverseURL}/dataset.xhtml?persistentId=${doi}`;
    },
    gotoURL(doi) {
      window.location.href = `${
        this.dataverseURL
      }/dataset.xhtml?persistentId=${doi}`;
    },
    getResults(e) {
      if (e.keyCode === 13 || e === "button") {
        this.results = {};
        // concatenate results with a '+'
        const search = this.message.replace(/ /g, "+");

        /*
         ** js-dataverse verion
         */
        const searchQuery = {
          query: search,
          itemsPerPage: 20
        };
        this.client
          .search(searchQuery)
          .then(res => {
            // console.log(res.data.data.items);
            this.results = res.data.data.items;
          })
          .catch(error => {
            console.log(error);
          });

        /*
         ** Direct version
         */
        // const url = `${
        //   this.dataverseURL
        // }/api/search?q=${search}&per_page=10&type=dataset`;
        // // const url = `https://nominatim.openstreetmap.org/search.php?q=${search}&format=json&addressdetails=1&extratags=1&namedetails=1&limit=10`;

        // fetch(url)
        //   .then(response => response.json())
        //   .then(myJson => {
        //     this.results = myJson.data.items;
        //     console.log(myJson.data.items);
        //   })
        //   .catch(error => console.error("Error:", error));
      }
    }
  }
};
</script>

<style scoped>
.card_containter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  align-content: stretch;
}

.card {
  flex: flex-basis;
  align-self: auto;
  width: 350px;
  margin: 25px;
  /* max-height: 500px; */
}

.card-header {
  overflow: hidden;
  max-height: 200px;
  font-size: 1.6em;
  font-style: bold;
}

.card-text {
  max-height: 200px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
</style>
