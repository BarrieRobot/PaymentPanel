import pyrebase

config = {
  "apiKey": "AIzaSyA3bOyBN0KKnPjN5ckO9OrLmzdST7daZIE",
  "authDomain": "iona-4d244.firebaseapp.com",
  "databaseURL": "https://iona-4d244.firebaseio.com",
  "storageBucket": "iona-4d244.appspot.com",
  "serviceAccount": "iona-4d244-firebase-adminsdk-sc59q-0ada4d6ada.json"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

def getOrders(id):
    return db.child('shared').child('orders').child(id).get().val()

def getPrices():
    return db.child('Barrie').child('options').get().val()

def updatePrices(data):
    return db.child('Barrie').child('options').set(data)

def deleteOrders(id):
    return db.child('shared').child('orders').child(id).remove()
