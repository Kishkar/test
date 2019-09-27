import React from 'react';
import { observer, inject } from 'mobx-react';
import { extendObservable, action } from 'mobx';
import { ListNodes } from './dragAndDrop';

class SalesManWrapper extends React.Component {

    render() {
        return (
            <div className="wrapper-block">
                <Graph />
                <SearchPath />
            </div>
        );
    }
}

export default SalesManWrapper;

@inject('graph')
@observer
class Graph extends React.Component {
    render() {

        // const nodes = this.props.graph.vertex.map(([nodeName, coordinate]) => <div
        //     key={nodeName}
        //     className={shortPath.includes(nodeName) ? 'node red' : 'node'}
        //     style={{ top: coordinate.y, left: coordinate.x }}>
        //     <span>
        //         {nodeName}
        //     </span>
        // </div>);

        // let shortEdges = [];
        // for (let i = 0; i < shortPath.length - 1; i++) {
        //     shortEdges.push([shortPath[i], shortPath[i + 1]].sort().join());
        // }

        // const edges = [];
        // for (let edge of this.props.graph.edges.values()) {
        //     edges.push(<line
        //         className={shortEdges.includes(edge.name) ? 'red' : ''}
        //         x1={edge.x1}
        //         y1={edge.y1}
        //         x2={edge.x2}
        //         y2={edge.y2}
        //         key={edge.name} />);
        //     edges.push(<text
        //         x={edge.xCenter}
        //         y={edge.yCenter}
        //         key={edge.name + edge.weight}
        //         className="no-select"
        //     >
        //         {edge.weight}</text>);
        // }

        return (
            <div className="graph-wrapper">
                {/* {nodes} */}
                <ListNodes />
                <SvgEdges />
            </div>
        );
    }
}

@inject('graph')
@observer
class SvgEdges extends React.Component {
    render() {

        let shortPath = this.props.graph.shortestPath;

        let shortEdges = [];
        for (let i = 0; i < shortPath.length - 1; i++) {
            shortEdges.push([shortPath[i], shortPath[i + 1]].sort().join());
        }

        const edges = [];
        for (let edge of this.props.graph.edges.values()) {
            edges.push(<SvgEdgesLine
                shortEdges={shortEdges}
                edge={edge}
                key={edge.name} 
            />);
            edges.push(<SvgEdgesText
                key={edge.name + edge.weight}
                edge={edge}
            />);
        }

        return (
            <svg id="svg">
                {edges}
            </svg>
        );
    }
}

@observer
class SvgEdgesLine extends React.Component {
    render() {
        return (
            <line
                className={this.props.shortEdges.includes(this.props.edge.name) ? 'red' : ''}
                x1={this.props.edge.x1}
                y1={this.props.edge.y1}
                x2={this.props.edge.x2}
                y2={this.props.edge.y2}
            />
        );
    }
}

@observer
class SvgEdgesText extends React.Component {
    render() {
        return (
            <text
                x={this.props.edge.xCenter}
                y={this.props.edge.yCenter}
                className="no-select"
            >
                {this.props.edge.weight}
            </text>
        );
    }
}

@inject('graph')
@observer
class SearchPath extends React.Component {

    constructor(props) {
        super(props);

        let vertexName = this.props.graph.vertexName;
        extendObservable(this, {
            start: vertexName.length > 0 ? vertexName[0] : '',
            end: vertexName.length > 0 ? vertexName[0] : ''
        });
    }

    @action onChangeSelect = (event) => {
        this[event.target.name] = event.target.value;
    }

    onSubmit = (event) => {
        this.props.graph.setShortPath(this.start, this.end);
        event.preventDefault();
    }

    render() {
        const options = this.props.graph.vertexName.map((nodeName) => <option
            value={nodeName}
            key={nodeName}>
            {nodeName}</option>),
            start = this.props.start,
            end = this.props.end;

        return (
            <form onSubmit={this.onSubmit} className="form-wrapper">
                <label> Начальная точка:
                    <select name="start" value={this.start} onChange={this.onChangeSelect}>
                        {options}
                    </select>
                </label>
                <label> Конечная точка:
                    <select name="end" value={this.end} onChange={this.onChangeSelect}>
                        {options}
                    </select>
                </label>
                <input type="submit" value="Найти" />
            </form>
        );
    }
}