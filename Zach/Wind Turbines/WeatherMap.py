import sys
import time
import ipyleaflet
from shared import *
from tqdm import tqdm
from constants import *
from threading import Timer
from ipywidgets import HTML
from ipykernel.comm import Comm
from MapEvents import MapEvents
from scipy.spatial import cKDTree
from IPython.display import HTML as HTML_DISPLAY
from ipyleaflet import Marker, Popup, MarkerCluster
from pickle_to_txt import read_stations, get_station_attr


#### TODO: Encasulated the markers and the comms
class WeatherMap(MapEvents):
    def __init__(self, Map=None, center=None, zoom=None):
        if Map is None:
            self.center = center
            if not center:
                self.center = (52.585538631877306, 245.45105824782084)
                
            self.zoom = zoom
            if not zoom:
                self.zoom = 6
                
            self.map = ipyleaflet.Map(center=self.center, zoom=self.zoom, close_popup_on_click=False)
        else:
            self.map = Map
        super().__init__(self.map)
        
        self.stations = []
        self.popups = []
        self.markers = []
        self.current_station = None
        self.comm = None

        
    def mousemove(self, type, event, coordinates):
        self.station_find(coordinates)

    
    def build(self, fileName):
        self.stations = read_stations(fileName)
        self.num_of_stations = len(self.stations)
        self.markers = [None] * self.num_of_stations
        self.popups = [None] * self.num_of_stations
        self.load_data()
        self.init_kdTree()
        self.table = HTML(HTML_TABLE)
        self.table.hold_sync
        self.open_comm('_button_')
        #self.map.on_interaction(self.callback)
        
        
    def open_comm(self, label):
        get_ipython().kernel.comm_manager.register_target(label, self.comm_handler)
    
    
    def comm_handler(self, comm, msg):
        @comm.on_msg
        def _recv(msg):
            self.comm = msg            
            self.update_table()

        
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
            #self.popups[index] = HTML(value='<p>'+name+'</p>\n<p>Latitude: '+lat+\
            #                          '<br>Longitude: '+lon+'<br>End Date: '+end+\
            #                          '</p>'+HTML_BUTTON,
            #                     placeholder='',
            #                     description='')
            #self.popups[index] = HTML(HTML_POPUP % (name, lat, lon, index))
            self.popups[index] = HTML(HTML_COMM % (name, lat, lon, index))
            #self.popups[index] = HTML_DISPLAY(HTML_RANGE_SLIDER)
            self.markers[index].popup = self.popups[index]

            
    def update_table(self):
        if self.comm is None:
            return
        index = int(self.comm['content']['data']['index'])
        #print("INDEX: " + str(index))
        #print("SHARED: " + str(GET_GLOBAL_SHOW_STATION()))
        #print(globals().keys())
        name = get_station_attr(self.stations[index], 'name').title()
        lat = get_station_attr(self.stations[index], 'lat')[:6]
        lon = get_station_attr(self.stations[index], 'lon')[:6]
        self.table.value = (HTML_TABLE % (name, lat, lon))