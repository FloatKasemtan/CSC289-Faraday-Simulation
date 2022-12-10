<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import interact from 'interactjs'
  import { FaradayLaw } from './utils/faradayLaw';
  import { onMount } from 'svelte';
  import ApexCharts from 'apexcharts'

  let x1, y1, x2, y2 = 0
  let emf: number = 0
  let time = 0
  let array = [0]
  let angle = 0
  let polarity = 'ns'
  let showFieldline = false

  onMount(() => {

  var options = {
          series: [{
          data: array.slice()
        }],
          chart: {
          id: 'realtime',
          animations: {
            enabled: false,
            speed: 1000,
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          },
          height: 350,
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stoke: {
          curve: 'smooth'
        },
        title: {
          text: 'Voltage chart',
          align: 'left'
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: "numeric",
          range: 150,
          labels: {
            show: false
          }
        },
        yaxis: {
          max: 500,
          min: -500
        },
        legend: {
          show: false
        },
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
      
    setInterval(() => {
      time += 0.01;
      emf = parseInt(FaradayLaw({
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
      })[0].toFixed(2));
      if (array.length > 150) {
        array.shift()
      }
      if (polarity === 'ns') {
        array = [...array, -emf]
      }else {
        array = [...array, emf]
      }
      chart.updateSeries([{
        data: array
      }])
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
    getAngle()
  }

  function switchPolarity() {
    if (polarity === 'ns') {
      polarity = 'sn'
    } else {
      polarity = 'ns'
    }
  }

  function toggleFieldline() {
    showFieldline = !showFieldline
  }

  function getAngle() {  
    var temp = Math.atan2( 500 - (y1+ 64/2), 1000 -(x1+256/2)) * ( 180 / Math.PI )
    if (temp < 0) temp = 360 + temp; // range [0, 360)
    angle = temp
    
  }

</script>

<main>
  <div class="container">
    <div id="chart" style="position: absolute; right: 20px; width: 500px;"></div>
    <div class="draggable magnet {polarity} {showFieldline ? 'with-fieldline' : null}" />
    <div
      style="background-color: red; position: absolute; top: 500px; left: 1000px; width: 10px; height: 10px;"
    />
    emf: {emf}
    time: {Math.round(time)}
    angle: {angle}
    <br/>
    <button on:click={switchPolarity}>Switch magnet polarity</button>
    <label for="fieldline-checkbox">
      <input type="checkbox" id="fieldline-checkbox" value={showFieldline} on:change={toggleFieldline} />
      Fieldline
    </label>
  </div>
</main>

<style>
  .container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    padding: 0;
  }
  .magnet {
    display: flex;
    width: 256px;
    height: 64px;
    transform-style: preserve-3d; /* Required to make fieldline behind the magnet */
  }
  
  .magnet.ns {
    background-image: url('magnet-ns.png');
  }

  .magnet.sn {
    background-image: url('magnet-sn.png');
  }

  .magnet.with-fieldline::after {
    position: absolute;
    top: -480px; /* -512px + 32px) */
    left: -384px; /* -512px + 128px */
    transform: translateZ(-1px); /* Required to make fieldline behind the magnet */
  }

  .magnet.ns.with-fieldline::after {
    content: url('fieldline-ns.png');
  }

  .magnet.sn.with-fieldline::after {
    content: url('fieldline-sn.png');
  }
</style>
