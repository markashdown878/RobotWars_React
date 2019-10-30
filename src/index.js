import React from "react";
import {render} from "react-dom";
import "./index.css";
import Arena from "./components/Arena";

class App extends React.Component {

    state = {
        commands: '',
        commandsToExecute: '',
        execute: false,
        startPosition: '00N'
    };

    addCommand = (e) => {
        this.setState({
            commands: this.state.commands + e.target.value
        })
    };

    runSample = (e) => {
        this.setState({
            commands: e.target.value
        });
    };

    execute = () => {
        let startPosition = this.startInput.value;
        if (/^[0-4][0-4][NEWS]$/.test(startPosition)) {
            this.setState({
                execute: true,
                commandsToExecute: this.state.commands,
                startPosition
            });
        } else {
            alert('Invalid start position.');
        }

    };

    clear = () => {
        this.setState({
            commands: '',
            execute: false,
            commandsToExecute: ''
        });
    };

    validateStartPosition = (e) => {
        e.target.checkValidity();
    };

    stopExecute = () => {
        this.setState({
            execute: false
        });
    };

    render() {
        let position = this.state.startPosition || '00N';
        position = position.split('').join(' ');
        return (
            <div className={'app'}>
                <h1 className={'app-name'}>ROBOT WARS</h1>

                <div className="sidebar">
                    <div className={`control-panel`}>
                            <div className={'start-position'}>
                                
                                <input type="text"
                                    id="startPosition"
                                    maxLength={3}
                                    required
                                    pattern={'^[0-4][0-4][NEWS]$'}
                                    defaultValue={'00N'}
                                    onBlur={this.validateStartPosition}
                                    ref={(elm) => {
                                        this.startInput = elm
                                    }}
                                />
                                <br/>
                                <label
                                    htmlFor="startPosition"
                                >
                                    Arena Start Position (Eg; 00N):
                                </label>
                            </div>
                            <div className='commands'>
                                <button value='M' onClick={this.addCommand}>Move</button>
                                <button value='L' onClick={this.addCommand}>Left</button>
                                <button value='R' onClick={this.addCommand}>Right</button>
                            </div>
                            <div className='execution'>
                                
                                <input type="text" readOnly value={this.state.commands}/>
                                <br/>
                                <div className="ex-buttons">
                                    <button onClick={this.clear} className='secondary'>Clear</button>
                                    <button className={'cta'} onClick={this.execute}>GO!</button>
                                </div>

                            </div>
                            <div className='samples'>
                                <label>Samples:</label>
                                <ul>
                                    <li>
                                        <button value={'MMRMMRMRRM'} onClick={this.runSample}>MMRMMRMRRM</button>
                                    </li>
                                    <li>
                                        <button value={'LMLMLMLMM'} onClick={this.runSample}>LMLMLMLMM</button>
                                    </li>
                                    <li>
                                        <button value={'MMMMRMMMMRMMMMRMMMMR'} onClick={this.runSample}>Lap of Arena (from 0 0 N)</button>
                                    </li>
                                </ul>
                            </div>
                    </div>
                </div>
                <div className="arena-wrap">
                    <Arena
                        size={5}
                        position={position}
                        commands={this.state.commandsToExecute}
                        execute={this.state.execute}
                        onDone={this.stopExecute}
                    />
                </div>                    
                
            </div>
        )
    }
}

render(<App/>, document.getElementById("root"));
