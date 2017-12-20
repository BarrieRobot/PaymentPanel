import json
from flask import Flask, render_template, request
import random
import database
from nfc_reader import NFCReader

app = Flask(__name__)
nfcreader = NFCReader()
nfcreader.start()

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/js/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join('.', 'static', 'js'), filename)

@app.route('/random')
def random_num():
	try:
                        tagid = json.dumps(nfcreader.getLastTag())
                        return tagid
	except:
		print "err"
		num = random.randint(0, 100)
		if num < 40:
			return json.dumps(9999)
		else:
			return json.dumps("Geen NFC tag");

@app.route('/orders/<id>')
def getorders(id):
	return json.dumps(database.getOrders(id))

@app.route('/delete_orders/<id>')
def delete_orders(id):
	return json.dumps(database.deleteOrders(id))

@app.route('/getprices')
def getPrices():
	return json.dumps(database.getPrices())

@app.route("/update_price", methods=['POST'])
def updatePrices():
	products = json.loads(request.data)
	database.updatePrices(products)
	return ""

if __name__ == '__main__':
        app.run(debug=True, host='0.0.0.0')
