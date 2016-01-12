import React, {PropTypes, Component} from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';

const pkg = window.require('./package.json');
const https = window.require('https');
const semver = window.require('semver');

export default class VersionChecker extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            checking: false,
            latest: null,
        };
    }


    handleVersionCheck() {
        this.setState({checking: true});

        let rsp = "";
        https.get(pkg.latest, (res) => {
            res.on('data', (chunk) => {
                rsp += chunk;
            });

            res.on('end', () => {
                const data = JSON.parse(rsp);
                console.log("Got result", data);
                this.setState({
                    checking: false,
                    latest: data,
                });
            });
        }).on('error', (err) => {
            console.error("Error checking version", pkg.latest, err);
        });
    }


    render() {
        const current = pkg.version;
        const latest = this.state.latest && this.state.latest.version;
        const later = latest && semver.gt(latest, current);

        let status = '';
        if (later) {
            status = <p>The latest version is {latest.version}</p>
        } else if (latest) {
            status = <p>You're up to date!</p>
        }

        return <div>
                   <p>You're running build {current}</p>
                   {status}
                   <RaisedButton
                        label="Check for an update"
                        onTouchTap={this.handleVersionCheck.bind(this)}
                        disabled={this.state.checking}
                   />
               </div>
    }
}
