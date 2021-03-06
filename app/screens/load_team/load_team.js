// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {RequestStatus} from 'mattermost-redux/constants';

export default class LoadTeam extends PureComponent {
    static propTypes = {
        navigator: PropTypes.object,
        notification: PropTypes.object,
        teams: PropTypes.object.isRequired,
        myMembers: PropTypes.object.isRequired,
        teamsRequest: PropTypes.object.isRequired,
        currentTeam: PropTypes.object,
        actions: PropTypes.shape({
            clearNotification: PropTypes.func.isRequired,
            goToNotification: PropTypes.func.isRequired,
            handleTeamChange: PropTypes.func.isRequired,
            initialize: PropTypes.func.isRequired
        }).isRequired,
        theme: PropTypes.object.isRequired
    };

    componentDidMount() {
        const {notification, currentTeam, myMembers, teams} = this.props;
        const {clearNotification, goToNotification} = this.props.actions;

        if (notification) {
            clearNotification();
            goToNotification(notification);
            return this.goToChannelView();
        }

        if (currentTeam && myMembers[currentTeam.id]) {
            return this.onSelectTeam(currentTeam);
        }

        return this.selectFirstTeam(teams, myMembers);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.teamsRequest.status === RequestStatus.STARTED &&
            nextProps.teamsRequest.status === RequestStatus.SUCCESS) {
            this.selectFirstTeam(nextProps.teams, nextProps.myMembers);
        }
    }

    selectFirstTeam(allTeams, myMembers) {
        const teams = Object.keys(myMembers).map((key) => allTeams[key]);
        const firstTeam = Object.values(teams).sort((a, b) => a.display_name.localeCompare(b.display_name))[0];

        if (firstTeam) {
            this.onSelectTeam(firstTeam);
        }
    }

    onSelectTeam(team) {
        const {handleTeamChange} = this.props.actions;
        handleTeamChange(team).then(this.goToChannelView);
    }

    goToChannelView = () => {
        const {actions, navigator, theme} = this.props;

        actions.initialize();
        navigator.resetTo({
            screen: 'Channel',
            animated: false,
            navigatorStyle: {
                navBarHidden: true,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                screenBackgroundColor: theme.centerChannelBg
            }
        });
    };

    render() {
        return null;
    }
}
