<script lang="ts">
  import interact from "interactjs";
  import { FaradayLaw } from "./utils/faradayLaw";
  import { onMount } from "svelte";
  import ApexCharts from "apexcharts";
  import emfIcon from "/lightning.png";
  import timeIcon from "/clock.png";
  import angleIcon from "/angle.png";
  import coilPic from "/coil.png";
  import magnetNS from "/magnet-ns.png";
  import magnetSN from "/magnet-sn.png";
  import fieldlineNS from "/fieldline-ns.png";
  import fieldlineSN from "/fieldline-sn.png";

  let x1,
    y1,
    x2,
    y2 = 0;
  let emf: number = 0;
  let time = 0;
  let array = [0];
  let angle = 0;
  let polarity = "ns";
  let showFieldline = false;

  onMount(() => {
    var options = {
      series: [
        {
          data: array.slice(),
        },
      ],
      chart: {
        id: "realtime",
        animations: {
          enabled: false,
          speed: 1000,
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        height: 350,
        type: "line",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stoke: {
        curve: "smooth",
      },
      title: {
        text: "Voltage chart",
        align: "left",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "numeric",
        range: 150,
        labels: {
          show: false,
        },
      },
      yaxis: {
        max: 500,
        min: -500,
      },
      legend: {
        show: false,
      },
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    setInterval(() => {
      time += 0.01;
      emf = parseInt(
        FaradayLaw({
          loop: 5,
          time: 0.01,
          changeInFlux: {
            magneticField: {
              xBefore: x1,
              xAfter: x2,
              yBefore: y1,
              yAfter: y2,
            },
            area: {
              width: 0.4,
              height: 0.4,
            },
            angle: angle,
          },
        })[0].toFixed(2)
      );
      if (array.length > 150) {
        array.shift();
      }
      if (polarity === "ns") {
        array = [...array, -emf];
      } else {
        array = [...array, emf];
      }
      chart.updateSeries([
        {
          data: array,
        },
      ]);
    }, 10);

    interact(".draggable").draggable({
      listeners: {
        move: dragMoveListener,
      },
      inertia: true,
    });
  });

  interact(".draggable").draggable({
    inertia: true,
    autoScroll: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end(event) {
        var textEl = event.target.querySelector("p");

        textEl &&
          (textEl.textContent =
            "moved a distance of " +
            Math.sqrt(
              (Math.pow(event.pageX - event.x0, 2) +
                Math.pow(event.pageY - event.y0, 2)) |
                0
            ).toFixed(2) +
            "px");
      },
    },
  });
  function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    x1 = x2;
    y1 = y2;
    x2 = x;
    y2 = y;
    // translate the element
    target.style.transform = "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
    getAngle();
  }

  function switchPolarity() {
    if (polarity === "ns") {
      polarity = "sn";
    } else {
      polarity = "ns";
    }
  }

  function toggleFieldline() {
    showFieldline = !showFieldline;
  }

  function getAngle() {
    var temp =
      Math.atan2(500 - (y1 + 64 / 2), 750 - (x1 + 256 / 2)) * (180 / Math.PI);
    if (temp < 0) temp = 360 + temp; // range [0, 360)
    angle = temp;
  }
</script>

<main>
  <div class="container">
    <div id="chart" class="chart" />
    <!-- <div
      class="draggable magnet {polarity} {showFieldline
        ? 'with-fieldline'
        : null}"
    /> -->
    <div class="draggable magnet">
      <img
        src={polarity === "ns" ? magnetNS : magnetSN}
        style="z-index: 1;"
        alt="magnet-ns"
        class="magnet"
      />
      {#if showFieldline}
        <img
          style="position: absolute; width: 700px; translate: -32% -45%;"
          src={polarity === "sn" ? fieldlineSN : fieldlineNS}
          alt="FSN"
        />
      {/if}
    </div>
    <img class="coil" src={coilPic} alt="coil" />
    <div class="details">
      <div class="sub-detail">
        <img src={emfIcon} alt="emf" class="icon" />
        <span style="font-weight: 600;">emf: &nbsp;</span>
        {emf} volt
      </div>
      <div class="sub-detail">
        <img src={timeIcon} alt="clock" class="icon" />
        <span style="font-weight: 600;">time: &nbsp;</span>
        {Math.round(time)} seconds
      </div>
      <div class="sub-detail">
        <img src={angleIcon} alt="angle" class="icon" />
        <span style="font-weight: 600;">angle: &nbsp;</span>
        {angle.toFixed(0)} degrees
      </div>
    </div>
    <div class="checkbox-container">
      <div class="toggle-pill-color">
        <input
          type="checkbox"
          id="pill3"
          name="check"
          on:change={toggleFieldline}
        />
        <label for="pill3" />
      </div>
      <span style="font-size: 1.2rem; font-weight: 500;">Show fieldline</span>
    </div>
    <button class="button" on:click={switchPolarity}
      >Switch magnet polarity</button
    >
  </div>
</main>

<style>
  .container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    padding: 0;
    background-color: #eff5f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .magnet {
    display: flex;
    width: 256px;
    height: 64px;
    transform-style: preserve-3d; /* Required to make fieldline behind the magnet */
  }

  .details {
    width: 300px;
    height: 140px;
    display: flex;
    font-size: 1.7rem;
    border-radius: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    margin-left: 20px;
    margin-top: 20px;
    padding: 20px;
    display: flex;
    background-color: white;
    flex-direction: column;
  }

  .sub-detail {
    display: flex;
    margin: 5px;
  }

  .icon {
    height: 35px;
    width: 35px;
    margin-right: 10px;
  }

  .coil {
    position: absolute;
    top: 500px;
    left: 750px;
    translate: -50% -50%;
    width: 300px;
    height: 200px;
  }

  .button {
    margin-top: 20px;
    background-color: #13aa52;
    border: 1px solid #13aa52;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    height: 50px;
    font-size: 1.2rem;
    font-weight: 400;
    margin-left: 20px;
    outline: none;
    outline: 0;
    padding: 10px 25px;
    text-align: center;
    transform: translateY(0);
    transition: transform 150ms, box-shadow 150ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .button:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0 3px 9px 0;
    transform: translateY(-2px);
  }

  .toggle-pill-color input[type="checkbox"] {
    display: none;
  }
  .toggle-pill-color input[type="checkbox"] + label {
    display: block;
    position: relative;
    width: 3em;
    height: 1.6em;
    margin: 20px;
    border-radius: 1em;
    background: #e84d4d;
    box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    -webkit-transition: background 0.1s ease-in-out;
    transition: background 0.1s ease-in-out;
  }
  .toggle-pill-color input[type="checkbox"] + label:before {
    content: "";
    display: block;
    width: 1.2em;
    height: 1.2em;
    border-radius: 1em;
    background: #fff;
    box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 0.2em;
    top: 0.2em;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  .toggle-pill-color input[type="checkbox"]:checked + label {
    background: #47cf73;
  }
  .toggle-pill-color input[type="checkbox"]:checked + label:before {
    box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.2);
    left: 1.6em;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    width: 340px;
    height: 70px;
    border-radius: 10px;
    margin-left: 20px;
    margin-top: 20px;
    background-color: white;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  .chart {
    position: absolute;
    margin: 20px;
    right: 0;
    width: 550px;
    padding: 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    background-color: white;
    border-radius: 10px;
  }
</style>
