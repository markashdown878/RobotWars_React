import React from "react";

class Robot extends React.Component {
    render() {
        const { facing, ghost } = this.props;
        return <span className={`robot ${facing} ${ghost ? 'ghost' : ''} `}><i class="fas fa-microchip"></i></span>
    }
};

export default Robot;