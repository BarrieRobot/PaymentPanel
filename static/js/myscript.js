var refreshIntervalId;
var vm = new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data: {
    tag_id: "Geen NFC tag",
    orders:  ["None"],
    loadingtext: ''
  },
  mounted() {
    refreshIntervalId = setInterval(function () {
      checkForTag();
    }.bind(this), 1000);
  }
});

function checkForTag () {
  axios.get('/random').then(response => {
    if (response.data === "Geen NFC tag") {
      // No tag found -> leave current active tag as is
     // this.message = "Geen NFC tag"
   } else if (vm.tag_id == response.data) {
      // Tag is same as before -> ignore

    } else {
       // Tag is new -> insert this tag + load data from database
       vm.tag_id = response.data;
       vm.loadingtext = 'Loading...';
       loadOrders(vm.tag_id);
    }
  }
  );
}

function loadOrders(tag_id) {
  axios.get('/orders/' + tag_id).then(response => {
      Vue.nextTick(function () {
        vm.loadingtext = '';
        vm.orders = response.data;
      })
    });
  }
