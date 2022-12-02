<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import Counter from "./lib/Counter.svelte";
  import interact from "interactjs";
  import { FaradayLaw } from "./utils/faradayLaw";
  import { onMount } from "svelte";

  let x1,
    y1,
    x2,
    y2 = 0;
  let emf: number = 0;
  let time = 0;

  onMount(() => {
    setInterval(() => {
      time += 0.1;
      emf = FaradayLaw({
        loop: 5,
        time: 0.1,
        changeInFlux: {
          magneticField: {
            xBefore: x1,
            xAfter: x2,
            yBefore: y1,
            yAfter: y2,
          },
          area: {
            width: 0.2,
            height: 0.2,
          },
          angle: 0,
        },
      })[0];
    }, 100);
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
  }
</script>

<main>
  <div class="container">
    <div class="draggable magnet">
      <div class="oval" />
      <div class="oval2" />
      <div class="oval3" />
      <div class="oval4" />
      <div class="magnet">
        <div class="red" />
        <div class="blue" />
      </div>
    </div>
    <div
      style="background-color: red; position: absolute; top: 500px; left: 1000px; width: 10px; height: 10px;"
    />
    emf: {emf}
    time: {time}
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
    width: 200px;
    height: 50px;
    justify-content: center;
  }
  .red {
    flex: 1;
    background-color: red;
  }
  .blue {
    flex: 1;
    background-color: blue;
  }

  .oval {
    width: 200px;
    height: 70px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    z-index: -1;
  }

  .oval2 {
    width: 200px;
    height: 70px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    bottom: 50%;
    z-index: -1;
  }

  .oval3 {
    width: 400px;
    height: 150px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    bottom: 50%;
    z-index: -1;
  }

  .oval4 {
    width: 400px;
    height: 150px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    z-index: -1;
  }
</style>
