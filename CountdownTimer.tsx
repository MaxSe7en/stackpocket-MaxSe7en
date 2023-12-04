import { formatTime } from '@/functions/msc';
import { useState, useEffect, useRef, MutableRefObject } from 'react';

interface Props {
  maxSeconds: number;
  initialSeconds: number;
}

const CountdownTimer: React.FC<Props> = ({ maxSeconds, initialSeconds }) => {

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const pathRef = useRef<SVGPathElement>(document.createElementNS("http://www.w3.org/2000/svg", "path"));
  const timerTextRef = useRef<any>(document.createElementNS("http://www.w3.org/2000/svg", "text"));
  const intervalRef = useRef<NodeJS.Timeout>();


  useEffect(() => {
    setTimeLeft(initialSeconds);

    // Clear any previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);//clearInterval(interval);
    }

    // Start a new interval
    startCountdown(maxSeconds, initialSeconds, pathRef, timerTextRef, intervalRef);

    return () => {
      // Clear interval on component unmount
      clearInterval(intervalRef.current);
    };
  }, [initialSeconds]);


  return (
    <svg
      //  viewBox="0 0 200 100"
      id="countdown-svg"
      width="288"
      height="70"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="60"
        y="10"
        rx="10"
        ry="10"
        width="220"
        height="50"
        stroke="white"
        fill="transparent"
        strokeWidth="5"
      />
      <rect
        id="white-rect"
        x="60"
        y="10"
        rx="10"
        ry="10"
        width="220"
        height="50"
        fill="transparent"
        strokeWidth="1"
        stroke="white"
      />
      <path
        d="M 70 10 
        h 200 
        a 10 10 0 0 1 10 10
        v 30
        a 10 10 0 0 1 -10 10
        h -200
        a 10 10 0 0 1 -10 -10
        v -30
        a 10 10 0 0 1 10 -10"
        fill="transparent"
        stroke="#ff6200"
        strokeWidth={4}
        style={{
          fill: "transparent",
          strokeLinecap: "round",
          strokeWidth: 3,
          transition: "stroke-dasharray 1s ease-in-out",
        }}
        ref={pathRef}
      />

      <text
        id="timer-text"
        x="170"
        y="40"
        textAnchor="middle"
        alignmentBaseline="middle"
        dominantBaseline="middle"
        fontSize="20"
        fill="white"
        ref={timerTextRef}
      ></text>
    </svg>
  );

};


function startCountdown(_seconds: number, timerLeft: number, pathRef: any, timerTextRef: any, intervalRef: React.MutableRefObject<NodeJS.Timeout | undefined>) {
  const timerText: any = timerTextRef.current;// document.getElementById("timer-text");
  const path: any = pathRef.current; //document.getElementById("progress-path");

  let time = timerLeft;
  const maxTime = _seconds;
  let timeRemaining = maxTime;
  let secondsPassed = 0;
  function updateTimer() {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const timerString = `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(
      seconds
    ).padStart(2, "0")}`;
    timerText.textContent = timerString;
    // console.log(pathRef.current.style)
    // // Adjust the width of the white rectangle based on the percentage remaining
    secondsPassed++;

    timeRemaining = timerLeft - secondsPassed;
    // Calculate the width of the white rectangle based on the remaining time
    const remainingPercentage = (seconds / _seconds) * 100;
    const newWidth = (remainingPercentage / 100) * 120;

    if (newWidth !== Infinity) {
      const totalLen = path.getTotalLength();

      // Calculate dash
      const dashLen = totalLen * (timeRemaining / maxTime);

      path.style.strokeDasharray = ` ${dashLen} ${totalLen} 0`;

    }

    time--;

    if (time < 0) {
      // clearInterval(interval);
      clearInterval(intervalRef.current)
    }
  }

  updateTimer(); // Initial update

  // const interval = setInterval(updateTimer, 1000);
  // Clear any previous interval
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  // Start a new interval and update the ref
  intervalRef.current = setInterval(updateTimer, 1000);
}
// function formatTime(time: number) {
//   return `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
// }

export default CountdownTimer;