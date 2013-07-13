myStyle = {
    "color": "#0000FF",
    "opacity": 0.65
};

states = [{
    "type": "Feature",
    "properties": {
        "name": "Poly test",
        "popupContent": "this is my test!",
        "style": "test"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [6.0, 52],  // top right
            [5.9,  52], // top left
            [5.9,  51.5], // bottom left
            [6.0, 51.5]
        ]]
    }
}];