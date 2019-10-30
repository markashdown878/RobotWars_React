import React from "react";
import Robot from "./Robot";

const MOVE_VECTOR = {
    S: [0, -1],
    W: [-1, 0],
    N: [0, 1],
    E: [1, 0]
};

const LEFT_TURNS_MAP = {
    N: "W",
    W: "S",
    S: "E",
    E: "N"
};

const RIGHT_TURNS_MAP = {
    N: "E",
    E: "S",
    S: "W",
    W: "N"
};

class Arena extends React.Component {

    initialState = {
        start: null,
        end: null,
        ops: [],
        position: "0-0",
        facing: "N",
        path: null,
        error: null,
    };

    state = Object.assign({}, this.initialState);

    componentDidMount() {
        this.reset(() => {
            this.process(this.props);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.reset(() => {
            this.process(nextProps);
        });
    }

    reset = (cb) => {
        this.setState(this.initialState, cb);
    };

    process = (props) => {
        const {commands, position} = props;
        if (commands === '') {
            this.setState(this.initialState);
        } else {
            const parts = position.split(" ");
            this.setState(
                {
                    start: parts[0] + "-" + parts[1],
                    position: parts[0] + "-" + parts[1],
                    facing: parts[2]
                },
                () => {
                    if (props.execute) {
                        this.execute(commands);
                    }
                }
            );
        }
    };

    execute = (commands) => {
        let ops = (commands || "").split("");
        this.setState({ops}, () => {
            setTimeout(this.run.bind(this), 500);
        });
    };

    run = () => {
        let ops = this.state.ops.slice();
        let {position, path, facing} = this.state;
        path = path || {};
        path[position] = facing;
        let op = ops.shift();
        let newPosition = {};
        if (op === "L") {
            newPosition = this.turnRobotLeft();
        } else if (op === "R") {
            newPosition = this.turnRobotRight();
        } else if (op === "M") {
            newPosition = this.moveRobotForward();
        } else {
            console.log("Invalid command");
        }
        if (newPosition.error) {
            alert('The robot has crashed into the side of the arena!');
        }
        this.setState(Object.assign(this.state, {
            ops,
            path,
            ...newPosition
        }), () => {
            if (this.state.ops.length > 0 && !this.state.error) {
                setTimeout(this.run.bind(this), 300);
            } else {
                this.setState({
                    end: this.state.position
                })
            }
        })

    };

    moveRobotForward = () => {
        const {size} = this.props;
        const {position, facing} = this.state;
        const moveVector = MOVE_VECTOR[facing];
        const pos = position.split('-').map(Number);
        const x = pos[0] + moveVector[0];
        const y = pos[1] + moveVector[1];
        if (x < 0 || x >= size || y < 0 || y >= size) {
            return {error: true};
        }
        return {
            position: x + '-' + y
        };
    };

    turnRobotLeft = () => {
        const {facing} = this.state;
        return ({
            facing: LEFT_TURNS_MAP[facing]
        });
    };

    turnRobotRight = () => {
        const {facing} = this.state;
        return ({
            facing: RIGHT_TURNS_MAP[facing]
        });
    };

    render() {

        const {size} = this.props;
        let {position, facing, path} = this.state;
        path = path || {};
        let cells = [];
        for (let i = size - 1; i >= 0; i--) {
            for (let j = 0; j < size; j++) {
                cells.push(j + "-" + i);
            }
        }
        return (
            <ul className="arena">
                {cells.map(cell => {

                    let robotElm = null;
                    let robotPath = null;
                    let cellStatus = '';

                    if (this.state.error && this.state.end === cell) {
                        cellStatus = 'error';
                    }
                    if (this.state.start === cell) {
                        cellStatus += ' start';
                    }
                    if (this.state.end === cell) {
                        cellStatus += ' end';
                    }

                    if (position === cell) {
                        robotElm = <Robot facing={facing}/>;
                    } else {
                        robotPath = (path[cell] ? <Robot facing={path[cell]} ghost={true}/> : null);
                    }

                    return (
                        <li className={`cell ${!!path[cell] ? 'path' : ''} ${cellStatus}`} key={cell}>
                            <label>{cell}</label>
                            {robotElm || robotPath}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default Arena;