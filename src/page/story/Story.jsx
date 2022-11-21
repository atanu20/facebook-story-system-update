import React, { useRef, useEffect } from 'react';
import Rightbar from '../../component/rightbar/Rightbar';
import Sidebar from '../../component/sidebar/Sidebar';
import Navbar from '../../component/navbar/Navbar';
import './Story.css';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
const Story = () => {
  const { id } = useParams();

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

  return (
    <>
      <Navbar />
      <div className="storypage">
        <Sidebar ppid={id} />
        <Rightbar id={id} />
      </div>
    </>
  );
};

export default Story;
