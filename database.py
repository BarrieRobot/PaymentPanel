import pyrebase

config = {
  "apiKey": "AIzaSyA3bOyBN0KKnPjN5ckO9OrLmzdST7daZIE",
  "authDomain": "iona-4d244.firebaseapp.com",
  "databaseURL": "https://iona-4d244.firebaseio.com",
  "storageBucket": "iona-4d244.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

def getOrders(id):
    return db.child('shared').child('orders').get().val()[id]