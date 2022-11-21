import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostImg from '../somedet/PostImg';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Rightbar.css';
import axios from 'axios';
const Rightbar = ({ id }) => {
  const [storyData, setStoryData] = useState([]);
  const getData = async () => {
    const res = await axios.get(
      `https://facebook-story-production.up.railway.app/storybyid/${id}`
    );
    setStoryData(res.data);
    // console.log(res.data)
    // if(res.data.msg)
    // {
    //     setStoryData([])
    // }else{
    //     setStoryData(res.data)
    // }
  };
  useEffect(() => {
    getData();
  }, [id]);

  // console.log(storyData.postimg)

  return (
    <>
      <div className="rightbar">
        <div className="rightbarwrap">
          <div className="rightbartop">
            {storyData ? (
              <>
                <div className="rightuserboxwrap">
                  <img
                    src={
                      storyData.userproimg
                        ? `${storyData.userproimg}`
                        : `../image/postdemo.jpg`
                    }
                    alt=""
                    className="rightuserimg"
                  />
                  <span className="rightusername pl-3 pt-1">
                    {storyData.user}
                  </span>
                </div>
              </>
            ) : null}
          </div>
          <div className="rightbardet">
            {storyData ? (
              <>
                <PostImg
                  postimg={storyData.postimg}
                  savepostid={storyData.savepostid}
                  likes={storyData.likes}
                  views={storyData.views}
                  pid={storyData._id}
                  getData={getData}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Rightbar;
