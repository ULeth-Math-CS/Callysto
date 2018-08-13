#Custom magic functions, to use call 'import uiButtons' in a cell
#once the library has been imported magic commands may be used
#eg. %uiButtons

from __future__ import print_function
from IPython.core.magic import Magics, magics_class, line_magic
from IPython import get_ipython
from IPython.display import Javascript, display

@magics_class
class MyMagics(Magics):

    #When run it initilizes the 'show/hide code' buttons and the 'initialize' button
    @line_magic
    def exerciseGeneration(self, line):
        raw_code = "from IPython.display import Javascript\nwith open(\"nt.js\") as f:\n\tdisplay(Javascript(f.read()))";
        self.shell.run_cell(raw_code, store_history=False)
         
        
#define more custom magic function here as needed.

ip = get_ipython()
ip.register_magics(MyMagics)