var locationLabels = [];
overviewer.util.ready(function () {
	initLocationLabels();
});

function loadLocationLabels() {
	for (var l in locationLabels) {
		locationLabels[l].addTo(overviewer.map);
	}
	console.log('Sucessfully loaded location labels!');
}

function removeLocationLabels() {
	for (var l in locationLabels) {
		locationLabels[l].remove();
	}
	console.log('Sucessfully removed location labels!');
}

function initLocationLabels() {
  setTimeout(function() {
	var ovconf = overviewer.current_layer[overviewer.current_world].tileSetConfig;
    
    function labelHtml(title, fontsize, color) {
		var t = '<div style="text-align:center; z-index:203; position: absolute; left: -40px; top:-10px;">';
		t += '<span style="position: relative;';
		t += 'white-space: nowrap; font-weight: bold;';
		t += 'font-family: \'Titillium Web\', sans-serif; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 3px 3px 3px #000;';
		t += 'text-align: center; color:' + color + ';font-size:' + fontsize + 'px;"';
		t += '>' + title + '</span></div>';
		return t;
    }

    // Yellow (Big)
    latLng = overviewer.util.fromWorldToLatLng(-10, 112, 0, ovconf)
    label = new L.DivIcon({iconSize:[0,0],className:'wcLabel',
        html: labelHtml('the fiascos smp', '25', '#FFFF55')
    });
    l = L.marker(latLng, {icon:label, zIndexOffset:90000});
    l.addTo(overviewer.map);
	locationLabels.push(l);



	// White (Medium)
    //latLng = overviewer.util.fromWorldToLatLng(979, 81, -675, ovconf)
    //label = new L.DivIcon({iconSize:[0,0],className:'wcLabel',
    //    html: labelHtml('Lutho<div class="level">[Lv. 105]</div>', '16', '#ffffff')
	//});
    //l = L.marker(latLng, {icon:label, zIndexOffset:90000});
    //l.addTo(overviewer.map);
	//locationLabels.push(l);	


	
	// Gray (Small)
    //latLng = overviewer.util.fromWorldToLatLng(603, 100, -543, ovconf)
    //label = new L.DivIcon({iconSize:[0,0],className:'wcLabel',
   //    html: labelHtml('Ruined Olmic City<div class="level">[Lv. 100]</div>', '14', '#AAAAAA')
	//});
    //l = L.marker(latLng, {icon:label, zIndexOffset:90000});
    //l.addTo(overviewer.map);
	//locationLabels.push(l);
	
  }, 2000);
}

