var refreshIntervalId;
var vm = new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data: {
    tag_id: "Geen NFC tag",
    orders:  [],
    products: [],
    loadingtext: '',
    loading: true,
    edit_price_id: null,
    edit_price_changed: false
  },
  computed: {
    order_sum: function() {
      var sum = 0.00;

      for (var key in this.orders) {
        // skip loop if the property is from prototype
        if (!this.orders.hasOwnProperty(key)) continue;

        sum += this.products[this.orders[key].drink].price;
      }

      // Return result with two digits after the comma
      return sum.toFixed(2).replace('.', ',');
    }
  },
  methods: {
    update_data: function() {
      // If the user has changed something in the price, update it in the database
      if (this.edit_price_changed) {
        axios.post('/update_price').then(response => {
          this.edit_price_changed = false;
          this.edit_price_id = null;
        });
      }
    },
    deleteOrders: function(event) {
      axios.get('/delete_orders/' + this.tag_id).then(response => {
        loadOrders(vm.tag_id);
      });
    }
  },
  mounted() {
    retrievePrices();
    refreshIntervalId = setInterval(function () {
      checkForTag();
    }.bind(this), 1000);
  }
});

function retrievePrices() {
  axios.get('/getprices').then(response => {
    vm.products = response.data;
  });
}

function checkForTag() {
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
