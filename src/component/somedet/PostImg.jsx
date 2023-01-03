import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const PostImg = ({ postimg, savepostid, likes, views, pid, getData }) => {
  const [isliked, setIsLiked] = useState(false);
  const [postlikes, setPostLikes] = useState([]);
  const StoryUserId = localStorage.getItem('StoryUserId');

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

  const checkLike = async () => {
    const data = {
      postid: pid,
      uid: StoryUserId,
      savepostid: savepostid,
    };
    const res = await axios.post(
      'https://story-node.onrender.com/checklike',
      data
    );
    if (res.data.submit) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };
  const handelLike = async () => {
    const data = {
      savepostid,
      postid: pid,
      uid: StoryUserId,
    };
    const res = await axios.post('https://story-node.onrender.com/like', data);
    Likeusers();
    getData();
    checkLike();
  };
  const Likeusers = async () => {
    const data = {
      savepostid,
      postid: pid,
    };
    const res = await axios.post(
      'https://story-node.onrender.com/likeusers',
      data
    );
    getData();
    setPostLikes(res.data);
  };

  useEffect(() => {
    checkLike();
    Likeusers();
  }, [pid]);
  return (
    <>
      <img
        src={postimg ? `${postimg}` : `../image/postdemo.jpg`}
        alt=""
        className="rightphoto"
      />
      <div className="rightlike">
        <div className="likebox">
          {isliked ? (
            <>
              <i class="fa fa-heart" aria-hidden="true"></i>{' '}
              <HtmlTooltip
                title={
                  <React.Fragment>
                    {postlikes ? (
                      <>
                        {postlikes?.map((val, ind) => (
                          <Typography key={ind} color="inherit">
                            {val.name}
                          </Typography>
                        ))}
                      </>
                    ) : (
                      <Typography color="inherit">no likes</Typography>
                    )}
                  </React.Fragment>
                }
              >
                <span>{likes}</span>
              </HtmlTooltip>
            </>
          ) : (
            <>
              <i
                class="fa fa-heart-o"
                aria-hidden="true"
                onClick={handelLike}
              ></i>{' '}
              <HtmlTooltip
                title={
                  <React.Fragment>
                    {postlikes ? (
                      <>
                        {postlikes?.map((val, ind) => (
                          <Typography key={ind} color="inherit">
                            {val.name}
                          </Typography>
                        ))}
                      </>
                    ) : (
                      <p>no likes</p>
                    )}
                  </React.Fragment>
                }
              >
                <span>{likes}</span>
              </HtmlTooltip>
            </>
          )}
        </div>
        <div className="likebox">
          <i class="fa fa-eye" aria-hidden="true"></i> <span>{views}</span>
        </div>
      </div>
    </>
  );
};

export default PostImg;
