from __future__ import print_function
from IPython.core.magic_arguments import (argument, magic_arguments, parse_argstring)
from IPython.core.magic import Magics, magics_class, line_magic, cell_magic
from IPython import get_ipython
from IPython.display import HTML, Javascript, display

@magics_class
class NTMagics(Magics):
    @line_magic
    @argument('container_id', type=str, help='The id of the container the questions will go in. This is also the name of the json file.')
    def loadNT(self, container_id):
        raw_code = '''%%html
        <script src="https://d3js.org/d3.v4.min.js"></script>
        <link rel="stylesheet" type="text/css" href="css/nt.css">
        <div id="{0}"></div>
        <div id="{0}-solutions"></div>
        <script>nt.register("{0}", "{0}" + "-solutions", "data/{0}.json", function() {{ nt.create_exercises("{0}");}})</script>
        <script src="js/nt.js"></script>'''.format(container_id);
        self.shell.run_cell(raw_code, store_history=False)
        
                    

ip = get_ipython()
ip.register_magics(NTMagics)