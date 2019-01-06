import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from 'reactstrap';
import './App.css';
import CarItem from './CarouselItem.js'

const url = "http://54.191.197.111/users/66"

//The four panels of the carousel with the index of the first element in that panel
const carouselItems = [{id:1,startPos:0},{id:2,startPos:4},{id:3,startPos:8},{id:4,startPos:12}];

class App extends Component {

  
  state = {
    itemList: [], //The list of the 16 items loaded
    nextItems: [], //The four preloaded items
    activeIndex: 0, //The active panel of the carousel
  }

  //When the component mounts we fetch all the needed data
  //To reduce visible latency we fetch the data by panels of 4
  componentDidMount(){

    //We fetch the first 4 and directly set them in the state so that they appear for the user
    axios.get(url+"/items?amt=4").then(res => {
      this.setState({itemList: res.data.items},() => {

        //Once the state is set we start loading the others, this time we have to 
        //pass as seen the items we already loaded, for that use the getSeenList() function below
        axios.get(url+"/items?amt=4", {
          params: {
            seen: this.getSeenList(),
          },
          paramsSerializer: params => {

            //qs is used to correctly format the list of ids into the correct params
            return qs.stringify(params, { indices: false });
          }
        }).then(res => {

          //We concatenate the two arrays and update the state
          let itemList = this.state.itemList.concat(res.data.items);
          this.setState({itemList: itemList},() => {

            //We repeat two more times
            axios.get(url+"/items?amt=4", {
              params: {
                seen: this.getSeenList(),
              },
              paramsSerializer: params => {
                return qs.stringify(params, { indices: false });
              }
            }).then(res => {
              let itemList = this.state.itemList.concat(res.data.items);
              this.setState({itemList: itemList}, () => {
                axios.get(url+"/items?amt=4", {
                  params: {
                    seen: this.getSeenList(),
                  },
                  paramsSerializer: params => {
                    return qs.stringify(params, { indices: false });
                  }
                }).then(res => {
                  let itemList = this.state.itemList.concat(res.data.items);

                  //The 16 items are now loaded and as we update the state we also get 4 more items
                  //to fetch early so that the user doesn't have to wait, we put them in an other list
                  this.setState({itemList: itemList}) 
                  axios.get(url+"/items?amt=4", {
                    params: {
                      seen: this.getSeenList(),
                    },
                    paramsSerializer: params => {
                      return qs.stringify(params, { indices: false });
                    }
                  }).then(res => {
                    this.setState({nextItems: res.data.items})
                  })
                });
              });
            });
          });
        });
      });
    });
  }

  //Returns a list of the ids of all items that are loaded
  getSeenList = () => {
    let idList = [];
    this.state.itemList.forEach(item => {
      idList.push(item.id);
    })
    this.state.nextItems.forEach(item => {
      idList.push(item.id);
    })
    return(idList)
  }

  //Triggers when a users likes or dislikes an item
  //Three operations are axecuted asynchronously:
  //Posting the rating, Loading a new item, Replacing the current one with one of the four preloaded
  //This is where having four preloaded items is important because the user has to rate 5
  //items before a new one is loaded (which is possible since it is done asynchronously) for
  //there to be a problem. It exposes a problem but reduces latency drasticly.
  rateItem = (id, rating) => () => {
    axios.post(url+`/items/${id}`, {rating: rating})

    axios.get(url+"/items?amt=1", {
      params: {
        seen: this.getSeenList(),
      },
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      }
    }).then(res => {
      let nextItems = this.state.nextItems.concat(res.data.items);
      this.setState({nextItems: nextItems});
    });

    let itemList = this.state.itemList.slice();
    let nextItems = this.state.nextItems.slice();
    itemList = itemList.map(item => {
      if(item.id === id){
        return nextItems[0]
      } else {
        return item
      }
    });
    nextItems.splice(0, 1)
    this.setState({itemList: itemList, nextItems: nextItems});
  }

  //Follow all the functions linked to the carousel
  onExiting = () => {
    this.animating = true;
  }

  onExited = () => {
    this.animating = false;
  }

  next = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === carouselItems.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? carouselItems.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex = (newIndex) => {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }


  render() {
    const activeIndex = this.state.activeIndex;

    //Each of the carousel panels in it is a CarItem which receives 4 items from the itemList as
    //well as the rate function
    const slides = carouselItems.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.id}
        >
          <CarItem data={this.state.itemList.slice(item.startPos,item.startPos+4)} rate={this.rateItem} />
        </CarouselItem>
      );
    });

    return (
      <div className="App" >
      <h1 className="App-text">Top recommendations for you:</h1>

      {/*The carousel is composed of the controller which contains an indicator of
       the active panel and to arrows to cycle through*/}
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
        interval={false}
      >
        <CarouselIndicators items={carouselItems} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
      </Carousel>

      </div>
    );
  }
}

export default App;
