import React, { useState } from "react";
import PropTypes from "prop-types";
import List from "./List";
import { ReactComponent as ArrowIcon } from "../../icons/Arrow.svg";
import axios from "axios";
import { getCookie } from "tiny-cookie";
/**
 * Dropdown component for showing user events
 * @param events (array of label-value objects)
 * example:
 * [{name: "name1", place: "place1", time:"1st September"}, {name: "name2", place: "place2", time:"1st September"}]
 */
const EventsDropdown = ({ events }) => {
  const [isOpened, setIsOpened] = useState(false);

  // const getUserInfo = async id => {
  //   const result = await axios({
  //     url: `https://forgeserver.herokuapp.com/api/users/5ce5b8797247dc3860f0a747/upcoming`,
  //     method: "get",
  //     headers: {
  //       Authorization: `Bearer ${getCookie("token")}`,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(res => {
  //       return res;
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  //   // console.log(result.data);
  //   return result;
  // };

  const getUpcomingEvents = async userId => {
    const obj = {
      method: "get",
      url: `https://forgeserver.herokuapp.com/api/users/${userId}/upcoming`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        mode: "cors",
        "Content-Type": "application/json",
      },
    };
    const result = await axios(obj)
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
    return result;
  };

  return (
    <div
      onMouseLeave={() => {
        setIsOpened(false);
      }}
      className="event-list_container"
    >
      <button
        className="event-header"
        onClick={() => {
          // getUserInfo(sessionStorage.getItem("id"));
          // getUpcomingEvents(sessionStorage.getItem("id"));
          setIsOpened(!isOpened);
        }}
      >
        <span>My upcoming events ({events.length})</span>
        <span className={`event-arrow ${isOpened ? "event-rotated" : ""}`}>↓</span>
        {/*<ArrowIcon className={`event-arrow ${isOpened ? "event-rotated" : undefined}`} />*/}
      </button>
      {/*{isOpened && <List events={events} />}*/}
      {isOpened && (
        <div className="list">
          <List events={events} />{" "}
        </div>
      )}
    </div>
  );
};

EventsDropdown.propTypes = {
  events: PropTypes.array,
};

export default EventsDropdown;
