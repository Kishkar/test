import React from 'react'
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';

const draggedObject = observable({
    isDragged: false,
    vertex: null
});


@observer
class DragAndDropArea extends React.Component {

    @action
    handleMouseMove = (event) => {
        if (draggedObject.isDragged) {
            draggedObject.vertex.x = event.pageX;
            draggedObject.vertex.y = event.pageY;
        }
    }

    render() {
        return (
            <div className="drag-and-drop-area"
                onMouseMove={this.handleMouseMove}
            >
                {this.props.nodes}
            </div>
        );
    }
}

@inject('graph')
@observer
class ListNodes extends React.Component {
    render() {

        let shortPath = this.props.graph.shortestPath;

        const nodes = this.props.graph.vertex.map(([nodeName, coordinate]) => <Vertex
            key={nodeName}
            nodeName={nodeName}
            shortPath={shortPath}
            coordinate={coordinate}
        />)

        return (
            <DragAndDropArea nodes={nodes} />
        );
    }
}

@inject('graph')
@observer
class Vertex extends React.Component {

    @action
    handleMouseDown = (event) => {
        draggedObject.isDragged = true;
        draggedObject.vertex = this.props.coordinate;
        event.preventDefault();
    }

    @action
    handleMouseUp = (event) => {
        draggedObject.isDragged = false;
        event.preventDefault();
    }

    render() {


        return (
            <div className="node"
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                className={this.props.shortPath.includes(this.props.nodeName) ? 'node red' : 'node'}
                style={{ top: this.props.coordinate.y + 'px', left: this.props.coordinate.x + 'px' }}
            >
                <span className="no-select">{this.props.nodeName}</span>
            </div>
        );
    }
}


export { ListNodes };