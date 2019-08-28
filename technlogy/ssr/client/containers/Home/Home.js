import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getHomeList } from './store/action.js'
import styles from './css/home.css';
import WithStyle from '../../../withStyle';
import { Helmet } from 'react-helmet';

class Home extends Component {
  getLists(){
     const { list } = this.props
     return list.map(item => <div key={item.id}>{item.title}</div>)        
  }
  componentDidMount() {
    if (!this.props.list.length) {
       this.props.getList();
     }
  }
  render() {
    return(
        <>
        <Helmet>
           <title>这是一个react同构技术栈的实践</title>
           <meta name='description' content="React-ssr项目" />
        </Helmet>
        <div>
        <div>aaaaaa</div>
          {this.props.list.length !==0?this.getLists():null}
        </div>
        </>
    )
  }
}
const mapStateToProps = state => ({
  list: state.home.list,
})

const mapDispatchToProps = dispatch => ({
    getList() {
      dispatch(getHomeList());
    }
})
const exportHome = connect(mapStateToProps, mapDispatchToProps)(WithStyle(Home,styles));

exportHome.loadData = (store) => {
  return store.dispatch(getHomeList())
};
export default exportHome;