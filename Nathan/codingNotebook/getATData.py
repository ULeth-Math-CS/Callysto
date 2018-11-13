import requests
import json

url = "https://opensky-network.org/api/states/all?lamin=48.946586&lomin=-140.853015&lamax=69.666097&lomax=-53.469185"

r = requests.get(url, auth=('ntipper', 'callysto'))

with open("./air-traffic.json", "w") as outfile:
    json.dump(r.json(), outfile);
