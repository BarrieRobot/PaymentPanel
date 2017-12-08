from flask import Flask, render_template, jsonify
import random
import database

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/js/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join('.', 'static', 'js'), filename)

@app.route('/random')
def random_num():

	num = random.randint(0, 100)
	if num < 20:
		return jsonify(9999)
	else:
		return jsonify("Geen NFC tag");

@app.route('/orders/<id>')
def getorders(id):
	return jsonify(database.getOrders(id))

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')
