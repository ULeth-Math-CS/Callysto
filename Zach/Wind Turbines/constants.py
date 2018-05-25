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