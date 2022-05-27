<script>
    export let name = "Doug"
    export let offsetWidth
    export let offsetHeight
</script>

<!-- <main bind:offsetWidth
	bind:offsetHeight>
	<p>Width: {offsetWidth} </p>
	<p>Height: {offsetHeight} </p>
</main> -->

<div bind:offsetWidth bind:offsetHeight>
    <p>Width: {offsetWidth}</p>
    <p>Height: {offsetHeight}</p>
    Heyyy
    <h1>Hello {name}!</h1>
</div>
