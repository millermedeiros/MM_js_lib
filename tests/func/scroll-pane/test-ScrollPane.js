define(['src/other/ScrollPane'], function(ScrollPane){

    var COLORS = ['#f00', '#0ff', '#0f0', '#00f', '#f0f'];

    var _scrollPane;

    function init(){

        var frame = document.getElementById('pane-frame'),
            content = document.getElementById('pane-content'),
            pane,
            nPanes = COLORS.length;

        for(var i = 0, n = nPanes; i < n; i += 1){
            pane = document.createElement('div');
            pane.className = 'pane';
            pane.innerHTML = i;
            pane.style.backgroundColor = COLORS[i];
            content.appendChild(pane);
        }

        _scrollPane = new ScrollPane(frame, content, nPanes);
        _scrollPane.updated.add(updateCurrent);
        // _scrollPane.loop = true;


        updateCurrent(0);

    }

    function updateCurrent(cur){
        document.getElementById('status').innerHTML = (cur + 1) +' of '+ _scrollPane.numPanes;
    }

    init();

});
