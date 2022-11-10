<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import interact from 'interactjs'

  interact('.draggable').draggable({
    inertia: true,
    autoScroll: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  
  })
  function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    console.log(x,y);
    
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}
</script>

<main>
  <div class="container">
    <div class="magnet draggable" >
      <div class="red" />
      <div class="blue" />
    </div>
  </div>
  
</main>

<style>
  .container{
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    padding: 0;
  }
  .magnet{
    display: flex;
    width: 200px;
    height: 50px;

  }
  .red {
    flex: 1;
    background-color: red;
  }
  .blue {
    flex: 1;
    background-color: blue;
  }
</style>