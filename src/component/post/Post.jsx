import React from 'react';
import { useHistory } from 'react-router-dom';
import './Post.css';
import axios from 'axios';
const Post = ({ id, postimg, userproimg, user, savepostid }) => {
  const history = useHistory();
  const handelviews = async () => {
    const data = {
      postid: id,
      savepostid: savepostid,
    };
    const res = await axios.post(`https://story-node.onrender.com/views`, data);
    // console.log(res.data)
    history.push(`/story/${id}`);
  };
  return (
    <>
      <div className="story" onClick={handelviews}>
        <img
          src={postimg ? `${postimg}` : `../image/postdemo.jpg`}
          alt="story"
          className="storyimg"
        />
        <div className="box">
          <img
            src={userproimg ? `${userproimg}` : `../image/pro.png`}
            alt="pro"
            className="profile"
          />{' '}
          <span className="usenam">{user}</span>
        </div>
      </div>
    </>
  );
};

export default Post;
