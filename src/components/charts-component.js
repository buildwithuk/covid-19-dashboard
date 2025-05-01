import React from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import window from 'chart.js';

class ChartsComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            country: props.country
        }
        this.statsData = {
            deaths: undefined,
            country: undefined,
            lastUpdate: undefined,
            cases: undefined,
            tests: undefined
        };

        this.historicData = [];

        this.fetchChartsData = this.fetchChartsData.bind(this);
        this.createStatisticsBarChart = this.createStatisticsBarChart.bind(this);
        this.createStatisticsPieChart = this.createStatisticsPieChart.bind(this);
        this.getDurationDate = this.getDurationDate.bind(this);
        this.removePlusSign = this.removePlusSign.bind(this);
        this.durationSelected = this.durationSelected.bind(this);
        this.createLineChart = this.createLineChart.bind(this);
        this.getCountry = this.getCountry.bind(this);
        this.sBarChart = undefined;
        this.spieChart = undefined;
        this.hLine = undefined;

        window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
        this.fetchChartsData();
        this.duration = [
            'Last one week',
            'Last two weeks',
            'Last three weeks',
            'Last one month'
        ];
        this.selectedDuration = this.duration[0];
    }

    componentDidUpdate() {

        let country = this.props.getSelectedCountry();
        this.fetchChartsData(country);
    }

    createStatisticsPieChart() {

        let item = document.getElementById('spie');

        if (item != null) {
            var color = Chart.helpers.color;
            this.spieChart = new Chart(item.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: ['Recovered', 'Active', 'Critical', 'New', 'Total'],
                    datasets:
                        [
                            {
                                backgroundColor: [
                                    color(window.chartColors.yellow).alpha(0.75).rgbString(),
                                    color(window.chartColors.red).alpha(0.75).rgbString(),
                                    color(window.chartColors.orange).alpha(0.75).rgbString(),
                                    color(window.chartColors.blue).alpha(0.75).rgbString(),
                                    color(window.chartColors.purple).alpha(0.75).rgbString()
                                ],
                                data: [
                                    this.statsData.cases.recovered,
                                    this.statsData.cases.active,
                                    this.statsData.cases.critical,
                                    this.removePlusSign(this.statsData.cases.new),
                                    this.statsData.cases.total
                                ]
                            }
                        ]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: this.statsData.country + ' - Last Updated: ' + this.statsData.lastUpdate
                    }
                }
            });
        }
    }

    createStatisticsBarChart() {

        let item = document.getElementById('sbar');

        if (item != null) {
            var color = Chart.helpers.color;
            this.sBarChart = new Chart(document.getElementById('sbar').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Cases', 'Deaths', 'Tests'],
                    datasets:
                        [
                            {
                                backgroundColor: color(window.chartColors.red).alpha(0.75).rgbString(),
                                label: 'New',
                                data: [this.removePlusSign(this.statsData.cases.new), this.removePlusSign(this.statsData.deaths.new)]
                            },
                            {
                                backgroundColor: color(window.chartColors.orange).alpha(0.75).rgbString(),
                                label: 'Total',
                                data: [this.statsData.cases.total, this.statsData.deaths.total, this.statsData.tests.total]
                            },
                            {
                                backgroundColor: color(window.chartColors.yellow).alpha(0.75).rgbString(),

                                label: 'Active',
                                data: [this.statsData.cases.active]
                            },
                            {
                                backgroundColor: color(window.chartColors.blue).alpha(0.75).rgbString(),
                                label: 'Critical',
                                data: [this.statsData.cases.critical]
                            },
                            {
                                backgroundColor: color(window.chartColors.purple).alpha(0.75).rgbString(),
                                label: 'Recovered',
                                data: [this.statsData.cases.recovered]
                            }
                        ]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: this.statsData.country + ' - Last Updated: ' + this.statsData.lastUpdate
                    }
                }
            });
        }
    }

    createLineChart() {

        let labels = [];

        let newCases = [];
        let totalCases = [];
        let totalDeaths = [];

        let m = new Map();
        let counter = 29;

        for (var i = 0; i < this.historicData.length; i++) {
            
            if (counter < 0) 
                break;

            if (this.historicData[i] && !m.has(this.historicData[i].day)) {
                m.set(this.historicData[i].day);
                labels.push(this.historicData[i].day);
                newCases[counter] = this.removePlusSign(this.historicData[i].cases.new);
                totalCases[counter] = this.historicData[i].cases.total;
                totalDeaths[counter] = this.historicData[i].deaths.total;
                counter--;
            
            } else {
                continue;
            }
        }
        
        var color = Chart.helpers.color;
        let item = document.getElementById('hline');
        if (item != null) {
            this.hLine = new Chart(item.getContext('2d'), {
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        position: 'top',
                        text: 'Trends for the last 25 observations'
                    }
                },
                type: 'line',
                data: {
                    labels: labels,
                    datasets:
                        [
                            { fill: false, label: 'Total Deaths', data: totalDeaths, borderColor: window.chartColors.red },
                            { fill: false, label: 'Total Cases', data: totalCases, borderColor: window.chartColors.blue },
                            { fill: false, label: 'New Cases', data: newCases, borderColor: window.chartColors.yellow }
                        ]
                }
            });
        }
    }

    getDurationDate() {
        let days = 0;

        if (this.selectedDuration == this.duration[0]) days = 7;
        else if (this.selectedDuration == this.duration[1]) days = 14;
        else if (this.selectedDuration == this.duration[2]) days = 21;
        else days = 30;

        let lastdate = new Date();
        lastdate.setDate(lastdate.getDate() - days);
        let t = lastdate.toLocaleDateString().split('/');

        if (t[0].length == 1) {
            t[0] = "0" + t[0];
        }

        let dateString = t[2] + "-" + t[0] + "-" + t[1];
        return dateString;
    }

    fetchChartsData(country) {

        if (country == null) {
            return;
        }

        if (this.hLine != null) {
            this.hLine.destroy();
            this.hLine = undefined;
        }

        if (this.sBarChart != null) {
            this.sBarChart.destroy();
            this.sBarChart = undefined;
        }

        if (this.spieChart != null) {
            this.spieChart.destroy();
            this.spieChart = undefined;
        }


        axios.get(`${process.env.REACT_APP_BASE_URL}statistics/${country}`).then((res) => {
            if (res) {

                this.statsData = {
                    deaths: res.data.response[0].deaths,
                    country: res.data.response[0].country,
                    lastUpdate: (new Date(res.data.response[0].time)).toUTCString(),
                    cases: res.data.response[0].cases,
                    tests: res.data.response[0].tests
                };

                this.createStatisticsBarChart();
                this.createStatisticsPieChart();
            }
        });

        axios.get(`${process.env.REACT_APP_BASE_URL}history/${country}`).then((res) => {

            if (res && res.data.response != null) {
                this.historicData = res.data.response;
                this.state.historicData = res.data.response;
                this.createLineChart();
            }
        });
    }

    removePlusSign(item) { 

        if (item) {
            if (item.includes("+")) {
                return parseInt(item.split("+")[1]);
            } else {
                return item;
            }
        } else {
            return item;
        }
    }

    getCountry() {
        return this.state.country;
    }

    durationSelected(event) {
        let index = event.target.selectedIndex;
        this.selectedDuration = this.duration[index];
        console.log(this.selectedDuration);
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row flex-justify-center charts-component">
                    <div className="stats-bar cell-6 fg-grayBlue">
                        <canvas id="sbar"></canvas>
                    </div>
                    <div className="stats-bar cell-6 fg-grayBlue">
                        <canvas id="spie"></canvas>
                    </div>
                </div>
                <div className="row charts-component">
                    <canvas id="hline" className="history-bar cell fg-grayBlue">
                    </canvas>
                </div>
            </div>
        )
    }
}

export default ChartsComponent;