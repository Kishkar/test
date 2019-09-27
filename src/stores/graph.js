import { extendObservable, action, computed, observe, decorate } from 'mobx';

class PriorityQueue {
    constructor() {
        this._nodes = [];
    }
    enqueue(priority, key) {
        this._nodes.push({key: key, priority: priority });
        this.sort();
    }
    dequeue() {
        return this._nodes.pop().key;
    }
    sort() {
        this._nodes.sort((a, b) => b.priority - a.priority);
    }
    isEmpty() {
        return !this._nodes.length;
    }
}

class Graph {
    constructor(){

        extendObservable(this, {
            vertices: {},
            verticesCoordinates: {},
            shortPath: {
                start: '',
                end: ''
            }
        })
    }

    addVertex(name, coordinates = {}, edges = {}) {
        this.vertices[name] = edges;
        let {x = "0", y = "0"} = coordinates; 
        this.verticesCoordinates[name] = {x, y};
    }
    
    setShortPath(start, end){
        this.shortPath.start = start;
        this.shortPath.end = end;
    }

    get vertex() {
        return Object.entries(this.verticesCoordinates);
    }

    get vertexName() {
        return Object.keys(this.verticesCoordinates)
    }

    get edges() {
        let edges = new Map();
        for(let [nameFirst, list] of Object.entries(this.vertices)){
            let {x: x1, y: y1} = this.verticesCoordinates[nameFirst];
            for(let [nameSecond, weight] of Object.entries(list)){
                let edgeId = [nameFirst, nameSecond].sort().join()
                if(!edges.has(edgeId)){
                    let {x: x2, y: y2} = this.verticesCoordinates[nameSecond]
                    let xCenter = 0, yCenter = 0;
                    xCenter = (parseInt(x1) + parseInt(x2))/2;
                    yCenter = (parseInt(y1) + parseInt(y2))/2;
                    let edgeInfo = {
                        name: edgeId,
                        x1: x1,
                        x2: x2,
                        xCenter: xCenter,
                        y1: y1,
                        y2: y2,
                        yCenter: yCenter,
                        weight: weight,
                    }
                    edges.set(edgeId, edgeInfo);
                }
            }
        }

        return edges;
    }

    get shortestPath() {

        var nodes = new PriorityQueue(),
        distances = {},
        previous = {},
        path = [],
        smallest, vertex, neighbor, alt;

        for(vertex in this.vertices) {
            if(vertex === this.shortPath.start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(Infinity, vertex);
            }

            previous[vertex] = null;
        }

        while(!nodes.isEmpty()) {
            smallest = nodes.dequeue();

            if(smallest === this.shortPath.end) {
                path = [];

                while(previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }

                break;
            }

            if(!smallest || distances[smallest] === Infinity){
                continue;
            }

            for(neighbor in this.vertices[smallest]) {
                alt = distances[smallest] + this.vertices[smallest][neighbor];

                if(alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }

        if(path.length == 0){
            path.push(this.shortPath.end);
        }
        return path.concat(this.shortPath.start).reverse();
    }
}

decorate(Graph, {
    addVertex: action.bound,
    setShortPath: action.bound,
    vertex: computed,
    vertexName: computed,
    edges: computed,
    shortestPath: computed,

})

export default new Graph();