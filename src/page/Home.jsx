import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import Carousel from 'react-elastic-carousel';
import Navbar from '../component/navbar/Navbar';
import Post from '../component/post/Post';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
// import styled from "styled-components";
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 500, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 5 },
];

const Home = () => {
  const [storyData, setStoryData] = useState([]);
  const his = useHistory();

  const timeout = useRef(null);

  const checkAuth = () => {
    axios
      .get('https://facebook-story-production.up.railway.app/isAuth', {
        headers: {
          'x-access-token': localStorage.getItem('Storytoken'),
        },
      })
      .then((response) => {
        //  console.log()
        if (!response.data.login) {
          his.push('/login');
        }
      });
  };

  useEffect(() => {
    timeout.current = setTimeout(checkAuth, 10);
    return function () {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
    //   checkAuth()
  }, []);

  const getData = async () => {
    const res = await axios.get(
      'https://facebook-story-production.up.railway.app/allstory'
    );
    setStoryData(
      res.data.sort((p1, p2) => {
        return new Date(p2.date) - new Date(p1.date);
      })
    );
  };
  useEffect(() => {
    getData();
  }, []);

  if (!storyData.length) {
    return (
      <>
        <Navbar home="home" />
        <div className="home">
          <CircularProgress />
          <p>No Stories are Available | Upload a Story</p>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar home="home" />

      <div className="home">
        <Carousel breakPoints={breakPoints}>
          {storyData.map((val, ind) => {
            return (
              <Post
                key={ind}
                id={val._id}
                postimg={val.postimg}
                userproimg={val.userproimg}
                user={val.user}
                savepostid={val.savepostid}
              />
            );
          })}
        </Carousel>
      </div>
    </>
  );
};

export default Home;
