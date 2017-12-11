var refreshIntervalId;
var vm = new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data: {
    tag_id: "Geen NFC tag",
    orders:  [],
    products: [],
    loadingtext: 'Orders aan het laden',
    loading: true,
    edit_price_id: null,
    edit_price_changed: false
  },
  computed: {
    order_sum: function () {
      // var sum = 0.00;
      // this.orders.forEach(function (order) {
      //   sum += order.price * order.n;
      // });
      // Return result with two digits after the comma
      return 2;//sum.toFixed(2).replace('.', ',');
    }
  },
  methods: {
    update_data: {
      // If the user has changed something in the price, update it in the database
      if (edit_price_changed) {
        axios.post('/update_price').then(response => {
          edit_price_changed = false;
          edit_price_id = null;
        });
      }
    },
    setprice: function(event) {
      alert('Hello ' + this.name + '!')
            // `event` is the native DOM event
            if (event) {
              alert(event.target)
            }

    }
  },
  mounted() {
    retrievePrices();
    refreshIntervalId = setInterval(function () {
      checkForTag();
    }.bind(this), 1000);
  },
  methods: {

  }
});

function retrievePrices() {
  axios.get('/getprices').then(response => {
    vm.products = response.data;
  });
}

function checkForTag () {
  axios.get('/random').then(response => {
    if (response.data === "Geen NFC tag") {
      // No tag found -> leave current active tag as is
      // this.message = "Geen NFC tag"
   } else if (vm.tag_id === response.data) {
      // Tag is same as before -> ignore

    } else {
       // Tag is new -> insert this tag + load data from database
       vm.tag_id = response.data;
       vm.loadingtext = 'Loading...';
       loadOrders(vm.tag_id);
    }
  });
}

function loadOrders(tag_id) {
  axios.get('/orders/' + tag_id).then(response => {
    vm.loading = false;
    vm.orders = response.data;
  });
}
