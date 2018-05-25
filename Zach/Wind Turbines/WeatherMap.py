#import requests
from tqdm import tqdm
from constants import *
from ipywidgets import HTML
from scipy.spatial import cKDTree
#from bs4 import BeautifulSoup as bs
from ipyleaflet import Marker, Map, Popup, MarkerCluster
from pickle_to_txt import read_stations, get_station_attr

class WeatherMap():
    def __init__(self):
        self.center = (52.585538631877306, 245.45105824782084)
        self.zoom = 6
        self.map = Map(center=self.center, zoom=self.zoom, close_popup_on_click=False)
        self.stations = []
        self.popups = []
        self.markers = []
        
        
    def build(self, fileName):
        self.stations = read_stations(fileName)
        self.num_of_stations = len(self.stations)
        self.markers = [None] * self.num_of_stations
        self.popups = [None] * self.num_of_stations
        self.load_data()
        self.init_kdTree()
        self.table = HTML(HTML_TABLE)
        self.table.hold_sync
        
        
    def load_data(self):
        # Put a marker on the map for each station
        for i, station in enumerate(tqdm(self.stations)):
            marker = Marker(location=(float(get_station_attr(station, 'lat')), 
                                      float(get_station_attr(station, 'lon'))), 
                            draggable=False)
            self.markers[i] = marker
            
        marker_cluster = MarkerCluster(markers=self.markers)
        self.map.add_layer(marker_cluster)
        
    
    def init_kdTree(self):
        data = [None] * self.num_of_stations
        for i, station in enumerate(self.stations):
            lat = float(get_station_attr(station, 'lat'))
            lon = float(get_station_attr(station, 'lon'))
            data[i] = (lat, lon)

        self.kdTree = cKDTree(data)

        
    # This is a log(n) search for a station
    #     pos = (lat, lon)
    def station_find(self, pos):
        query = self.kdTree.query(pos)
        index = query[1]

        if self.popups[index] is None:
            name = get_station_attr(self.stations[index], 'name').title()
            station_id = get_station_attr(self.stations[index], 'station_id')
            lat = get_station_attr(self.stations[index], 'lat')[:6]
            lon = get_station_attr(self.stations[index], 'lon')[:6]
            end = get_station_attr(self.stations[index], 'end_date')
            self.popups[index] = HTML(value='<p>'+name+'</p>\n<p>Latitude: '+lat+\
                                      '<br>Longitude: '+lon+'<br>End Date: '+end+\
                                      '</p>'+HTML_BUTTON,
                                 placeholder='',
                                 description='')
            self.markers[index].popup = self.popups[index]



    def update_table(self, pos):
        query = self.kdTree.query(pos)
        index = query[1]

        if '<p id="show_in_table" hidden>yes</p>' in self.popups[index].value:
            name = get_station_attr(self.stations[index], 'name')
            lat = get_station_attr(self.stations[index], 'lat')[:6]
            lon = get_station_attr(self.stations[index], 'lon')[:6]
            self.table.value = (HTML_TABLE % (name, lat, lon))
        else:
            pass#print(self.popups[index].value)