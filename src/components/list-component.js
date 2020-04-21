import React from 'react';
import axios from 'axios';

class ListComponent extends React.Component {

    constructor(props) {

        super(props);
        this.fetchListItems = this.fetchListItems.bind(this);
        this.countrySelected = this.countrySelected.bind(this);
        this.state = {
            countries: []
        }
        this.countries = [];
    }

    fetchListItems() {
        axios.get('http://localhost:5000/api/countries/list').then((res) => {
            
            if (res) {
                this.countries = res.data.response;
                this.countries.splice(0, 1, 'All');
                let selectedCountry = this.countries[0];
                this.props.onCountrySelected(selectedCountry);
                this.setState({ countries: this.countries});
            } else {
                this.setState({ countries: null });
            }
        }).catch(item => {
            this.setState({ countries: null });
        });
    }
    
    componentDidMount() {
        this.fetchListItems();
    }

    countrySelected(val, option, item) {
        let index = val.target.selectedIndex;
        let selectedCountry = this.countries[index];
        this.props.onCountrySelected(selectedCountry);
    }

    render() {

        if (this.state.countries != null && this.state.countries.length == 0) {
            return (
                <div className="lc-main-div">
                    <div data-role="activity" data-type="ring" data-style="color"></div>
                </div>
            );
        }

        if (this.state.countries != null && this.state.countries.length > 0) {
            return (
                <div className="lc-main-div">
                    <h6 className="fg-grayMouse">Country</h6>
                    <select data-clear-button="true" onChange={this.countrySelected}>
                        {
                            this.state.countries.map((item, index) => <option key={index} value={item}>{item}</option>)
                        }
                    </select>
                </div>
            );
        } else if (this.state.countries == null) {
            return (<div className="lc-main-div">
                <h6 className="fg-grayMouse">It appears the API is not available ! Thats bad</h6>
            </div>
            );
        }
    }
}

export default ListComponent;