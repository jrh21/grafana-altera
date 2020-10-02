import React, { Component } from 'react';

import { ThemeContext } from 'shared/contexts/ThemeContext';
import environmentService from 'services/api/environment.service';
import config from 'shared/config/config.json';
import { IEnvironment } from 'shared/models/model-data/environment.model';

interface IAlertaPanelHeaderProps {}

interface IAlertaPanelHeaderState {
  environments: IEnvironment[];
}

// Init state param request
const state = {
  filter: {
    status: config.filter.status
  }
};

export class AlertaPanelHeader extends Component<IAlertaPanelHeaderProps, IAlertaPanelHeaderState> {
  constructor(props: IAlertaPanelHeaderProps) {
    super(props);
    this.state = {
      environments: []
    };
  }

  static contextType = ThemeContext;

  componentDidMount() {
    this.getEnvironments();
    setInterval(this.getEnvironments, config.refresh_interval);
  }

  getEnvironments = async () => {
    environmentService.getEnvironments({ state })
      .then(res => {
        if (res) {
          this.setState({ environments: res.environments });
        }
      });
  };

  environments(): string[] {
    const result = this.state.environments.map(e => e.environment).sort();
    return ['ALL'].concat(result);
  }

  environmentCounts() {
    return this.state.environments.reduce((group: any, e) => {
      group[e.environment] = e.count;
      group.ALL = group.ALL + e.count;
      return group;
    }, { ALL: 0 });
  }

  render() {
    const theme = this.context;

    return (
      <div className={['v-tabs__bar', theme].join(' ')}>
        <div className="v-tabs__wrapper">
          <div className="v-tabs__container v-tabs__container--grow">
            <div className="v-tabs__slider-wrapper" style={{ left: '0px', width: '597px' }}>
              <div className="v-tabs__slider accent" />
            </div>
            {(this.state.environments && this.state.environments.length > 0) &&
              this.environments().map((env) => env &&
                <div className="v-tabs__div">
                  <a href={'#tab-' + env} className="v-tabs__item v-tabs__item--active">
                    { env }&nbsp;({ this.environmentCounts()[env] || 0 })
                  </a>
                </div>
              )
            }
            <div className="spacer" />
            <button type="button" className={['v-btn v-btn--flat v-btn--icon filter-active', theme].join(' ')}>
              <div className="v-btn__content">
                <i aria-hidden="true" className={['v-icon material-icons', theme].join(' ')}>filter_list</i>
              </div>
            </button>
            <div className="v-menu v-menu--inline">
              <div className="v-menu__activator">
                <button type="button" className={['v-btn v-btn--flat v-btn--icon', theme].join(' ')}>
                  <div className="v-btn__content">
                    <i aria-hidden="true" className={['v-icon material-icons', theme].join(' ')}>more_vert</i>
                  </div>
                </button>
              </div>
            </div>
            <span className="pr-2" />
          </div>
        </div>
      </div>
    );
  }
}