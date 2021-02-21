var showingTerritories = false;
var requestInProgress = false;
var territoryElements = [];
var guildColorList = {};
var colorsUsed = [];

overviewer.util.ready(function() {
	setInterval(initTerritories(), 60000);
	var tc = L.control({ position: 'bottomleft' });
	tc.onAdd = function() {
		this.container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded leaflet-control');
		this.container.innerHTML = '<form><input type="checkbox" onchange="showTerritories(this)"/>Show Territories</form>';
		return this.container;
	}
	tc.addTo(overviewer.map);
});

function showTerritories(ev) {
//	if (ev.checked) {
//		removeLocationLabels();
//		overviewer.util.removeIcons();
//		loadTerritories();
//	} else {
//		removeTerritories();
//		overviewer.util.loadIcons();
//		loadLocationLabels();
//	}
		overviewer.util.loadIcons();
		loadTerritories();
		loadLocationLabels();
}

function initTerritories() {
	requestInProgress = true;
	$.ajax({url: 'https://raw.githubusercontent.com/tylastrog/fiascos-smp-overviewer/main/public_api.php.json?action=territoryList', cache: true, success: function(result) {
		for(var name in result.territories) {
			var territory = result.territories[name];
      
			if (territory.hasOwnProperty('location')) {
				var isAttacker = territory.attacker && territory.attacker != territory.guild;
        
				var paths = [];
				paths.push(getLatLng(territory.location.startX, territory.location.startY));
				paths.push(getLatLng(territory.location.endX, territory.location.startY));
				paths.push(getLatLng(territory.location.endX, territory.location.endY));
				paths.push(getLatLng(territory.location.startX, territory.location.endY));
				
				function generateColor() {
					var lt = '23456789ABCDEF'.split('');
					var c = '#';
					do {	
						for (var i = 0; i < 6; i++) {
							c += lt[Math.floor(Math.random() * lt.length)];
						}
					} while (colorsUsed.indexOf(c) !== -1); 
					return c;
				}

				//var color = '#' + (Math.random()*0xFFFFFF<<0).toString(16);
				var color = generateColor();
				if (!guildColorList.hasOwnProperty(territory.guild)) {
					guildColorList[territory.guild] = color;
					colorsUsed.push(color);
				} else {
					color = guildColorList[territory.guild];
				}
				var polygon = L.polygon(paths, {
					fillColor: color,
					fillOpacity: 0.35,
					color: color,
					strokeOpacity: 0.8,
					stroke: true,
					fill: true,
					interactive: true,
					map: overviewer.map,
					name: name
				});
				territoryElements.push(polygon);
				
				function labelHtml(title, fontsize, color) {
				    var t = '<div style="text-align:center; z-index:203; position: absolute; left: -50px; top:-10px;">';
				    t += '<span style="position: relative;';
                    t += 'white-space: nowrap; font-weight: bold;';
				    t += 'font-family: \'Titillium Web\', sans-serif; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 3px 3px 3px #000;';
				    t += 'text-align: center; color:' + color + ';font-size:' + fontsize + 'px;"'
				    t += '>' + title + '</span></div>';
				    return t;
				}

				var nlCoords = getCenter(territory.location);
				var nameLabel = new L.DivIcon({
					html: labelHtml(name + '<div class="guildSubScript" style="color: '+ color +' !important;">' + territory.guild + '</div>', 12, color),
					className: 'wctlabel',
					iconSize: [0,0]
				});
				var nlm = L.marker(nlCoords, {icon:nameLabel, zIndexOffset: 204});
				territoryElements.push(nlm);	
			}
		}
		requestInProgress = false;
	}});
}

function loadTerritories() {
	if (showingTerritories) return;
	if (requestInProgress) return;
	for (var i in territoryElements) {
		var t = territoryElements[i];
		t.addTo(overviewer.map);
	}
	showingTerritories = true;
}

function getLatLng(x, z) {
	var ovconf = overviewer.current_layer[overviewer.current_world].tileSetConfig;
	return overviewer.util.fromWorldToLatLng(x, 32, z, ovconf);
}

function getCenter(location) {
	var ovconf = overviewer.current_layer[overviewer.current_world].tileSetConfig;
	var x = location.endX - location.startX;
	var z = location.endY - location.startY;
	return overviewer.util.fromWorldToLatLng(location.startX + Math.floor(x / 2), 32, location.startY + Math.floor(z / 2), ovconf);
}

function removeTerritories() {
	if (!showingTerritories) {
		return;
	}
	for (var i in territoryElements) {
		var t = territoryElements[i];
		t.remove();
	}
	showingTerritories = false;
}

