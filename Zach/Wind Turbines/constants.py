HTML_CHECKBOX='''<html>
<body>
<p>Display some text when the checkbox is checked:</p>
Checkbox: <input type="checkbox" id="myCheck"  onclick="myFunction()">
<p id="text" style="display:block">Checkbox is CHECKED!</p>

<script>
function myFunction() {
    var checkBox = document.getElementById("myCheck");
    var text = document.getElementById("text");
    alert('Goodbye World!');
    if (checkBox.checked == true){
        text.style.display = "block";
        alert('Hello World!');
    } else {
       text.style.display = "none";
    }
}
</script>
</body>
</html>'''


HTML_POPUP='''<html>
<script type="text/Javascript">
    function set_table() {
        var var_station = document.getElementById('station').innerHTML;
        var var_index = document.getElementById('index').innerHTML;
        
        var command = "GLOBAL_SHOW_STATION = " + var_index;
        console.log("Executing Command: " + command);
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);    
        }
        
</script>

<div>
<p id='station_name'>%s</p>
<p id='lat'>Latitude: %s<br>Longitude: %s</p>
<p id='index' hidden>%s</p>

<button type='button' onclick='set_table()'>Show in table</button>
</div>


</html>'''



input_form = """
<div style="background-color:gainsboro; border:solid black; width:300px; padding:20px;">
Variable Name: <input type="text" id="var_name" value="foo"><br>
Variable Value: <input type="text" id="var_value" value="bar"><br>
<button onclick="set_value()">Set Value</button>
</div>
"""

javascript = """
<script type="text/Javascript">
    function set_value(){
        var var_name = document.getElementById('var_name').value;
        var var_value = document.getElementById('var_value').value;
        var command = var_name + " = '" + var_value + "'";
        console.log("Executing Command: " + command);
        
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);
    }
</script>
"""

HTML_TEMP = '''<html>
<script type="text/Javascript">
    function set_table() {
        var var_station = document.getElementById("station").innerHTML;
        var var_index = document.getElementById("index").innerHTML;
        
        var command = "GLOBAL_SHOW_STATION = " + var_index;
        console.log("Executing Command: " + command);
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);    
        }
        
</script>

<div>
<p id='station_name'>%s</p>
<p id='lat'>Latitude: %s<br>Longitude: %s</p>
<p id='index' hidden>%s</p>

<button type='button' onclick='var var_station = document.getElementById("station_name").innerHTML; 
var var_index = document.getElementById("index").innerHTML; 
var command = "SET_GLOBAL_SHOW_STATION(" + var_index + ")"; 
console.log("Executing Command: " + command); 
var kernel = IPython.notebook.kernel; kernel.execute(command); 
comm = Jupyter.notebook.kernel.comm_manager.new_comm("_button_");
comm.send({"hello": "goodbye"});'>Show in table</button>
</div>


</html>'''


HTML_COMM = '''<html>
<div>
<p id='station_name'>%s</p>
<p id='lat'>Latitude: %s<br>Longitude: %s</p>
<p id='index' hidden>%s</p>

<button type='button' onclick='var var_station = document.getElementById("station_name").innerHTML; 
var var_index = document.getElementById("index").innerHTML; 
var command = "SET_GLOBAL_SHOW_STATION(" + var_index + ")"; 
console.log("Executing Command: " + command); 
var kernel = IPython.notebook.kernel; kernel.execute(command); 
comm = Jupyter.notebook.kernel.comm_manager.new_comm("_button_");
comm.send({"index": var_index});'>Show in table</button>
</div>


</html>'''



HTML_BUTTON='''<html>
<body>

<p id="show_in_table">no</p>
<button type="button" onclick="document.getElementById('show_in_table').innerHTML = 'yes'">Show in table</button>

</body>
</html>'''



HTML_TABLE = '''<html>
<head>
<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}
</style>
</head>
<body>

<h2>HTML Table</h2>

<table>
  <tr>
    <th>Station</th>
    <th>Latitude</th>
    <th>Longitude</th>
  </tr>
  <tr>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
  </tr>
</table>

</body>
</html>'''


HTML_RANGE_SLIDER='''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>jQuery UI Slider - Range slider</title>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script>
  $( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 1840,
      max: 2018,
      values: [ 2000, 2003 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
  } );
  </script>
</head>
<body>
 
<p>
  <label for="amount">Year range:</label>
  <input type="text" id="amount" readonly style="border:0; color:#f6931f; font-weight:bold;">
</p>
 
<div id="slider-range"></div>
 
 
</body>
</html>'''


NO_UI_SLIDER='''
<html>
<body>
<script>
var range = document.getElementById('range');

nouislider/nouislider.create(range, {

	range: {
		'min': 1300,
		'max': 3250
	},

	step: 150,

	// Handles start at ...
	start: [ 1450, 2050, 2350, 3000 ],

	// ... must be at least 300 apart
	margin: 300,

	// ... but no more than 600
	limit: 600,

	// Display colored bars between handles
	connect: true,

	// Put '0' at the bottom of the slider
	direction: 'rtl',
	orientation: 'vertical',

	// Move handle on tap, bars are draggable
	behaviour: 'tap-drag',
	tooltips: true,
	format: wNumb({
		decimals: 0
	}),

	// Show a scale with the slider
	pips: {
		mode: 'steps',
		stepped: true,
		density: 4
	}
});
</script>

<p id="range"></p>

</body>
</html>'''


HTML_SLIDER='''<!DOCTYPE html>
<html>
<body>

<h1>Custom Range Slider</h1>
<p>Drag the slider to display the current value.</p>

<div class="slidecontainer">
  <input type="range" min="1840" max="2018" value="2000" class="slider" id="myRange" oninput='document.getElementById("demo").innnerHTML=document.getElementById("myRange").value;'>
  <p>Value: <span id="demo"></span></p>
</div>

</body>
</html>'''