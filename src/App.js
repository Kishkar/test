import React from 'react';
import './App.css';
import { Provider } from 'mobx-react';
import Graph from './stores/graph';
import SalesManWrapper from './views/salesmanTask';
import { configure } from 'mobx';

configure({enforceActions: "always"});

function App() {
  return (
    <Provider graph={Graph}>
      <div className="App">
        <SalesManWrapper />
      </div>
    </Provider>
  );
}

Graph.addVertex('A', {x: "384", y: "40"}, {B: 5, C: 6, M: 3});
Graph.addVertex('B', {x: "480", y: "160"}, {A: 5, C: 7, M: 12});
Graph.addVertex('C', {x: "768", y: "120"}, {A: 6, B: 7, E: 3, K: 5});
Graph.addVertex('D', {x: "1248", y: "88"}, {E: 9, F: 10, G: 8, I: 11});
Graph.addVertex('E', {x: "960", y: "152"}, {C: 3, D: 9, I: 7});
Graph.addVertex('F', {x: "1440", y: "208"}, {D: 10, G: 8});
Graph.addVertex('G', {x: "1728", y: "180"}, {D: 8, F: 8, H: 9});
Graph.addVertex('H', {x: "1635", y: "260"}, {G: 9, I: 12, J: 6});
Graph.addVertex('I', {x: "1152", y: "240"}, {D: 11, E: 7, H: 12, J: 3, K: 7});
Graph.addVertex('J', {x: "1268", y: "320"}, {H: 6, I: 3, K: 1, L: 10});
Graph.addVertex('K', {x: "806", y: "248"}, {C: 5, I: 7, J: 1, L: 9});
Graph.addVertex('L', {x: "614", y: "300"}, {J: 10, K: 9, M: 12});
Graph.addVertex('M', {x: "192", y: "200"}, {A: 3, B: 12, L: 12,});

Graph.addVertex('Q', {x: "192", y: "80"}, {});

export default App;