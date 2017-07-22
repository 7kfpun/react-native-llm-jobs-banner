import React, { Component, PropTypes } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  icon: {
    width: 50,
    height: 50,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 6,
  },
  titleText: {
    fontSize: 12,
    color: '#424242',
  },
  text: {
    fontSize: 10,
    fontWeight: '300',
    marginTop: 4,
    color: '#424242',
  },
  button: {
    backgroundColor: '#79b34d',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
});

const getJob = (limit = 40) => {
  const URL = `https://api.lever.co/v0/postings/lalamove?limit=${limit}&mode=json`;
  return fetch(URL).then(res => res.json());
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

let timer;

export default class LLMJobsBanner extends Component {
  state = {
    url: 'https://jobs.lever.co/lalamove',
  }

  componentDidMount() {
    this.getJobs();
    timer = setInterval(() => this.getNewJob(), this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  getJobs() {
    const that = this;
    getJob().then((json) => {
      console.log('Fetch jobs:', json);
      if (json.length > 0) {
        that.setState({ jobs: json });
      }
      that.getNewJob();
    });
  }

  getNewJob() {
    if (!this.state.jobs) {
      return false;
    }

    const randomInt = getRandomInt(0, this.state.jobs.length - 1);
    this.setState({
      title: this.state.jobs[randomInt].text,
      hostedUrl: this.state.jobs[randomInt].hostedUrl,
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Linking.openURL(`${this.state.hostedUrl}?ref=${this.props.ref}`)}>
        <View style={[styles.container, { height: this.props.height }]}>
          <Image style={[styles.icon, { height: this.props.height, width: this.props.height }]} source={require('./logo.jpg')} />
          <View style={styles.body}>
            <Text style={styles.titleText}>Lalamove is hiring!</Text>
            <Text style={styles.text}>{this.state.title}</Text>
          </View>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Apply</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

LLMJobsBanner.defaultProps = {
  height: 50,
  interval: 3000,
  ref: 'react-native-llm-jobs-banner',
};

LLMJobsBanner.propTypes = {
  height: PropTypes.number,
  interval: PropTypes.number,
  ref: PropTypes.string,
};
