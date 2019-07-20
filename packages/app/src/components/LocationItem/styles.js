import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: {
    flex: 1,
    paddingRight: 15,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  caption: {
    color: '#8294a5',
    lineHeight: 22,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default styles;
