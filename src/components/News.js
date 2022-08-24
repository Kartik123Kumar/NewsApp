import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: '5',
    category:'general'
  }
  static propTypes = {
   country: PropTypes.string,
   pageSize: PropTypes.number,
   category: PropTypes.string
  }

 capitalizeFirstLetter=(string)=> {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
 
  constructor(props){
    super(props)
    console.log("I am constructoe of news state")
    this.state = {
         articles: [],
         loading: false,
         page: 1,
         totalResults:0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)}-News-Bhandar`;
  }

async UpdateNews(){
  this.props.setProgress(10);
  const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=191e4c5b0fac4cffae4286d42a512e37&page=${this.state.page}&pageSize=${this.props.pageSize}`;
  this.setState({loading: true})
  let data = await fetch(url);
  this.props.setProgress(30);
  let parseData = await data.json()
  this.props.setProgress(50);
  console.log(parseData);
  
  this.setState({
   totalResults: parseData.totalResults,
    articles: parseData.articles,
    loading: false
  })
  this.props.setProgress(100);
}

async componentDidMount(){
  //  let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d5584a68f61c4f1199d12305f34a1276&page=1&pageSize=${this.props.pageSize}`;
  //  let data = await fetch(url);
  //  let parseData = await data.json()
  //  console.log(parseData);

  //  this.setState({
  //   articles: parseData.articles,
  //   totalResults:parseData.totalResults,
  //   loading: false
  // });
  this.UpdateNews();
}

handelPrevClick= async ()=>{
  // console.log("Previous");
  // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d5584a68f61c4f1199d12305f34a1276&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
  // this.setState({loading: true})
  // let data = await fetch(url);
  // let parseData = await data.json()
  // console.log(parseData);
  
  // this.setState({
  //   page: this.state.page - 1,
  //   articles: parseData.articles,
  //   loading: false
  // })
   
  this.setState({page:this.state.page - 1});
  this.UpdateNews();
}


handelNextClick= async ()=>{
console.log("Next");
// if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
// let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d5584a68f61c4f1199d12305f34a1276&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
// this.setState({loading: true})
// let data = await fetch(url);
// let parseData = await data.json()
// console.log(parseData);

// this.setState({
//   page: this.state.page + 1,
//   articles: parseData.articles,
//   loading: false
// })
  this.setState({page:this.state.page + 1});
 this.UpdateNews();
}

fetchMoreData = async() => {
   this.setState({page:this.state.page+1})
   const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=191e4c5b0fac4cffae4286d42a512e37&page=${this.state.page}&pageSize=${this.props.pageSize}`;
  let data = await fetch(url);
  let parseData = await data.json()
  console.log(parseData);
  
  this.setState({
   totalResults: parseData.totalResults,
    articles: this.state.articles.concat(parseData.articles),
  })
  }
 
  render() {
    console.log("render")
    return (
      <div className="container my-4">
        <h1 className="text-center">Top Headlines on-{this.capitalizeFirstLetter(this.props.category)}</h1>
       {this.state.loading && <Spinner/>}

       <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length != this.state.totalResults}
          loader={<Spinner/>}>
  <div className="container">
        <div className="row">
        {this.state.articles.map((element)=>{
     return  <div className="col-md-3"  key={element.url}>
     <NewsItem title = {element.title?element.title.slice(0,44):""} description = {element.description?element.description.slice(0,44):""} imageurl={element.urlToImage} newsurl = {element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
     </div>
        })} 
        </div>
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button"  className="btn btn-dark" onClick={this.handelPrevClick}> &larr; Prvious</button>
        <button disabled={(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))} type="button" className="btn btn-dark" onClick={this.handelNextClick}>Next &rarr;</button>
        </div> */}
      </div>
      
    )
  }
}

export default News