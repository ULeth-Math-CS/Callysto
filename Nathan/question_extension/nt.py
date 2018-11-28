#Custom magic functions, to use call 'import uiButtons' in a cell
#once the library has been imported magic commands may be used
#eg. %uiButtons

from __future__ import print_function
from IPython.core.magic import Magics, magics_class, line_magic
from IPython import get_ipython

@magics_class
class NTMagic(Magics):

    #When run it initilizes the 'show/hide code' buttons and the 'initialize' button
#     @line_magic
#     def uiButtons(self, line):
#         raw_code = '''%%html
#                     <script>
#                     document.getElementById('toggleButton').onclick = function () {
#                         if (code_shown) {
#                             $('div.input').hide('500');
#                             $('#toggleButton').val('Show Code')
#                         } else {
#                             $('div.input').show('500');
#                             $('#toggleButton').val('Hide Code')
#                         }
#                         code_shown = !code_shown
#                     }

#                     document.getElementById('init').onclick = function () {
#                         runAll = document.getElementById('run_all_cells_below').childNodes[1]
#                         console.log(runAll)
#                         runAll.click()
#                     }

#                     $(document).ready(function () {
#                         code_shown = true;
#                         $('div.input').hide()
#                     });
#                 </script>
#                 <input type="submit" id="toggleButton" value="Show Code">
#                 <input id="init" type="submit" value="Initialize">'''

#         self.shell.run_cell(raw_code, store_history=False)

# #define more custom magic function here as needed.
#     @line_magic
#     def addYoutube(self, line):
#         raw_code = '''%%html
#             <div align="middle">
#             <iframe id="percentVid" width="640" height="360" src="'''+ line +'''
#             " frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="box-shadow: 3px 3px 12px #ACACAC">
#             </iframe> 
#             </div>
#             <script>
#                 $(function() {
#                     var reachable = false;
#                     var myFrame = $('#percentVid');
#                     var videoSrc = myFrame.attr("src");
#                     myFrame.attr("src", videoSrc)
#                     .on('load', function(){reachable = true;});
#                     setTimeout(function() {
#                         if(!reachable) {
#                             var ifrm = myFrame[0];
#                             ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
#                             ifrm.document.open();
#                             ifrm.document.write('If the video does not start click <a href="' + videoSrc + '" target="_blank">here</a>');
#                             ifrm.document.close();
#                         }
#                     }, 2000)
#                 });
#             </script>
#             '''
    @line_magic
    def loadNT(self, line):
        raw_code = ""
        self.shell.run_cell(raw_code, store_history=False)

ip = get_ipython()
ip.register_magics(MyMagics)