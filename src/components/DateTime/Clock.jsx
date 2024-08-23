import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addSelectedTime } from "../../features/bookCourtRoom/selectedDatesTimesSlice";
import styled, { css, keyframes } from "styled-components";
import dayjs from "dayjs";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import axios from "axios";

const colorChange = keyframes`
  0% {
    background-image: linear-gradient(to right, #00ffa3 0%, transparent 100%);
  }
  100% {
    background-image: linear-gradient(to right, #00ffa3 100%, transparent 0%);
  }
`;

const Button = styled.button`
  color: black;
  padding: 10px 40px;
  border-bottom: 2px solid white;
  cursor: pointer;
  margin-bottom: 10px;
  text-align: left;

  ${(props) =>
    props.isSelected &&
    css`
      animation: ${colorChange} 0.25s ease-in-out forwards;
    `}

  ${(props) => {
    if (props.bookingCount >= 4) {
      return css`
        background-color: red;
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
      `;
    } else if (props.bookingCount === 2) {
      return css`
        background-color: yellow;
      `;
    } else {
      return css`
        background-color: transparent;
      `;
    }
  }}

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
      cursor: not-allowed;
    `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 54vh;
  overflow-y: scroll;
`;

export default function TimePickerValue({ selectedTimes, setSelectedTimes }) {
  const [bookingData, setBookingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const storedSelectedDate = localStorage.getItem('SelectedDate');

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        const response = await axios.get(`${NODE_API_ENDPOINT}/courtroom/book-courtroom`);
        const bookedDatesData = response.data;

        const dateHourMap = bookedDatesData.reduce((acc, slot) => {
          const date = dayjs(slot._id.date).format("YYYY-MM-DD");
          const hour = slot._id.hour;
          const bookingCount = slot.bookingCount;
          if (!acc[date]) {
            acc[date] = {};
          }
          acc[date][hour] = bookingCount;
          return acc;
        }, {});

        if (storedSelectedDate) {
          const formattedDate = dayjs(storedSelectedDate).format("YYYY-MM-DD");
          setBookingData(dateHourMap[formattedDate] || {});
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setIsLoading(false);
      }
    };

    getBookingDetails();
  }, [storedSelectedDate]);

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : i;
    return `${hour}:00`;
  });

  const currentHour = dayjs().hour();
  const currentDate = dayjs().format("YYYY-MM-DD");
  const isToday = storedSelectedDate === currentDate;

  const dispatch = useDispatch();

  const handleTimeClick = (time) => {
    dispatch(addSelectedTime(time));

    setSelectedTimes((prevSelectedTimes) => {
      if (prevSelectedTimes.includes(time)) {
        return [];
      } else {
        return [time];
      }
    });
  };

  return (
    <Container>
      {times.map((time, index) => {
        const hour = parseInt(time.split(":")[0], 10);
        const bookingCount = bookingData[hour] || 0;

        return (
          <Button
            key={index}
            onClick={() => handleTimeClick(time)}
            isSelected={selectedTimes.includes(time)}
            bookingCount={bookingCount}
            disabled={isToday && hour < currentHour} // Disable buttons for times before the current hour only for today
            className={`${
              selectedTimes.includes(time) ? "text-black" : "text-white"
            } font-semibold text-center`}
          >
            {time}
          </Button>
        );
      })}
    </Container>
  );
}
