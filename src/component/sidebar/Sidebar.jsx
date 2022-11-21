import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const Sidebar = ({ ppid }) => {
  const history = useHistory();
  // const {ppid}=useParams()
  const [storyData, setStoryData] = useState([]);
  const [search, setSearch] = useState('');
  const [onestoryData, setOneStoryData] = useState([]);
  const StoryUserId = localStorage.getItem('StoryUserId');
  const getMy = async () => {
    const res = await axios.get(
      'https://facebook-story-production.up.railway.app/allstory'
    );

    const oned = res.data.filter((val) => val.user_id === StoryUserId);
    setOneStoryData(oned);
  };
  const getData = async () => {
    const res = await axios.get(
      'https://facebook-story-production.up.railway.app/allstory'
    );
    const data = res.data.filter((val) => val.user_id !== StoryUserId);
    setStoryData(
      data.sort((p1, p2) => {
        return new Date(p2.date) - new Date(p1.date);
      })
    );
  };

  const handelviews = async (id, savepostid) => {
    const data = {
      postid: id,
      savepostid: savepostid,
    };
    // console.log(ppid)
    // console.log(id)
    if (ppid !== id) {
      const res = await axios.post(
        `https://facebook-story-production.up.railway.app/views`,
        data
      );
      // console.log(res.data)
      history.push(`/story/${id}`);
    } else {
      // console.log("hi")
      history.push(`/story/${id}`);
    }
  };

  useEffect(() => {
    getData();
    getMy();
  }, []);
  // console.log(onestoryData)
  return (
    <>
      <div className="sidebar">
        <div className="sidebarwrap">
          <div className="formbox">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Search By Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="userbox">
            {/* {
                        onestoryData && <div className="userboxwrap" onClick={()=>history.push(`/story/${onestoryData[0]._id}`)}>
                        <img src={onestoryData[0].userproimg ? `https://facebook-story-production.up.railway.app/images/profile/${onestoryData[0].userproimg}` : `../image/pro.png`} alt="" className="userimg" />
                        <span className="username pl-3 pt-1">{onestoryData[0].user}</span>
                    </div>
                    } */}
            {onestoryData?.map((val, ind) => {
              return (
                <>
                  <div
                    className="userboxwrap"
                    key={ind}
                    onClick={() => handelviews(val._id, val.savepostid)}
                  >
                    <img
                      src={
                        val.userproimg
                          ? `${val.userproimg}`
                          : `../image/pro.png`
                      }
                      alt=""
                      className="userimg"
                    />
                    <span className="username pl-3 pt-1">{val.user}</span>
                  </div>
                </>
              );
            })}

            <hr />

            {storyData
              ?.filter((val) => {
                if (search === '') {
                  return val;
                } else if (
                  val.user.toLowerCase().includes(search.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((val, ind) => {
                return (
                  <>
                    <div
                      className="userboxwrap"
                      key={ind}
                      onClick={() => handelviews(val._id, val.savepostid)}
                    >
                      <img
                        src={
                          val.userproimg
                            ? `${val.userproimg}`
                            : `../image/pro.png`
                        }
                        alt=""
                        className="userimg"
                      />
                      <span className="username pl-3 pt-1">{val.user}</span>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
