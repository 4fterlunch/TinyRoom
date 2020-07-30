function Artifacts() {
    this.collection = [];


}
Artifacts.prototype = {
    add: {
        point(geom=[], group="defaultPoint") {
            this.collection.push(
                {
                    type: "Feature",
                    geometry: {
                        type: 'PointZ',
                        position: geom
                    },
                    properties: {
                        group: group
                    }
                }
            );
            return this;
        },
        line(geom=[], group="defaultLine") {
            this.collection.push(
                {
                    type: "Feature",
                    geometry: {
                        type: 'LineStringZ',
                        position: geom
                    },
                    properties: {
                        group: group
                    }
                }
            );
            return this;
        }
    }
} 
