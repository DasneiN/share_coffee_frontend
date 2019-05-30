import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../common/Header";
import EventDesc from "../../events/components/EventDesc";
import { getCookie } from "tiny-cookie";
import { Switch, Route } from "react-router-dom";
import TopicFront from "../TopicFront";
// import {Preloader} from '../../modules/Preloader'
import {
  GET_EVENTS,
  GET_ALL_TOPICS,
  GET_USER,
  SUBCR_USER_TO_TOPIC,
  SUBCR_USER_TO_EVENT,
  UNSUBCR_USER_FROM_EVENT,
  UNSUBCR_USER_FROM_TOPIC,
  GET_ALL_USER_SUBSCRIPTIONS,
} from "../../constants";
import { checkTokenTime } from "../../helpers/requests";
import Preloader from "../../modules/Preloader";

const getAllTopics = token => {
  // checkTokenTime(sessionStorage.getItem("tokenTimeOver"));
  return axios({
    method: "get",
    url: GET_ALL_TOPICS,
    headers: {
      Authorization: `Bearer ${token}`,
      mode: "cors",
      "Content-Type": "application/json",
    },
  });
};

const getAllUserSubscriptions = (token, userId) => {
  // checkTokenTime(sessionStorage.getItem("tokenTimeOver"));
  return axios({
    method: "get",
    url: `https://forgeserver.herokuapp.com/api/subscriptions/?userId=${userId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      mode: "cors",
      "Content-Type": "application/json",
    },
  });
};
const getUser = (token, id) => {
  // checkTokenTime(sessionStorage.getItem("tokenTimeOver"));
  return axios({
    method: "get",
    url: GET_USER(id),
    headers: {
      Authorization: `Bearer ${token}`,
      mode: "cors",
      "Content-Type": "application/json",
    },
  });
};

const subscribeUserToTopic = (topicId, userId, token) => {
  // checkTokenTime(sessionStorage.getItem("tokenTimeOver"));
  // const userId = sessionStorage.getItem("id");
  return axios({
    method: "post",
    url: `https://forgeserver.herokuapp.com/api/topics/${topicId}/${userId}/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const unsubsrcibeUserFromTopic = (topicId, userId, token) => {
  // checkTokenTime(sessionStorage.getItem("tokenTimeOver"));
  // const userId = sessionStorage.getItem("id");
  return axios({
    method: "delete",
    url: `https://forgeserver.herokuapp.com/api/topics/${topicId}/${userId}/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
//--------------------------------------------------------

const SubscriptionsPage = props => {
  const [topics, setTopics] = useState([]);
  const [userData, setUserData] = useState({});
  const [userTopics, setUserTopics] = useState([]);
  const [userTopicsIds, setUserTopicsIds] = useState([]);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [currentLoadingEvents, setCurrentLoadingEvents] = useState([]);
  const token = getCookie("token");
  //const userId = "5ce1147ca0c89f001e1c2a4b";
  const userId = sessionStorage.getItem("id");
  // console.log(userData);
  // console.log(topics);
  // console.log(userTopics);
  // console.log(userTopicsIds);
  // console.log(isUserDataLoaded)
  // console.log(currentLoadingEvents)

  const handleSubscriptionClick = topicId => {
    handleSubscribing(topicId, subscribeUserToTopic);
    setUserTopicsIds([...userTopicsIds, topicId]);
  };
  const handleUnsubscriptionClick = topicId => {
    handleSubscribing(topicId, unsubsrcibeUserFromTopic);
    setUserTopicsIds(userTopicsIds.filter(id => id !== topicId));
  };
  const handleSubscribing = async (topicId, subscribingFunction) => {
    setCurrentLoadingEvents([...currentLoadingEvents, topicId]);
    const result = await subscribingFunction(topicId, userId, token);
    setUserData(result.data.data);
    setCurrentLoadingEvents(
      currentLoadingEvents.filter(loadingEventId => loadingEventId !== topicId),
    );
  };
  //--------------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllTopics(token);
      setTopics(result.data.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUser(token, userId);
      setUserData(result.data.data);
      setIsUserDataLoaded(true);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllUserSubscriptions(token, userId);
      setUserTopics(result.data.data);
      setUserTopicsIds(result.data.data.map(event => event.topicId));
      setIsUserDataLoaded(true);
    };

    fetchData();
  }, []);

  const EventFull = () => (
    <EventDesc
      className="event"
      events={topics}
      userEventsIds={userTopicsIds}
      onSubscriptionClick={topicId => handleSubscriptionClick(topicId)}
      onUnsubscriptionClick={topicId => handleUnsubscriptionClick(topicId)}
      isLoading={!isUserDataLoaded}
      currentLoadingEvents={currentLoadingEvents}
    />
  );
  // console.log(userData);
  // console.log(isUserDataLoaded)
  return (
    <>
      {isUserDataLoaded ? (
        <>
          <Header
            isActive={true}
            // isAdmin={false}
            isAdmin={sessionStorage.getItem("isAdmin")}
            hasDepartment={true}
            avatar={sessionStorage.getItem("avatar")}
            name={`${sessionStorage.getItem("firstName")} ${sessionStorage.getItem("lastName")}`}
            location={props}
          />
          <main>
            <Switch>
              <Route exact path="/subscriptions/" component={EventFull} />
              <Route
                path="/subscriptions/:id"
                component={params => (
                  <TopicFront
                    userEventsIds={userTopicsIds}
                    onSubscriptionClick={topicId => handleSubscriptionClick(topicId)}
                    onUnsubscriptionClick={topicId => handleUnsubscriptionClick(topicId)}
                    isLoading={!isUserDataLoaded}
                    currentLoadingEvents={currentLoadingEvents}
                    {...params}
                  />
                )}
              />
            </Switch>
          </main>
        </>
      ) : (
        <div className="preload_center">
          <Preloader />
        </div>
      )}
    </>
  );
};

export default SubscriptionsPage;
