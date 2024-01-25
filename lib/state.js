const _ = require('lodash');
const fs = require('fs-extra');
const STATES = ['replay', 'proxy', 'immediate-failure', 'refresh-failure'];
const AUDIO_STATES = ['proxy', 'replay', 'delay-5s', 'delay-10s', 'delay-20s', 'failure'];
const PROXY_CONFIG = ['PROD', 'DEV', 'ALT_DEV'];

// setting to true will reset audioMode and mode to proxy
const PROXY_ALL = true;

const state = {
  audioMode: 'proxy',
  mode: 'proxy',
  proxy: 'PROD',
  scenario: '17-3-2022'
}

module.exports = {
  STATES,
  AUDIO_STATES,
  restore() {
    try {
      const loaded = fs.readJsonSync('./state.json');
      const isLoaded = _.isObject(loaded) && !_.isEmpty(loaded);
      const keys = Object.keys(state);
      console.log(keys);
      if(isLoaded) {
        const config = _.pickBy(loaded, (val, key) => {
          return _.isString(val) && keys.includes(key);
        });
        
        _.each(config, (val, key) => {
          if (PROXY_ALL && (key === 'audioMode' || key === 'mode')) { 
            val = 'proxy'
          }
          module.exports.set(key, val);
        });
        console.log(JSON.stringify(state));
      }
    } catch (error) {
      console.error('problem loading state', error);
    }
  },
  save() {
    fs.writeJsonSync('./state.json', state);
  },
  get(key) {
    return state[key];
  },

  set(key, value) {
    if(key === 'audioMode' && AUDIO_STATES.includes(value)) {
      state[key] = value;
      return;
    }

    if(key === 'mode' && STATES.includes(value)) {
      state[key] = value;
      return;
    }

    if(key === 'proxy' && PROXY_CONFIG.includes(value)) {
      state[key] = value;
      return;
    } 

    if(key === 'scenario') {
      state[key] = value;
      return;
    }

    if(key === 'overview') {
      state[key] = value;
      return;
    }

    throw new Error(`unable to set ${key} to ${value}`);
  }
};
