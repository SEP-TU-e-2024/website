import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import api from "./api";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Line } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Chart() {
    const [count, setCount] = useState(0);
  const [problems, setProblems] = useState([]);

  // This will run once (in production mode!) when the component is mounted.
  useEffect(() => {
    getProblems();
  }, []);

  const getProblems = () => {
    api
      .get("problems")
      .then((response) => response.data)
      .then((data) => {
        setProblems(data);
        console.log(data);
      })
      .catch((error) => alert(error));
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  const labels = ["January", "February", "March", "April", "May", "June", "July"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Test Data",
        data: [65, 50, 51, 52, 59, 80, count],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>BenchLab Demo</h1>

      {/* generate all buttons from the labels list */}
      {/* {labels.map((label) => (
        <button key={label} onClick={() => setCount((count) => count + 1)}>
          {label}
        </button>
      ))} */}

      <br />

      <div></div>

      <div>
        <button onClick={() => setCount((count) => count - 10)}>-10</button>
        <button onClick={() => setCount((count) => count - 5)}>-5</button>
        <button onClick={() => setCount((count) => count - 1)}>-1</button>
        <button onClick={() => setCount(() => 0)}>0</button>
        <button onClick={() => setCount((count) => count + 1)}>+1</button>
        <button onClick={() => setCount((count) => count + 5)}>+5</button>
        <button onClick={() => setCount((count) => count + 10)}>+10</button>
      </div>

      <div style={{ width: "100%", height: "200px" }}>
        <Line options={options} data={data} />
      </div>
    </>
  );
}

export default Chart;
