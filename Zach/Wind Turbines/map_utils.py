from pickle_to_txt import read_stations, get_station_attr

class KElementHeap():
    def __init__(self, k):
        self.k = k
        self.heap = [None] * k
        self.index = [None] * k
        
    def add(self, n, index, pos):
        last_elem = None
        last_index = None
        
        for i in range(len(self.heap)):
            last_elem = self.heap[i]
            last_index = self.index[i]
            self.heap[i] = n
            self.index[i] = index
            n = last_elem
            index = last_index
                
    def push(self, n, index):
        for i in range(len(self.heap)):
            if self.heap[i] is None or n < self.heap[i]:
                self.add(n, index, i)
                break
                
    def get_best(self):
        return self.index


# This is a slow implementation, if to slow make a quad-tree
#     pos is (lat, lon)
#     k is the how many to find
def station_find(Stations, Popups, pos, k=1):
    top = KElementHeap(k)
    
    for i, station in enumerate(Stations):
        lat = float(get_station_attr(station, 'lat'))
        lon = float(get_station_attr(station, 'lon'))
        dist = (pos[0]-lat)**2 + (pos[1] - lon)**2
        top.push(dist, i)
     
    best = top.get_best()
    for index in best:
        if Popups[index].value == '--':
            name = get_station_attr(Stations[index], 'name')
            Popups[index].value = name
    
        
def dec_to_deg(num):
    decimal = num - int(num)
    minutes = decimal * 60
    leftover = minutes - int(minutes)
    seconds = leftover * 60
    
    return (int(num), int(minutes), seconds)