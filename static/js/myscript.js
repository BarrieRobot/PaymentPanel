var refreshIntervalId;
var vm = new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data: {
    tag_id: "Geen NFC tag",
    orders:  ["None"],
    loadingtext: '',
    prices: []
  },
  mounted() {
    retrievePrices();
    refreshIntervalId = setInterval(function () {
      checkForTag();
    }.bind(this), 1000);
  },
  methods: {
    setprice: function(event) {
      alert('Hello ' + this.name + '!')
            // `event` is the native DOM event
            if (event) {
              alert(event.target)
            }

    }
  }
});

function retrievePrices() {
  axios.get('/prices').then(response => {
    vm.prices = response.data;
  });
}

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
