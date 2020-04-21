import React from 'react';
import ListComponent from './list-component';
import ChartsComponent from './charts-component';

class MainComponent extends React.Component {

    constructor(props) {

        super(props);
        this.onCountrySelected = this.onCountrySelected.bind(this);
        this.state = { country: undefined };
        this.getSelectedCountry = this.getSelectedCountry.bind(this);
    }

    onCountrySelected(country) {
        this.setState({ country: country });
    }
    getSelectedCountry() {
        return this.state.country;
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="cell-3">
                        <ListComponent onCountrySelected={this.onCountrySelected}></ListComponent>
                    </div>
                </div>
                <div className="row">
                    <div className="cell-12">
                        <ChartsComponent getSelectedCountry={this.getSelectedCountry}></ChartsComponent>
                    </div>
                </div>
            </div>
        )
    };
}

export default MainComponent