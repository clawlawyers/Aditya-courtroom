import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import TimePickerValue from "./Clock"; // Assuming you have a separate TimePickerValue component
import { useDispatch } from "react-redux";
import { addSelectedTime } from "../../features/bookCourtRoom/selectedDatesTimesSlice";
import toast from "react-hot-toast";
import "./DateTime.module.css";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import { Tooltip } from "@mui/material";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import axios from "axios";
import { ArrowLeft, ArrowRight, CloseOutlined } from "@mui/icons-material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Container = styled.div`
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  width: 60%;
  max-width: 570px;
  max-height: 65vh;
  font-weight: 900;
  color: white;

  @media (max-width: 768px) {
    height: 90vw;
    width: 90vw;
  }

  @media (max-width: 480px) {
    height: 100vw;
    width: 100vw;
    padding: 10px;
  }
`;

const CalendarWrapper = styled.div`
  border-radius: 10px;
  width: fit-content;
  display: flex;
  justify-content: center;
  .custom-calendar {
    background: linear-gradient(100deg, #008080 0%, #15b3b3 100%);
    border-radius: 10px;
    border: 2px solid white;
  }
`;

// @media (max-width: 768px) and (max-height: 812px) {
//   transform: scale(1.3);
// }

// @media (max-width: 480px) {
//   transform: scale(1);
// }

const CalendarComponent = ({ scheduledSlots, setScheduledSlots }) => {
  const scrollContainerRef = useRef(null);
  const calendarRef = useRef();
  const [bookedDates, setBookedDates] = useState([]);
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const updateScale = () => {
      const viewportHeight = window.innerHeight;
      let scale;

      if (viewportHeight <= 480) {
        scale = 1;
      } else if (viewportHeight <= 768) {
        scale = 1.2;
      } else {
        scale = 1.5;
      }

      calendarRef.current.style.transform = `scale(${scale})`;
    };

    window.addEventListener("resize", updateScale);
    updateScale(); // Initial scale update

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        const response = await axios.get(
          `${NODE_API_ENDPOINT}/courtroom/book-courtroom`
        );
        const bookedDatesData = response.data;
        setBookingData(bookedDatesData);

        // Extract dates from the API response
        const formattedBookedDates = bookedDatesData.map((slot) =>
          dayjs(slot._id.date).format("YYYY-MM-DD")
        );
        setBookedDates(formattedBookedDates);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    getBookingDetails();
  }, []);

  function ServerDay(props) {
    const {
      highlightedDays = [],
      day,
      outsideCurrentMonth,
      bookedDates,
      ...other
    } = props;

    // Get the count of booked slots for the current day
    const formattedDay = dayjs(day).format("YYYY-MM-DD");
    const count = bookedDates.filter((date) => date === formattedDay).length;

    const isSelected =
      !outsideCurrentMonth && highlightedDays.includes(day.date());
    const isBooked = bookedDates.includes(formattedDay);

    let badgeContent;

    // Tooltip text
    const tooltipText = "";

    return (
      <Tooltip title={tooltipText} arrow>
        <Badge
          key={day.toString()}
          overlap="circular"
          badgeContent={badgeContent}
        >
          <PickersDay
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
          />
        </Badge>
      </Tooltip>
    );
  }

  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const dispatch = useDispatch();

  const minDate = dayjs().startOf("month");
  const maxDate = dayjs().add(1, "month").endOf("month");

  const handleDateChange = (date) => {
    localStorage.setItem("SelectedDate", dayjs(date).format("YYYY-MM-DD"));
    setSelectedDates([...selectedDates, date]);
    setSelectedTimes([]); // Reset selected times when date changes
    dispatch(addSelectedTime({ date: date.format("YYYY-MM-DD"), time: null }));
  };

  const addSlot = () => {
    if (selectedDates.length === 0 || selectedTimes.length === 0) {
      toast.error("Please Select at least one Date or Time");
      return;
    }

    const newSlot = {
      date: selectedDates[selectedDates.length - 1],
      time: selectedTimes,
    };

    // Check if the slot already exists in the scheduled slots
    const isDuplicate = scheduledSlots.some(
      (slot) =>
        slot.date === newSlot.date &&
        slot.time.length === newSlot.time.length &&
        slot.time.every((t, i) => t === newSlot.time[i])
    );

    if (isDuplicate) {
      toast.error("This slot has already been scheduled.");
      return;
    }

    setScheduledSlots([...scheduledSlots, newSlot]);
    setSelectedTimes([]); // Clear selected times after adding
    dispatch(addSelectedTime(newSlot));
  };

  const handleRemoveSlot = (index) => {
    const updatedSlots = scheduledSlots.filter((_, i) => i !== index);
    setScheduledSlots(updatedSlots);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    className: "px-2 py-10",
  };
  return (
    <div className="w-full h-full">
      <main className="w-full h-full flex  flex-col justify-center items-center gap-20">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col md:flex-row w-full h-full justify-center items-center gap-24">
            <CalendarWrapper ref={calendarRef} className="custom-calendar">
              <DateCalendar
                slots={{
                  day: (props) => (
                    <ServerDay {...props} bookedDates={bookedDates} />
                  ),
                }}
                className="custom-calendar"
                onChange={handleDateChange}
                minDate={minDate}
                maxDate={maxDate}
                shouldDisableDate={(date) =>
                  dayjs(date).isBefore(dayjs(), "day")
                }
                views={["day"]}
                sx={{
                  color: "white",

                  "& .MuiPickersDay-root": {
                    color: "white", // Color for the date numbers
                  },
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "#00ffa3", // Background color for selected date
                    color: "black", // Text color for selected date
                  },
                  "& .MuiPickersDay-root:hover": {
                    border: "1px solid #00ffa3", // Background color for hovered date
                  },
                  "& .MuiPickersDay-root.Mui-selected:focus": {
                    backgroundColor: "#00ffa3",
                  },
                  "& .MuiPickersDay-root.Mui-selected:hover": {
                    backgroundColor: "#00ffa3",
                  },
                  "& .MuiPickersDay-today": {
                    borderColor: "white", // Border color for today's date
                  },
                  "& .MuiTypography-root": {
                    color: "white", // Color for the month/year text
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white", // Color for the navigation arrows
                  },
                }}
              />
            </CalendarWrapper>
            <div className="border-2 border-white p-1 rounded-md bg-gradient-to-r from-teal-600 to-cyan-500">
              <h3 className="text-lg p-1 text-center font-semibold">
                Select Time:
              </h3>
              <TimePickerValue
                selectedTimes={selectedTimes}
                setSelectedTimes={setSelectedTimes}
                bookingData={bookingData}
                selectedDate={selectedDates}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 w-full h-full justify-center items-center">
            <div className="w-full flex flex-row justify-center">
              <button
                className="w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 bg-gradient-to-r from-teal-800 to-teal-400 p-2 rounded-md font-semibold"
                variant="contained"
                color="primary"
                onClick={addSlot}
              >
                Add to Slot
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#000000a6",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px",
                flexWrap: "wrap",
              }}
            >
              <h3 className="mb-5">Scheduled Slots:</h3>

              <div className="w-5/6 bg-white min-h-14 rounded-lg">
                <div className="slider-container min-h-14 gap-3">
                  <Slider {...settings}>
                    {scheduledSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="max-w-fit flex flex-row gap-2 items-center text-sm justify-center p-3  rounded-lg font-semibold bg-gradient-to-r from-teal-800 to-teal-400 text-white"
                      >
                        {new Date(slot.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                        })}
                        {","}
                        {slot.time}
                        <button
                          onClick={() => handleRemoveSlot(index)}
                          style={{
                            position: "relative",
                            top: "0",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "white",
                          }}
                        >
                          <CloseOutlined />
                        </button>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </LocalizationProvider>
      </main>
    </div>
  );
};

export default CalendarComponent;
