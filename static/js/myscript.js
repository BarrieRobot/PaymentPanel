var refreshIntervalId;
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    this.event = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', this.event)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', this.event)
  },
});

var vm = new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data: {
    tag_id: "Geen NFC tag",
    orders:  null,
    products: [],
    loadingtext: 'Laden...',
    loading: false,
    edit_price: false,
    edit_price_changed: false
  },
  computed: {
    order_sum: function() {
      var sum = 0.00;

      for (var key in this.orders) {
        // skip loop if the property is from prototype
        if (!this.orders.hasOwnProperty(key)) continue;

        sum += parseFloat(this.products[this.orders[key].drink].price);
      }

      // Return result with two digits after the comma
      return sum.toFixed(2).replace('.', ',');
    }
  },
  methods: {
    update_data: function() {
      // If the user has changed something in the price, update it in the database
      if (this.edit_price_changed) {
        axios.post('/update_price', this.products).then(response => {
          this.edit_price_changed = false;
          this.edit_price_id = null;
        });
      }
    },
    deleteOrders: function(event) {
      axios.get('/delete_orders/' + this.tag_id).then(response => {
        this.loading = true;
        loadOrders(vm.tag_id);
      });
    },
    cancelEditPrice: function() {
      this.edit_price = false;
      retrievePrices();
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
  axios.get('/get_tag').then(response => {
    if (response.data === "Server error") {\
      // Server error -> inform user by putting the sting in the tag_id box
      vm.tag_id = response.data;
    } else if (response.data === "Geen NFC tag") {
      // No tag found -> leave current active tag as is
    } else if (vm.tag_id === response.data) {
      // Tag is same as before -> ignore
    } else {
       // Tag is new -> insert this tag + load data from database
       vm.tag_id = response.data;
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
