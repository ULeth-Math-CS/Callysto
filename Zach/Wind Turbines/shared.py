global GLOBAL_SHOW_STATION 
GLOBAL_SHOW_STATION = None

def SET_GLOBAL_SHOW_STATION(num):
    global GLOBAL_SHOW_STATION
    GLOBAL_SHOW_STATION = int(num)
    
def GET_GLOBAL_SHOW_STATION():
    global GLOBAL_SHOW_STATION
    return GLOBAL_SHOW_STATION