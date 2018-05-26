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

<button type='button' onclick='var var_station = document.getElementById("station_name").innerHTML; var var_index = document.getElementById("index").innerHTML; var command = "GLOBAL_SHOW_STATION = " + var_index; console.log("Executing Command: " + command); var kernel = IPython.notebook.kernel; kernel.execute(command);'>Show in table</button>
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